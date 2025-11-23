class Question < ApplicationRecord
  self.inheritance_column = :_type_disabled

  belongs_to :form, optional: true
  has_many :question_texts, dependent: :destroy
  has_many :options, dependent: :destroy
  has_many :answers, dependent: :restrict_with_error

  validates :type, presence: true
  validates :order, presence: true
end

