class SettingsField < ApplicationRecord
  belongs_to :settings_section

  validates :field_key, presence: true
  validates :field_type, presence: true
  validates :label, presence: true

  scope :active, -> { where(is_active: true) }
  scope :ordered, -> { order(:order, :created_at) }
  scope :by_group, ->(group) { where(group_label: group) }

  # Get formatted field data
  def formatted
    {
      key: field_key,
      type: field_type,
      label: label,
      hint: hint,
      placeholder: placeholder,
      options: options || [],
      default_value: default_value,
      required: required,
      group_label: group_label
    }
  end
end

