# Seed Settings Sections and Fields

# Account Settings Section
account_section = SettingsSection.find_or_create_by(key: "account") do |s|
  s.label = "Account Settings"
  s.icon = "MdAccountCircle"
  s.order = 1
end

# Account Fields
account_fields = [
  {
    field_key: "fullName",
    field_type: "text",
    label: "Full Name",
    order: 1,
    required: true
  },
  {
    field_key: "username",
    field_type: "text",
    label: "Username / Handle",
    order: 2,
    required: true
  },
  {
    field_key: "email",
    field_type: "email",
    label: "Email",
    order: 3,
    required: true
  },
  {
    field_key: "phone",
    field_type: "tel",
    label: "Phone Number",
    order: 4
  },
  {
    field_key: "dateOfBirth",
    field_type: "date",
    label: "Date of Birth",
    order: 5
  },
  {
    field_key: "billingAddress",
    field_type: "textarea",
    label: "Billing Address",
    placeholder: "Enter billing address",
    order: 6
  },
  {
    field_key: "shippingAddress",
    field_type: "textarea",
    label: "Shipping Address",
    placeholder: "Enter shipping address",
    order: 7
  },
  {
    field_key: "publicProfile",
    field_type: "toggle",
    label: "Public Profile Visibility",
    hint: "Allow others to view your profile",
    default_value: "true",
    group_label: "Visibility Controls",
    order: 8
  },
  {
    field_key: "showWinningHistory",
    field_type: "toggle",
    label: "Show Winning History",
    hint: "Display your auction wins publicly",
    default_value: "true",
    group_label: "Visibility Controls",
    order: 9
  },
  {
    field_key: "showRatings",
    field_type: "toggle",
    label: "Show Ratings & Reviews",
    hint: "Display your ratings and reviews",
    default_value: "true",
    group_label: "Visibility Controls",
    order: 10
  }
]

account_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: account_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.hint = field_data[:hint]
    f.placeholder = field_data[:placeholder]
    f.default_value = field_data[:default_value]
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
    f.required = field_data[:required] || false
  end
end

# Security Section
security_section = SettingsSection.find_or_create_by(key: "security") do |s|
  s.label = "Security & Login"
  s.icon = "MdSecurity"
  s.order = 2
end

security_fields = [
  {
    field_key: "twoFactorMethod",
    field_type: "select",
    label: "Two-Factor Authentication Method",
    options: [
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
      { value: "app", label: "Authenticator App" }
    ],
    default_value: "email",
    group_label: "Password & Authentication",
    order: 1
  },
  {
    field_key: "twoFactorEnabled",
    field_type: "toggle",
    label: "Enable Two-Factor Authentication",
    default_value: "false",
    group_label: "Password & Authentication",
    order: 2
  },
  {
    field_key: "fraudAlerts",
    field_type: "toggle",
    label: "Fraud Alerts",
    hint: "Get notified about suspicious activity",
    default_value: "true",
    group_label: "Safety Controls",
    order: 3
  },
  {
    field_key: "suspiciousLoginNotifications",
    field_type: "toggle",
    label: "Suspicious Login Notifications",
    hint: "Alert when login from new device/location",
    default_value: "true",
    group_label: "Safety Controls",
    order: 4
  }
]

security_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: security_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.hint = field_data[:hint]
    f.options = field_data[:options] || []
    f.default_value = field_data[:default_value]
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# Notifications Section
notifications_section = SettingsSection.find_or_create_by(key: "notifications") do |s|
  s.label = "Notifications & Alerts"
  s.icon = "MdNotifications"
  s.order = 3
end

