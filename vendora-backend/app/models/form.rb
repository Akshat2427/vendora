class Form < ApplicationRecord
  has_many :questions, dependent: :nullify
  has_many :submissions, dependent: :destroy

  validates :slug, presence: true, uniqueness: true
  validates :title, presence: true
end

