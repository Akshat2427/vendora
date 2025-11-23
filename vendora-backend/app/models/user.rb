class User < ApplicationRecord
  enum :status, { active: 0, in_active: 1 }

  # Auction-related associations
  has_many :created_auctions, class_name: 'Auction', foreign_key: 'created_by', dependent: :nullify
  has_many :products, foreign_key: 'seller_id', dependent: :nullify
  has_many :bids, dependent: :nullify
  has_many :watchlists, dependent: :destroy
  has_many :buyer_payments, class_name: 'Payment', foreign_key: 'buyer_id', dependent: :nullify
  has_many :seller_payments, class_name: 'Payment', foreign_key: 'seller_id', dependent: :nullify

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :phone, presence: true
  validates :prefix, presence: true
  validates :address, presence: true
  validates :username, uniqueness: true, allow_nil: true

  scope :sellers, -> { where(role: 'seller') }
  scope :buyers, -> { where(role: 'buyer') }
  scope :admins, -> { where(role: 'admin') }
end
