class AuctionsController < ApplicationController
  before_action :set_auction, only: [ :show, :update, :destroy ]

  def index
    if params[:user_id].present?
      user = User.find_by(id: params[:user_id])

      unless user
        return render json: { error: "User not found" }, status: :not_found
      end

      # Check if user is a seller
      if user.role == "seller" || user.role == "admin"
        @auctions = Auction.by_seller(params[:user_id])
        render json: @auctions, include: [ :auction_items, :creator ]
      else
        render json: { error: "User is not a seller" }, status: :forbidden
      end
    else
      @auctions = Auction.all
      render json: @auctions, include: [ :auction_items, :creator ]
    end
  end

  def show
    render json: @auction, include: [ :auction_items, :creator, :products ]
  end

  def create
    @auction = Auction.new(auction_params)
    if @auction.save
      render json: @auction, status: :created, include: [ :auction_items, :creator ]
    else
      render json: { errors: @auction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def create_with_products
    ActiveRecord::Base.transaction do
      # Create auction
      auction_params_data = params.require(:auction).permit(
        :name, :created_by, :visibility, :start_time, :end_time, :status,
        :currency, :reserve_price, :starting_price, :min_increment,
        :buy_now_price, metadata: {}
      )

      @auction = Auction.new(auction_params_data)

      unless @auction.save
        return render json: { errors: @auction.errors.full_messages }, status: :unprocessable_entity
      end

      # Process products
      products_data = params[:products] || []
      auction_items = []

      products_data.each_with_index do |product_data, index|
        # Find or create category
        category = nil
        if product_data[:category_name].present?
          category = Category.find_or_create_by(name: product_data[:category_name]) do |cat|
            cat.slug = product_data[:category_name].downcase.gsub(/\s+/, "-")
          end
        end

        # Find or create product
        product = Product.find_or_initialize_by(
          name: product_data[:name],
          seller_id: auction_params_data[:created_by]
        )

        if product.new_record?
          product.description = product_data[:description]
          product.category_id = category&.id
          unless product.save
            return render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # Create auction item
        auction_item = AuctionItem.new(
          auction: @auction,
          product: product,
          listing_title: product_data[:name],
          starting_price: product_data[:starting_price] || 0,
          current_price: product_data[:starting_price] || 0,
          reserve_price: product_data[:reserve_price] || 0,
          status: "active",
          lot_number: index + 1
        )

        unless auction_item.save
          return render json: { errors: auction_item.errors.full_messages }, status: :unprocessable_entity
        end

        auction_items << auction_item
      end

      # Create notification for auction creator
      if @auction.created_by
        Notification.create(
          user_id: @auction.created_by,
          title: "Auction Created",
          message: "Your auction '#{@auction.name}' has been created successfully with #{auction_items.count} item(s)",
          notification_type: "auction_created",
          seen: false,
          deeplink: "/auction/#{@auction.id}/details",
          metadata: {
            auction_id: @auction.id,
            auction_name: @auction.name,
            items_count: auction_items.count
          }
        )
      end

      render json: {
        auction: @auction.as_json(include: [ :auction_items, :creator ]),
        message: "Auction created successfully with products"
      }, status: :created
    end
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    if @auction.update(auction_params)
      render json: @auction, include: [ :auction_items, :creator ]
    else
      render json: { errors: @auction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @auction.destroy
    head :no_content
  end

  private

  def set_auction
    @auction = Auction.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Auction not found" }, status: :not_found
  end

  def auction_params
    params.require(:auction).permit(
      :name, :created_by, :visibility, :start_time, :end_time, :status,
      :currency, :reserve_price, :starting_price, :min_increment,
      :buy_now_price, metadata: {}
    )
  end
end
