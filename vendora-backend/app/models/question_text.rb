class QuestionText < ApplicationRecord
  belongs_to :question

  validates :locale, presence: true
  validates :text, presence: true
  validates :question_id, uniqueness: { scope: :locale }
end

