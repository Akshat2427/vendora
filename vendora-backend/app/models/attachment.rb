class Attachment < ApplicationRecord
  belongs_to :submission, optional: true
  belongs_to :answer, optional: true

  validates :file_url, presence: true
end

