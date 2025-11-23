class Watchlist < ApplicationRecord
  self.table_name = 'watchlist'

  belongs_to :user
  belongs_to :auction, optional: true
  belongs_to :auction_item, optional: true

  validates :user_id, presence: true
  validates :user_id, uniqueness: { 
    scope: [:auction_id, :auction_item_id],
    message: "already has this item in watchlist"
  }

  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :auctions_only, -> { where.not(auction_id: nil).where(auction_item_id: nil) }
  scope :items_only, -> { where.not(auction_item_id: nil) }
end

