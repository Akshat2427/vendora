class Submission < ApplicationRecord
  belongs_to :form
  belongs_to :user, optional: true
  has_many :answers, dependent: :destroy
  has_many :attachments, dependent: :destroy

  validates :form_id, presence: true
  validates :status, presence: true
  validates :submitter_type, presence: true
end

