class AnalyticsController < ApplicationController
  before_action :set_time_range, only: [ :kpis, :bids_over_time, :top_products, :all_products, :product_count, :market_trends ]

  def kpis
    user_id = params[:user_id]
    role = params[:role] || "admin"

    kpis = {
      active_auctions: active_auctions_count(user_id, role),
      live_bids_per_min: live_bids_per_minute,
      total_revenue: total_revenue_for_period(user_id, role),
      conversion_rate: conversion_rate_for_period,
      items_sold: items_sold_count(user_id, role),
      avg_bid_value: avg_bid_value_for_period,
      watchlist_count: total_watchlist_count,
      time_to_first_bid: avg_time_to_first_bid
    }

    # Calculate deltas (24h change)
    previous_period_start = @start_time - (@end_time - @start_time)
    previous_period_end = @start_time

    kpis[:deltas] = {
      active_auctions: active_auctions_count(user_id, role, previous_period_start, previous_period_end),
      total_revenue: total_revenue_for_period(user_id, role, previous_period_start, previous_period_end),
      items_sold: items_sold_count(user_id, role, previous_period_start, previous_period_end)
    }

    render json: kpis
  end

  def bids_over_time
    user_id = params[:user_id]
    interval = params[:interval] || "hour" # hour, day

    bids_query = Bid.where(created_at: @start_time..@end_time)
    bids_query = bids_query.joins(auction_item: :auction).where(auctions: { created_by: user_id }) if user_id && params[:role] == "seller"

    if interval == "hour"
      data = bids_query.group(Arel.sql("DATE_TRUNC('hour', bids.created_at)"))
        .order(Arel.sql("DATE_TRUNC('hour', bids.created_at)"))
        .count
        .map { |time, count| { time: time.iso8601, count: count } }
    else
      data = bids_query.group(Arel.sql("DATE_TRUNC('day', bids.created_at)"))
        .order(Arel.sql("DATE_TRUNC('day', bids.created_at)"))
        .count
        .map { |time, count| { time: time.iso8601, count: count } }
    end

    render json: { data: data, interval: interval }
  end

  def top_products
    user_id = params[:user_id]
    limit = params[:limit] || 10

    products_query = Product.joins(auction_items: :bids)
      .where(bids: { created_at: @start_time..@end_time })
      .group("products.id", "products.name", "products.description")
      .select("products.id, products.name, products.description, COUNT(bids.id) as bid_count, COALESCE(MAX(bids.amount), 0) as max_bid, COALESCE(AVG(bids.amount), 0) as avg_bid")
      .order("bid_count DESC")
      .limit(limit)

    if user_id && params[:role] == "seller"
      products_query = products_query.joins(auction_items: :auction)
        .where(auctions: { created_by: user_id })
    end

    data = products_query.map do |product|
      {
        id: product.id,
        name: product.name,
        description: product.description,
        bid_count: product.bid_count || 0,
        max_bid: (product.max_bid || 0).to_f,
        avg_bid: (product.avg_bid || 0).to_f
      }
    end

    render json: { data: data }
  end

  def all_products
    user_id = params[:user_id]
    
    products_query = Product.includes(:auction_items)
      .select("products.id, products.name, products.description")
      .order("products.created_at DESC")

    if user_id && params[:role] == "seller"
      products_query = products_query.joins(auction_items: :auction)
        .where(auctions: { created_by: user_id })
        .distinct
    end

    data = products_query.map do |product|
      bid_stats = Bid.joins(auction_item: :product)
        .where(products: { id: product.id })
        .where(created_at: @start_time..@end_time)
        .select(
          Arel.sql("COUNT(bids.id) as bid_count"),
          Arel.sql("COALESCE(MAX(bids.amount), 0) as max_bid"),
          Arel.sql("COALESCE(AVG(bids.amount), 0) as avg_bid")
        ).group("products.id").first

      {
        id: product.id,
        name: product.name,
        description: product.description,
        bid_count: bid_stats&.bid_count.to_i || 0,
        max_bid: (bid_stats&.max_bid || 0).to_f,
        avg_bid: (bid_stats&.avg_bid || 0).to_f,
        auction_items_count: product.auction_items.count
      }
    end

    render json: { data: data }
  end

  def product_count
    user_id = params[:user_id]
    
    count_query = Product.joins(:auction_items)
      .where(auction_items: { created_at: @start_time..@end_time })
      .distinct

    if user_id && params[:role] == "seller"
      count_query = count_query.joins(auction_items: :auction)
        .where(auctions: { created_by: user_id })
    end

    total_count = Product.count
    active_count = count_query.count

    render json: {
      total: total_count,
      active: active_count,
      period: {
        start: @start_time.iso8601,
        end: @end_time.iso8601
      }
    }
  end

  def market_trends
    user_id = params[:user_id]
    
    # Gather product data for AI analysis
    products_data = Product.joins(auction_items: :bids)
      .where(bids: { created_at: @start_time..@end_time })
      .group("products.id", "products.name", "products.description")
      .select("products.id, products.name, products.description, COUNT(bids.id) as bid_count, COALESCE(MAX(bids.amount), 0) as max_bid, COALESCE(AVG(bids.amount), 0) as avg_bid")
      .order("bid_count DESC")
      .limit(20)

    if user_id && params[:role] == "seller"
      products_data = products_data.joins(auction_items: :auction)
        .where(auctions: { created_by: user_id })
    end

    # Prepare data for AI
    products_summary = products_data.map do |p|
      {
        name: p.name,
        bid_count: p.bid_count || 0,
        max_bid: (p.max_bid || 0).to_f,
        avg_bid: (p.avg_bid || 0).to_f
      }
    end

    # Get historical data for trend analysis - simplified approach
    historical_bids = Bid.joins(auction_item: :product)
      .where(created_at: (@start_time - 30.days)..@end_time)
      .select(
        Arel.sql("DATE_TRUNC('day', bids.created_at) as bid_date"),
        "products.name as product_name",
        Arel.sql("COUNT(bids.id) as bid_count"),
        Arel.sql("AVG(bids.amount) as avg_amount")
      )
      .group(Arel.sql("DATE_TRUNC('day', bids.created_at)"), "products.name")
      .order(Arel.sql("DATE_TRUNC('day', bids.created_at) DESC"))
      .limit(100)

    trends_data = historical_bids.map do |h|
      {
        date: h.bid_date&.iso8601 || "",
        product: h.product_name || "",
        bid_count: h.bid_count.to_i || 0,
        avg_amount: (h.avg_amount || 0).to_f
      }
    end

    # Call AI service for market trends analysis
    ai_prompt = build_market_trends_prompt(products_summary, trends_data)
    ai_result = Ai::GeminiService.chat(ai_prompt, [])

    if ai_result[:success]
      # Parse JSON from AI response
      parsed_analysis = parse_ai_json_response(ai_result[:message])
      
      render json: {
        success: true,
        analysis: parsed_analysis,
        raw_analysis: ai_result[:message],
        products_summary: products_summary,
        trends_data: trends_data
      }
    else
      render json: {
        success: false,
        error: ai_result[:error],
        message: "Unable to generate market trends analysis at this time.",
        products_summary: products_summary,
        trends_data: trends_data
      }, status: :unprocessable_entity
    end
  end

  def top_auctions
    user_id = params[:user_id]
    limit = params[:limit] || 10

    auctions_query = Auction.joins(:auction_items)
      .select("auctions.id, MAX(auction_items.current_price) as max_price, COUNT(DISTINCT auction_items.id) as item_count")
      .group("auctions.id")
      .order(Arel.sql("MAX(auction_items.current_price) DESC"))
      .limit(limit)

    auctions_query = auctions_query.where(created_by: user_id) if user_id && params[:role] == "seller"

    # Get the results as a hash first
    results = auctions_query.pluck(
      "auctions.id",
      Arel.sql("MAX(auction_items.current_price)"),
      Arel.sql("COUNT(DISTINCT auction_items.id)")
    )
    
    # Get auction IDs
    auction_ids = results.map(&:first)
    
    # Load full auction records
    auctions = Auction.where(id: auction_ids)
      .includes(:watchlists, :creator)
      .index_by(&:id)

    # Build response data maintaining the order
    data = results.map do |auction_id, max_price, item_count|
      auction = auctions[auction_id]
      next unless auction
      
      {
        id: auction.id,
        name: auction.name,
        status: auction.status,
        start_time: auction.start_time,
        end_time: auction.end_time,
        top_bid: max_price.to_f,
        item_count: item_count.to_i,
        watchers: auction.watchlists.count,
        creator: auction.creator&.name
      }
    end.compact

    render json: { data: data }
  end

  def recent_bids
    user_id = params[:user_id]
    limit = params[:limit] || 20

    bids_query = Bid.includes(auction_item: [ :auction, :product ], user: [])
      .order(created_at: :desc)
      .limit(limit)

    bids_query = bids_query.joins(auction_item: :auction).where(auctions: { created_by: user_id }) if user_id && params[:role] == "seller"

    data = bids_query.map do |bid|
      {
        id: bid.id,
        amount: bid.amount.to_f,
        created_at: bid.created_at,
        auction_name: bid.auction_item.auction.name,
        product_name: bid.auction_item.product.name,
        bidder_name: bid.user&.name || "Anonymous"
      }
    end

    render json: { data: data }
  end

  def auction_table
    user_id = params[:user_id]
    role = params[:role] || "admin"
    page = params[:page] || 1
    per_page = params[:per_page] || 20
    status_filter = params[:status]
    category_filter = params[:category_id]

    auctions_query = Auction.includes(:auction_items, :watchlists, :creator, :products)

    auctions_query = auctions_query.where(created_by: user_id) if user_id && role == "seller"
    auctions_query = auctions_query.where(status: status_filter) if status_filter.present?
    auctions_query = auctions_query.joins(products: :category).where(categories: { id: category_filter }) if category_filter.present?

    total = auctions_query.count
    auctions = auctions_query.order(created_at: :desc)
      .offset((page.to_i - 1) * per_page.to_i)
      .limit(per_page.to_i)

    data = auctions.map do |auction|
      top_bid = auction.auction_items.joins(:bids).maximum("bids.amount") || 0
      {
        id: auction.id,
        name: auction.name,
        item_count: auction.auction_items.count,
        status: auction.status,
        start_time: auction.start_time,
        end_time: auction.end_time,
        top_bid: top_bid.to_f,
        watchers: auction.watchlists.count,
        creator: auction.creator&.name
      }
    end

    render json: {
      data: data,
      pagination: {
        page: page.to_i,
        per_page: per_page.to_i,
        total: total,
        total_pages: (total.to_f / per_page.to_i).ceil
      }
    }
  end

  private

  def parse_ai_json_response(message)
    # Try to extract JSON from the response
    # Handle cases where AI might wrap JSON in markdown code blocks
    json_text = message.strip
    
    # Remove markdown code blocks if present
    json_text = json_text.gsub(/^```json\s*/, '').gsub(/^```\s*/, '').gsub(/\s*```$/, '')
    
    # Try to find JSON object boundaries
    start_idx = json_text.index('{')
    end_idx = json_text.rindex('}')
    
    if start_idx && end_idx && end_idx > start_idx
      json_text = json_text[start_idx..end_idx]
    end
    
    # Parse JSON
    parsed = JSON.parse(json_text)
    
    # Ensure all required fields exist with defaults
    {
      'marketSentiment' => parsed['marketSentiment'] || { 'value' => 'Neutral', 'description' => 'Unable to determine sentiment' },
      'topTrendingProducts' => parsed['topTrendingProducts'] || [],
      'priceMovements' => parsed['priceMovements'] || [],
      'recommendations' => parsed['recommendations'] || { 'productsToWatch' => [], 'hotCategories' => [] },
      'summary' => parsed['summary'] || 'Market analysis unavailable.'
    }
  rescue JSON::ParserError => e
    Rails.logger.error "Failed to parse AI JSON response: #{e.message}"
    Rails.logger.error "Response was: #{message[0..500]}"
    
    # Return a fallback structure
    {
      'marketSentiment' => { 'value' => 'Neutral', 'description' => 'Unable to analyze sentiment' },
      'topTrendingProducts' => [],
      'priceMovements' => [],
      'recommendations' => { 'productsToWatch' => [], 'hotCategories' => [] },
      'summary' => 'Unable to parse market analysis. Please try again.'
    }
  end

  def build_market_trends_prompt(products_summary, trends_data)
    products_text = if products_summary.empty?
      "No product data available for the selected period."
    else
      products_summary.map { |p| "- #{p[:name]}: #{p[:bid_count]} bids, Max: $#{p[:max_bid].round(2)}, Avg: $#{p[:avg_bid].round(2)}" }.join("\n")
    end

    trends_text = if trends_data.empty?
      "No historical trend data available."
    else
      trends_data.take(20).map { |t| "- #{t[:date]}: #{t[:product]} - #{t[:bid_count]} bids, Avg: $#{t[:avg_amount].round(2)}" }.join("\n")
    end

    <<~PROMPT
      Analyze the following auction platform market data and provide insights similar to stock market trends:

      Top Products Performance:
      #{products_text}

      Historical Trends (last 30 days):
      #{trends_text}

      Please provide your analysis as a JSON object with the following structure:
      {
        "marketSentiment": {
          "value": "Bullish" | "Bearish" | "Neutral",
          "description": "Brief explanation of the sentiment"
        },
        "topTrendingProducts": [
          {
            "name": "Product name",
            "analysis": "Brief analysis of why it's trending"
          }
        ],
        "priceMovements": [
          {
            "product": "Product name",
            "trend": "Increasing" | "Decreasing" | "Stable",
            "details": "Brief details about the price movement"
          }
        ],
        "recommendations": {
          "productsToWatch": ["Product 1", "Product 2"],
          "hotCategories": ["Category 1", "Category 2"]
        },
        "summary": "2-3 sentence summary of the market analysis"
      }

      IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no additional text. The response must be parseable JSON.
    PROMPT
  end

  def set_time_range
    case params[:time_range]
    when "24h"
      @start_time = 24.hours.ago
      @end_time = Time.current
    when "7d"
      @start_time = 7.days.ago
      @end_time = Time.current
    when "30d"
      @start_time = 30.days.ago
      @end_time = Time.current
    when "custom"
      @start_time = Time.parse(params[:start_time]) if params[:start_time]
      @end_time = Time.parse(params[:end_time]) if params[:end_time]
    else
      @start_time = 7.days.ago
      @end_time = Time.current
    end
  end

  def active_auctions_count(user_id = nil, role = "admin", start_time = @start_time, end_time = @end_time)
    query = Auction.where(status: "running")
    query = query.where(created_by: user_id) if user_id && role == "seller"
    query.count
  end

  def live_bids_per_minute
    Bid.where("created_at > ?", 1.minute.ago).count
  end

  def total_revenue_for_period(user_id = nil, role = "admin", start_time = @start_time, end_time = @end_time)
    query = Payment.where(created_at: start_time..end_time, status: "completed")
    query = query.where(seller_id: user_id) if user_id && role == "seller"
    query.sum(:amount).to_f
  end

  def conversion_rate_for_period
    auctions_with_bids = Auction.joins(:bids)
      .where(bids: { created_at: @start_time..@end_time })
      .distinct
      .count

    auctions_viewed = Auction.joins(:watchlists)
      .where(watchlists: { created_at: @start_time..@end_time })
      .distinct
      .count

    return 0 if auctions_viewed.zero?
    (auctions_with_bids.to_f / auctions_viewed * 100).round(2)
  end

  def items_sold_count(user_id = nil, role = "admin", start_time = @start_time, end_time = @end_time)
    query = AuctionItem.where(status: "sold", updated_at: start_time..end_time)
    if user_id && role == "seller"
      query = query.joins(:auction).where(auctions: { created_by: user_id })
    end
    query.count
  end

  def avg_bid_value_for_period
    bids = Bid.where(created_at: @start_time..@end_time)
    return 0 if bids.empty?
    bids.average(:amount).to_f
  end

  def total_watchlist_count
    Watchlist.where(created_at: @start_time..@end_time).count
  end

  def avg_time_to_first_bid
    # Get first bid for each auction within the time period
    first_bids_by_auction = Bid.joins(auction_item: :auction)
      .where(created_at: @start_time..@end_time)
      .group('auction_items.auction_id')
      .minimum('bids.created_at')

    return 0 if first_bids_by_auction.empty?

    total_seconds = 0
    count = 0

    first_bids_by_auction.each do |auction_id, first_bid_time|
      auction = Auction.find_by(id: auction_id)
      next unless auction&.start_time

      start_time = auction.start_time
      total_seconds += (first_bid_time - start_time).to_i
      count += 1
    end

    return 0 if count.zero?
    (total_seconds.to_f / count / 3600).round(2) # hours
  end
end
