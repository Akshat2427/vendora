class ProductImage < ApplicationRecord
  belongs_to :product

  validates :url, presence: true
  validates :sort_order, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:sort_order, :created_at) }
end

