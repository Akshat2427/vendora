class User < ApplicationRecord
  has_secure_password

  enum :status, { active: 0, in_active: 1 }

  # Auction-related associations
  has_many :created_auctions, class_name: 'Auction', foreign_key: 'created_by', dependent: :nullify
  has_many :products, foreign_key: 'seller_id', dependent: :nullify
  has_many :bids, dependent: :nullify
  has_many :watchlists, dependent: :destroy
  has_many :buyer_payments, class_name: 'Payment', foreign_key: 'buyer_id', dependent: :nullify
  has_many :seller_payments, class_name: 'Payment', foreign_key: 'seller_id', dependent: :nullify
  has_many :notifications, dependent: :destroy
  has_one :user_preference, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :phone, presence: true, on: :update
  validates :prefix, presence: true, on: :update
  validates :address, presence: true, on: :update
  validates :username, uniqueness: true, allow_nil: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  scope :sellers, -> { where(role: 'seller') }
  scope :buyers, -> { where(role: 'buyer') }
  scope :admins, -> { where(role: 'admin') }

  def generate_jwt
    payload = {
      user_id: id,
      email: email,
      exp: 24.hours.from_now.to_i,
      jti: SecureRandom.uuid
    }
    JWT.encode(payload, self.class.jwt_secret, 'HS256')
  end

  def self.jwt_secret
    Rails.application.credentials.secret_key_base || ENV['SECRET_KEY_BASE'] || 'default_secret_key_change_in_production'
  end
end
