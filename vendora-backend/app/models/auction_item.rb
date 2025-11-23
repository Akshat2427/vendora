class AuctionItem < ApplicationRecord
  belongs_to :auction
  belongs_to :product
  has_many :bids, dependent: :destroy
  has_many :watchlists, dependent: :destroy
  has_many :payments, dependent: :nullify

  enum :status, {
    active: 'active',
    sold: 'sold',
    unsold: 'unsold',
    removed: 'removed'
  }

  validates :auction_id, uniqueness: { scope: :product_id }

  scope :active, -> { where(status: 'active') }
  scope :by_auction, ->(auction_id) { where(auction_id: auction_id) }

  def highest_bid
    bids.order(amount: :desc).first
  end

  def current_bidder
    highest_bid&.user
  end
end

