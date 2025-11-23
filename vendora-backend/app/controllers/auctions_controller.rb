class AuctionsController < ApplicationController
  before_action :set_auction, only: [:show, :update, :destroy]

  def index
    if params[:user_id].present?
      user = User.find_by(id: params[:user_id])
      
      unless user
        return render json: { error: "User not found" }, status: :not_found
      end

      # Check if user is a seller
      if user.role == 'seller' || user.role == 'admin'
        @auctions = Auction.by_seller(params[:user_id])
        render json: @auctions, include: [:auction_items, :creator]
      else
        render json: { error: "User is not a seller" }, status: :forbidden
      end
    else
      @auctions = Auction.all
      render json: @auctions, include: [:auction_items, :creator]
    end
  end

  def show
    render json: @auction, include: [:auction_items, :creator, :products]
  end

  def create
    @auction = Auction.new(auction_params)
    if @auction.save
      render json: @auction, status: :created, include: [:auction_items, :creator]
    else
      render json: { errors: @auction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @auction.update(auction_params)
      render json: @auction, include: [:auction_items, :creator]
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

