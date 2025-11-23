class Payment < ApplicationRecord
  belongs_to :auction_item, optional: true
  belongs_to :buyer, class_name: 'User', foreign_key: 'buyer_id', optional: true
  belongs_to :seller, class_name: 'User', foreign_key: 'seller_id', optional: true

  enum :status, {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed',
    refunded: 'refunded'
  }

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :currency, presence: true, length: { is: 3 }

  scope :by_buyer, ->(user_id) { where(buyer_id: user_id) }
  scope :by_seller, ->(user_id) { where(seller_id: user_id) }
  scope :by_status, ->(status) { where(status: status) }
end

