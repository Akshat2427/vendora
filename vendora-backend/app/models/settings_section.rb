class SettingsSection < ApplicationRecord
  has_many :settings_fields, dependent: :destroy

  validates :key, presence: true, uniqueness: true
  validates :label, presence: true
  validates :icon, presence: true

  scope :active, -> { where(is_active: true) }
  scope :ordered, -> { order(:order, :created_at) }

  # Get formatted section with fields
  def formatted
    {
      id: key,
      label: label,
      icon: icon,
      fields: settings_fields.active.ordered.map(&:formatted)
    }
  end
end