notification_fields = [
  { field_key: "emailOutbid", field_type: "toggle", label: "Outbid Alerts", group_label: "Email Notifications", order: 1 },
  { field_key: "emailAuctionEnding", field_type: "toggle", label: "Auction Ending Soon", group_label: "Email Notifications", order: 2 },
  { field_key: "emailBidPlaced", field_type: "toggle", label: "Bid Placed Confirmation", group_label: "Email Notifications", order: 3 },
  { field_key: "emailAuctionWon", field_type: "toggle", label: "Auction Won", group_label: "Email Notifications", order: 4 },
  { field_key: "emailAuctionLost", field_type: "toggle", label: "Auction Lost", default_value: "false", group_label: "Email Notifications", order: 5 },
  { field_key: "emailWatchlist", field_type: "toggle", label: "Watchlist Item Updates", group_label: "Email Notifications", order: 6 },
  { field_key: "emailPaymentReminders", field_type: "toggle", label: "Payment Reminders", group_label: "Email Notifications", order: 7 },
  { field_key: "emailShipping", field_type: "toggle", label: "Shipping Updates", group_label: "Email Notifications", order: 8 },
  { field_key: "emailSellerResponse", field_type: "toggle", label: "Seller Responds to Question", group_label: "Email Notifications", order: 9 },
  { field_key: "smsOutbid", field_type: "toggle", label: "Outbid Alerts", group_label: "SMS / WhatsApp Notifications", order: 10 },
  { field_key: "smsAuctionWon", field_type: "toggle", label: "Auction Won", group_label: "SMS / WhatsApp Notifications", order: 11 },
  { field_key: "smsUrgent", field_type: "toggle", label: "Urgent Platform Announcements", group_label: "SMS / WhatsApp Notifications", order: 12 },
  { field_key: "pushOutbid", field_type: "toggle", label: "Outbid", group_label: "Push Notifications", order: 13 },
  { field_key: "pushAuctionEnding", field_type: "toggle", label: "Auction Ending Soon", group_label: "Push Notifications", order: 14 },
  { field_key: "pushPriceDrops", field_type: "toggle", label: "Item Price Drops", group_label: "Push Notifications", order: 15 },
  {
    field_key: "notificationFrequency",
    field_type: "select",
    label: "Notification Frequency",
    options: [
      { value: "realtime", label: "Real-time" },
      { value: "daily", label: "Daily Digest" },
      { value: "weekly", label: "Weekly Summary" },
      { value: "important", label: "Only Important Alerts" }
    ],
    default_value: "realtime",
    group_label: "Frequency Controls",
    order: 16
  }
]

notification_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: notifications_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.options = field_data[:options] || []
    f.default_value = field_data[:default_value] || "true"
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# Buying Section
buying_section = SettingsSection.find_or_create_by(key: "buying") do |s|
  s.label = "Buying & Bidding"
  s.icon = "MdGavel"
  s.order = 4
end

buying_fields = [
  { field_key: "autoBid", field_type: "toggle", label: "Auto-bid", hint: "Set maximum bid limit and let the system bid for you", default_value: "false", group_label: "Bid Behavior", order: 1 },
  { field_key: "bidConfirmation", field_type: "toggle", label: "Bid Confirmation", hint: "Confirm before placing a bid", group_label: "Bid Behavior", order: 2 },
  { field_key: "quickBid", field_type: "toggle", label: "Quick Bid Toggle", hint: "Enable one-click bidding", default_value: "false", group_label: "Bid Behavior", order: 3 },
  {
    field_key: "defaultBidIncrement",
    field_type: "select",
    label: "Default Bid Increment Preference",
    options: [
      { value: "1%", label: "1%" },
      { value: "5%", label: "5%" },
      { value: "10%", label: "10%" },
      { value: "custom", label: "Custom" }
    ],
    default_value: "5%",
    group_label: "Bid Behavior",
    order: 4
  },
  {
    field_key: "defaultPaymentMethod",
    field_type: "select",
    label: "Default Payment Method",
    options: [
      { value: "card", label: "Credit/Debit Card" },
      { value: "upi", label: "UPI" },
      { value: "paypal", label: "PayPal" }
    ],
    default_value: "card",
    group_label: "Buyer Preferences",
    order: 5
  },
  {
    field_key: "preferredShipping",
    field_type: "select",
    label: "Preferred Shipping Method",
    options: [
      { value: "standard", label: "Standard" },
      { value: "express", label: "Express" },
      { value: "overnight", label: "Overnight" }
    ],
    default_value: "standard",
    group_label: "Buyer Preferences",
    order: 6
  },
  { field_key: "autoWatchlist", field_type: "toggle", label: "Auto-watchlist", hint: "Automatically add all bid items to watchlist", default_value: "false", group_label: "Buyer Preferences", order: 7 }
]

