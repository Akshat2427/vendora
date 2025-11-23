class Auction < ApplicationRecord
  belongs_to :creator, class_name: 'User', foreign_key: 'created_by', optional: true
  has_many :auction_items, dependent: :destroy
  has_many :products, through: :auction_items
  has_many :bids, through: :auction_items
  has_many :watchlists, dependent: :destroy

  enum :status, {
    scheduled: 'scheduled',
    running: 'running',
    closed: 'closed',
    cancelled: 'cancelled'
  }

  enum :visibility, {
    public: 'public',
    private: 'private',
    unlisted: 'unlisted'
  }, prefix: :visibility

  validates :name, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true
  validate :end_time_after_start_time

  scope :by_seller, ->(user_id) { where(created_by: user_id) }

  private

  def end_time_after_start_time
    return unless start_time && end_time

    errors.add(:end_time, 'must be after start time') if end_time <= start_time
  end
end

