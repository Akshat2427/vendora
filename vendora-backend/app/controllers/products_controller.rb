class ProductsController < ApplicationController
  # Throttle search requests - 10 requests per minute per user
  before_action :throttle_search, only: [:search]

  def search
    query = params[:q]&.strip
    
    if query.blank? || query.length < 2
      return render json: { products: [] }, status: :ok
    end

    # Search products by name (case-insensitive, partial match)
    products = Product.where("LOWER(name) LIKE ?", "%#{query.downcase}%")
                     .limit(10)
                     .select(:id, :name, :description, :category_id)
                     .includes(:category)

    results = products.map do |product|
      {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category&.name
      }
    end

    render json: { products: results }, status: :ok
  end

  def suggest_price
    product_name = params[:product_name]&.strip
    
    if product_name.blank?
      return render json: { error: "Product name is required" }, status: :bad_request
    end

    # First, check for successful auction history
    successful_auctions = AuctionItem.joins(:product, :auction)
                                    .where(products: { name: product_name })
                                    .where(status: 'sold')
                                    .where(auctions: { status: 'closed' })
                                    .includes(:bids)
                                    .order('auctions.end_time DESC')
                                    .limit(10)

    if successful_auctions.any?
      # Calculate price range from successful auctions
      prices = successful_auctions.map do |item|
        highest_bid = item.bids.order(amount: :desc).first
        highest_bid&.amount || item.current_price
      end.compact

      if prices.any?
        min_price = prices.min
        max_price = prices.max
        avg_price = (prices.sum.to_f / prices.length).round(2)

        return render json: {
          source: 'auction_history',
          price_range: {
            min: min_price,
            max: max_price,
            average: avg_price,
            suggested_starting: (min_price * 0.8).round(2),
            suggested_reserve: (avg_price * 0.9).round(2)
          },
          data_points: prices.length,
          message: "Based on #{prices.length} successful auction(s) for similar products"
        }, status: :ok
      end
    end

    # If no auction history, use AI/web search
    # For now, we'll use a simple estimation based on product name
    # In production, you'd integrate with a web search API or AI service
    begin
      result = Ai::GeminiService.suggest_price(product_name)
      
      if result[:success]
        render json: {
          source: 'ai_web_search',
          price_range: result[:price_range],
          message: result[:message] || "AI-suggested price based on market research"
        }, status: :ok
      else
        render json: {
          source: 'estimated',
          price_range: {
            min: 100,
            max: 1000,
            average: 500,
            suggested_starting: 100,
            suggested_reserve: 450
          },
          message: "Unable to fetch price data. Using default estimates."
        }, status: :ok
      end
    rescue StandardError => e
      Rails.logger.error "Price suggestion error: #{e.message}"
      render json: {
        source: 'estimated',
        price_range: {
          min: 100,
          max: 1000,
          average: 500,
          suggested_starting: 100,
          suggested_reserve: 450
        },
        message: "Unable to fetch price data. Using default estimates."
      }, status: :ok
    end
  end

  private

  def throttle_search
    # Simple throttling - 2 requests per second per user
    user_id = @current_user&.id || request.remote_ip
    cache_key = "product_search_throttle_#{user_id}"
    
    last_search_time = Rails.cache.read(cache_key)
    if last_search_time && (Time.current - last_search_time) < 0.5.seconds
      return render json: { error: "Search rate limit exceeded. Please wait a moment." }, status: :too_many_requests
    end

    Rails.cache.write(cache_key, Time.current, expires_in: 1.minute)
  rescue StandardError => e
    # If caching fails, allow the request (fail open)
    Rails.logger.warn "Throttle check failed: #{e.message}"
  end
end

