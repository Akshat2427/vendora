class UserPreference < ApplicationRecord
  belongs_to :user

  validates :user_id, uniqueness: true

  # Default preferences structure
  def self.default_preferences
    {
      # Account Settings
      publicProfile: true,
      showWinningHistory: true,
      showRatings: true,

      # Security
      twoFactorEnabled: false,
      twoFactorMethod: "email",
      fraudAlerts: true,
      suspiciousLoginNotifications: true,

      # Notifications
      emailOutbid: true,
      emailAuctionEnding: true,
      emailBidPlaced: true,
      emailAuctionWon: true,
      emailAuctionLost: false,
      emailWatchlist: true,
      emailPaymentReminders: true,
      emailShipping: true,
      emailSellerResponse: true,
      smsOutbid: true,
      smsAuctionWon: true,
      smsUrgent: true,
      pushOutbid: true,
      pushAuctionEnding: true,
      pushPriceDrops: true,
      notificationFrequency: "realtime",

      # Buying Preferences
      autoBid: false,
      bidConfirmation: true,
      quickBid: false,
      defaultBidIncrement: "5%",
      preferredShipping: "standard",
      autoWatchlist: false,

      # Selling Preferences
      storeName: "",
      businessEmail: "",
      businessAddress: "",
      returnPolicy: "",
      shippingHandlingTime: "3-5 days",
      defaultAuctionDuration: "7 days",
      defaultStartingBid: "",
      autoRelisting: false,
      vacationMode: false,

      # Payment
      defaultPaymentMethod: "card",
      gstNumber: "",

      # Privacy
      showProfileDetails: true,
      showListings: true,
      showRatingsPrivacy: true,
      showBidHistory: false,

      # Communication
      marketingEmails: false,
      newsletter: true,
      promotionalAlerts: false,
      partnerAds: false,

      # App Preferences
      theme: "dark",
      uiDensity: "comfortable",
      language: "en",
      currency: "USD",
      timezone: "UTC",
      reduceMotion: false,
      highContrast: false,
      largerText: false
    }
  end

  # Get preference value with default fallback
  def get_preference(key)
    preferences[key.to_s] || self.class.default_preferences[key.to_sym]
  end

  # Set preference value
  def set_preference(key, value)
    self.preferences = preferences.merge(key.to_s => value)
    save
  end

  # Update multiple preferences at once
  def update_preferences(new_preferences)
    self.preferences = preferences.merge(new_preferences.stringify_keys)
    save
  end

  # Get all preferences merged with defaults
  def all_preferences
    self.class.default_preferences.merge(preferences.symbolize_keys)
  end
end