buying_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: buying_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.hint = field_data[:hint]
    f.options = field_data[:options] || []
    f.default_value = field_data[:default_value] || "true"
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# Selling Section
selling_section = SettingsSection.find_or_create_by(key: "selling") do |s|
  s.label = "Selling Preferences"
  s.icon = "MdStore"
  s.order = 5
end

selling_fields = [
  { field_key: "storeName", field_type: "text", label: "Store Name", group_label: "Store / Seller Info", order: 1 },
  { field_key: "businessEmail", field_type: "email", label: "Business Email", group_label: "Store / Seller Info", order: 2 },
  { field_key: "businessAddress", field_type: "textarea", label: "Business Address", group_label: "Store / Seller Info", order: 3 },
  { field_key: "returnPolicy", field_type: "textarea", label: "Return Policy", placeholder: "Describe your return policy", group_label: "Store / Seller Info", order: 4 },
  {
    field_key: "shippingHandlingTime",
    field_type: "select",
    label: "Shipping Handling Time",
    options: [
      { value: "1-2 days", label: "1-2 days" },
      { value: "3-5 days", label: "3-5 days" },
      { value: "5-7 days", label: "5-7 days" },
      { value: "7+ days", label: "7+ days" }
    ],
    default_value: "3-5 days",
    group_label: "Store / Seller Info",
    order: 5
  },
  {
    field_key: "defaultAuctionDuration",
    field_type: "select",
    label: "Default Auction Duration",
    options: [
      { value: "1 day", label: "1 day" },
      { value: "3 days", label: "3 days" },
      { value: "7 days", label: "7 days" },
      { value: "14 days", label: "14 days" }
    ],
    default_value: "7 days",
    group_label: "Auction Defaults",
    order: 6
  },
  { field_key: "defaultStartingBid", field_type: "number", label: "Default Starting Bid", placeholder: "Enter amount", group_label: "Auction Defaults", order: 7 },
  { field_key: "autoRelisting", field_type: "toggle", label: "Automatic Relisting", hint: "Automatically relist unsold items", default_value: "false", group_label: "Auction Defaults", order: 8 },
  { field_key: "vacationMode", field_type: "toggle", label: "Vacation Mode", hint: "Pause all listings temporarily", default_value: "false", group_label: "Seller Tools", order: 9 }
]

selling_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: selling_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.hint = field_data[:hint]
    f.placeholder = field_data[:placeholder]
    f.options = field_data[:options] || []
    f.default_value = field_data[:default_value] || ""
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# Payment Section
payment_section = SettingsSection.find_or_create_by(key: "payment") do |s|
  s.label = "Payment & Billing"
  s.icon = "MdPayment"
  s.order = 6
end

payment_fields = [
  {
    field_key: "defaultPaymentMethod",
    field_type: "select",
    label: "Set Default Payment Method",
    options: [
      { value: "card", label: "Credit/Debit Card" },
      { value: "upi", label: "UPI" },
      { value: "paypal", label: "PayPal" }
    ],
    default_value: "card",
    order: 1
  },
  { field_key: "gstNumber", field_type: "text", label: "GST / VAT Number", placeholder: "Enter GST/VAT number", group_label: "Payouts (For Sellers)", order: 2 }
]

payment_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: payment_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.placeholder = field_data[:placeholder]
    f.options = field_data[:options] || []
    f.default_value = field_data[:default_value] || ""
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# Privacy Section
privacy_section = SettingsSection.find_or_create_by(key: "privacy") do |s|
  s.label = "Privacy Settings"
  s.icon = "MdPrivacyTip"
  s.order = 7
end

privacy_fields = [
  { field_key: "showProfileDetails", field_type: "toggle", label: "Show Profile Details", group_label: "Visibility Preferences", order: 1 },
  { field_key: "showListings", field_type: "toggle", label: "Show Listings", group_label: "Visibility Preferences", order: 2 },
  { field_key: "showRatingsPrivacy", field_type: "toggle", label: "Show Ratings", group_label: "Visibility Preferences", order: 3 },
  { field_key: "showBidHistory", field_type: "toggle", label: "Show Bid History", hint: "Privacy mode - hide your bidding activity", default_value: "false", group_label: "Visibility Preferences", order: 4 }
]

