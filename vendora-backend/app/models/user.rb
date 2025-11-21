class User < ApplicationRecord
  enum :status, { active: 0, in_active: 1 }

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :phone, presence: true
  validates :prefix, presence: true
  validates :address, presence: true
end
