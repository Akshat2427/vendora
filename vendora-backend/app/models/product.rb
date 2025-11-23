class Product < ApplicationRecord
  belongs_to :seller, class_name: 'User', foreign_key: 'seller_id', optional: true
  belongs_to :category, optional: true
  has_many :product_images, dependent: :destroy
  has_many :auction_items, dependent: :destroy
  has_many :auctions, through: :auction_items

  validates :name, presence: true

  scope :by_seller, ->(user_id) { where(seller_id: user_id) }
  scope :by_category, ->(category_id) { where(category_id: category_id) }
end

