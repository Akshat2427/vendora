class Bid < ApplicationRecord
  belongs_to :auction_item
  belongs_to :user, optional: true

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :auction_item_id, presence: true

  scope :highest_first, -> { order(amount: :desc) }
  scope :by_auction_item, ->(auction_item_id) { where(auction_item_id: auction_item_id) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  def is_winning_bid?
    self == auction_item.highest_bid
  end
end

