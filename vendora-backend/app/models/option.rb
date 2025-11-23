class Option < ApplicationRecord
  belongs_to :question
  has_many :answers

  validates :text, presence: true
  validates :order, presence: true
end

