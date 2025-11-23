class Answer < ApplicationRecord
  belongs_to :submission
  belongs_to :question
  belongs_to :option, optional: true
  has_many :attachments, dependent: :destroy

  validates :submission_id, presence: true
  validates :question_id, presence: true
  validates :question_id, uniqueness: { scope: :submission_id }
end

