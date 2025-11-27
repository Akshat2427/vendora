class BidsController < ApplicationController
  before_action :set_auction_item, only: [ :create ]

  def create
    @bid = Bid.new(bid_params)
    @bid.auction_item = @auction_item
    @bid.user_id = params[:user_id] if params[:user_id].present?

    # Validate bid amount is higher than current price
    min_bid = @auction_item.current_price + (@auction_item.auction.min_increment || 1.0)
    if @bid.amount < min_bid
      return render json: {
        errors: [ "Bid amount must be at least #{min_bid} (current price + minimum increment)" ]
      }, status: :unprocessable_entity
    end

    if @bid.save
      # Update auction item's current price to the new bid amount
      @auction_item.update(current_price: @bid.amount)

      # Create notification for the bidder
      if @bid.user_id
        Notification.create(
          user_id: @bid.user_id,
          title: "Bid Placed Successfully",
          message: "Your bid of #{@bid.amount} has been placed on #{@auction_item.listing_title}",
          notification_type: "bid_placed",
          seen: false,
          deeplink: "/auction/#{@auction_item.auction_id}/bid",
          metadata: {
            bid_id: @bid.id,
            auction_item_id: @auction_item.id,
            auction_id: @auction_item.auction_id,
            amount: @bid.amount.to_f
          }
        )
      end

      # Create notification for auction creator (if different from bidder)
      auction_creator_id = @auction_item.auction.created_by
      if auction_creator_id && auction_creator_id != @bid.user_id
        Notification.create(
          user_id: auction_creator_id,
          title: "New Bid Received",
          message: "A new bid of #{@bid.amount} has been placed on #{@auction_item.listing_title}",
          notification_type: "bid_received",
          seen: false,
          deeplink: "/auction/#{@auction_item.auction_id}/details",
          metadata: {
            bid_id: @bid.id,
            auction_item_id: @auction_item.id,
            auction_id: @auction_item.auction_id,
            amount: @bid.amount.to_f,
            bidder_name: @bid.user&.name
          }
        )
      end

      render json: {
        bid: @bid.as_json(include: :user),
        message: "Bid placed successfully",
        new_current_price: @auction_item.current_price
      }, status: :created
    else
      render json: { errors: @bid.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_auction_item
    @auction_item = AuctionItem.find(params[:auction_item_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Auction item not found" }, status: :not_found
  end

  def bid_params
    params.require(:bid).permit(:amount, :is_auto, :auto_max)
  end
end
