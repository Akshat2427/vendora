class Category < ApplicationRecord
  belongs_to :parent, class_name: 'Category', optional: true
  has_many :children, class_name: 'Category', foreign_key: 'parent_id', dependent: :nullify
  has_many :products, dependent: :nullify

  validates :name, presence: true
  validates :slug, uniqueness: true, allow_nil: true

  scope :root_categories, -> { where(parent_id: nil) }
end

