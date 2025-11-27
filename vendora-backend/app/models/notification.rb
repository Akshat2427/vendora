class Notification < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :message, presence: true
  validates :notification_type, presence: true

  scope :unseen, -> { where(seen: false) }
  scope :seen, -> { where(seen: true) }
  scope :by_type, ->(type) { where(notification_type: type) }
  scope :recent, -> { order(created_at: :desc) }

  def mark_as_seen!
    update(seen: true)
  end
end