privacy_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: privacy_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.hint = field_data[:hint]
    f.default_value = field_data[:default_value] || "true"
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# Communication Section
communication_section = SettingsSection.find_or_create_by(key: "communication") do |s|
  s.label = "Communication & Social"
  s.icon = "MdEmail"
  s.order = 8
end

communication_fields = [
  { field_key: "marketingEmails", field_type: "toggle", label: "Marketing Emails", hint: "Receive promotional emails and offers", default_value: "false", group_label: "Marketing & Communications", order: 1 },
  { field_key: "newsletter", field_type: "toggle", label: "Newsletter Subscription", group_label: "Marketing & Communications", order: 2 },
  { field_key: "promotionalAlerts", field_type: "toggle", label: "Promotional Offer Alerts", default_value: "false", group_label: "Marketing & Communications", order: 3 },
  { field_key: "partnerAds", field_type: "toggle", label: "Partner Ads Visibility", hint: "Show relevant partner advertisements", default_value: "false", group_label: "Marketing & Communications", order: 4 }
]

communication_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: communication_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.hint = field_data[:hint]
    f.default_value = field_data[:default_value] || "true"
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# App Section
app_section = SettingsSection.find_or_create_by(key: "app") do |s|
  s.label = "App & Interface"
  s.icon = "MdSettings"
  s.order = 9
end

app_fields = [
  {
    field_key: "theme",
    field_type: "select",
    label: "Theme",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" }
    ],
    default_value: "dark",
    group_label: "Themes",
    order: 1
  },
  {
    field_key: "uiDensity",
    field_type: "select",
    label: "Interface Density",
    options: [
      { value: "comfortable", label: "Comfortable" },
      { value: "compact", label: "Compact" }
    ],
    default_value: "comfortable",
    order: 2
  },
  {
    field_key: "language",
    field_type: "select",
    label: "Language",
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" }
    ],
    default_value: "en",
    group_label: "Language & Region",
    order: 3
  },
  {
    field_key: "currency",
    field_type: "select",
    label: "Currency Display",
    options: [
      { value: "USD", label: "USD ($)" },
      { value: "EUR", label: "EUR (€)" },
      { value: "GBP", label: "GBP (£)" },
      { value: "INR", label: "INR (₹)" }
    ],
    default_value: "USD",
    group_label: "Language & Region",
    order: 4
  },
  {
    field_key: "timezone",
    field_type: "select",
    label: "Timezone",
    options: [
      { value: "UTC", label: "UTC" },
      { value: "EST", label: "EST" },
      { value: "PST", label: "PST" },
      { value: "IST", label: "IST" }
    ],
    default_value: "UTC",
    group_label: "Language & Region",
    order: 5
  },
  { field_key: "reduceMotion", field_type: "toggle", label: "Reduce Motion", hint: "Minimize animations and transitions", default_value: "false", group_label: "Accessibility", order: 6 },
  { field_key: "highContrast", field_type: "toggle", label: "High Contrast Mode", default_value: "false", group_label: "Accessibility", order: 7 },
  { field_key: "largerText", field_type: "toggle", label: "Larger Text Mode", default_value: "false", group_label: "Accessibility", order: 8 }
]

app_fields.each do |field_data|
  SettingsField.find_or_create_by(
    settings_section: app_section,
    field_key: field_data[:field_key]
  ) do |f|
    f.field_type = field_data[:field_type]
    f.label = field_data[:label]
    f.hint = field_data[:hint]
    f.options = field_data[:options] || []
    f.default_value = field_data[:default_value] || "true"
    f.group_label = field_data[:group_label]
    f.order = field_data[:order]
  end
end

# Legal Section
legal_section = SettingsSection.find_or_create_by(key: "legal") do |s|
  s.label = "Legal & Compliance"
  s.icon = "MdGavel"
  s.order = 10
end

puts "Seeded #{SettingsSection.count} settings sections with #{SettingsField.count} fields"

