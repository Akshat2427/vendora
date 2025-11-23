import React, { useState } from "react";
import {
  MdAccountCircle,
  MdSecurity,
  MdNotifications,
  MdGavel,
  MdStore,
  MdPayment,
  MdPrivacyTip,
  MdEmail,
  MdSettings,
  MdGavel as MdLegal,
  MdPhone,
  MdLock,
  MdDeviceHub,
  MdVisibility,
  MdCreditCard,
  MdLanguage,
  MdDarkMode,
  MdDownload,
  MdDelete,
} from "react-icons/md";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("account");
  const [settings, setSettings] = useState({
    // Account Settings
    profilePhoto: "",
    fullName: "Akshat Vashisht",
    username: "akvashisht",
    email: "akvashisht24@gmail.com",
    phone: "+91-9876543210",
    dateOfBirth: "",
    billingAddress: "",
    shippingAddress: "",
    publicProfile: true,
    showWinningHistory: true,
    showRatings: true,

    // Security
    twoFactorEnabled: false,
    twoFactorMethod: "email",
    fraudAlerts: true,
    suspiciousLoginNotifications: true,

    // Notifications
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

    // Buying Preferences
    autoBid: false,
    bidConfirmation: true,
    quickBid: false,
    defaultBidIncrement: "5%",
    preferredShipping: "standard",
    autoWatchlist: false,

    // Selling Preferences
    storeName: "",
    businessEmail: "",
    businessAddress: "",
    returnPolicy: "",
    shippingHandlingTime: "3-5 days",
    defaultAuctionDuration: "7 days",
    defaultStartingBid: "",
    autoRelisting: false,
    vacationMode: false,

    // Payment
    defaultPaymentMethod: "card",
    gstNumber: "",

    // Privacy
    showProfileDetails: true,
    showListings: true,
    showRatingsPrivacy: true,
    showBidHistory: false,

    // Communication
    marketingEmails: false,
    newsletter: true,
    promotionalAlerts: false,
    partnerAds: false,

    // App Preferences
    theme: "dark",
    uiDensity: "comfortable",
    language: "en",
    currency: "USD",
    timezone: "UTC",
    reduceMotion: false,
    highContrast: false,
    largerText: false,
  });

  const sections = [
    { id: "account", label: "Account Settings", icon: MdAccountCircle },
    { id: "security", label: "Security & Login", icon: MdSecurity },
    { id: "notifications", label: "Notifications & Alerts", icon: MdNotifications },
    { id: "buying", label: "Buying & Bidding", icon: MdGavel },
    { id: "selling", label: "Selling Preferences", icon: MdStore },
    { id: "payment", label: "Payment & Billing", icon: MdPayment },
    { id: "privacy", label: "Privacy Settings", icon: MdPrivacyTip },
    { id: "communication", label: "Communication & Social", icon: MdEmail },
    { id: "app", label: "App & Interface", icon: MdSettings },
    { id: "legal", label: "Legal & Compliance", icon: MdLegal },
  ];

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const ToggleRow = ({ label, hint, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-200">{label}</div>
        {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-white/6 rounded-full peer peer-checked:bg-cyan-500 relative transition-colors">
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder, disabled = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none disabled:opacity-50"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Essential Fields</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center">
                    <MdAccountCircle className="text-4xl text-slate-400" />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Upload
                    </button>
                    <button className="px-4 py-2 border border-white/8 text-slate-200 rounded-md hover:bg-white/5">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <InputField
                label="Full Name"
                value={settings.fullName}
                onChange={(val) => updateSetting("fullName", val)}
              />
              <InputField
                label="Username / Handle"
                value={settings.username}
                onChange={(val) => updateSetting("username", val)}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                    Change Email
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => updateSetting("phone", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                    Verify
                  </button>
                </div>
              </div>
              <InputField
                label="Date of Birth"
                type="date"
                value={settings.dateOfBirth}
                onChange={(val) => updateSetting("dateOfBirth", val)}
              />
              <InputField
                label="Billing Address"
                value={settings.billingAddress}
                onChange={(val) => updateSetting("billingAddress", val)}
                placeholder="Enter billing address"
              />
              <InputField
                label="Shipping Address"
                value={settings.shippingAddress}
                onChange={(val) => updateSetting("shippingAddress", val)}
                placeholder="Enter shipping address"
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Visibility Controls</h3>
              <ToggleRow
                label="Public Profile Visibility"
                hint="Allow others to view your profile"
                checked={settings.publicProfile}
                onChange={(val) => updateSetting("publicProfile", val)}
              />
              <ToggleRow
                label="Show Winning History"
                hint="Display your auction wins publicly"
                checked={settings.showWinningHistory}
                onChange={(val) => updateSetting("showWinningHistory", val)}
              />
              <ToggleRow
                label="Show Ratings & Reviews"
                hint="Display your ratings and reviews"
                checked={settings.showRatings}
                onChange={(val) => updateSetting("showRatings", val)}
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdLock className="text-cyan-400" />
                Password & Authentication
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4">
                  <div>
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-slate-400">Update your account password</div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-slate-400">Add an extra layer of security</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <SelectField
                      value={settings.twoFactorMethod}
                      onChange={(val) => updateSetting("twoFactorMethod", val)}
                      options={[
                        { value: "email", label: "Email" },
                        { value: "sms", label: "SMS" },
                        { value: "app", label: "Authenticator App" },
                      ]}
                    />
                    <button
                      className={`px-4 py-2 rounded-md ${
                        settings.twoFactorEnabled
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } text-white`}
                      onClick={() => updateSetting("twoFactorEnabled", !settings.twoFactorEnabled)}
                    >
                      {settings.twoFactorEnabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdDeviceHub className="text-cyan-400" />
                Login Activity & Devices
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Current Session</div>
                      <div className="text-sm text-slate-400">Chrome on Windows • Last login: 2 hours ago</div>
                    </div>
                    <button className="px-3 py-1 text-sm border border-white/8 text-slate-200 rounded-md">
                      Revoke
                    </button>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-white/5 text-slate-200 rounded-md hover:bg-white/6">
                  View All Sessions
                </button>
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Safety Controls</h3>
              <ToggleRow
                label="Fraud Alerts"
                hint="Get notified about suspicious activity"
                checked={settings.fraudAlerts}
                onChange={(val) => updateSetting("fraudAlerts", val)}
              />
              <ToggleRow
                label="Suspicious Login Notifications"
                hint="Alert when login from new device/location"
                checked={settings.suspiciousLoginNotifications}
                onChange={(val) => updateSetting("suspiciousLoginNotifications", val)}
              />
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdEmail className="text-cyan-400" />
                Email Notifications
              </h3>
              <div className="space-y-0">
                <ToggleRow
                  label="Outbid Alerts"
                  checked={settings.emailOutbid}
                  onChange={(val) => updateSetting("emailOutbid", val)}
                />
                <ToggleRow
                  label="Auction Ending Soon"
                  checked={settings.emailAuctionEnding}
                  onChange={(val) => updateSetting("emailAuctionEnding", val)}
                />
                <ToggleRow
                  label="Bid Placed Confirmation"
                  checked={settings.emailBidPlaced}
                  onChange={(val) => updateSetting("emailBidPlaced", val)}
                />
                <ToggleRow
                  label="Auction Won"
                  checked={settings.emailAuctionWon}
                  onChange={(val) => updateSetting("emailAuctionWon", val)}
                />
                <ToggleRow
                  label="Auction Lost"
                  checked={settings.emailAuctionLost}
                  onChange={(val) => updateSetting("emailAuctionLost", val)}
                />
                <ToggleRow
                  label="Watchlist Item Updates"
                  checked={settings.emailWatchlist}
                  onChange={(val) => updateSetting("emailWatchlist", val)}
                />
                <ToggleRow
                  label="Payment Reminders"
                  checked={settings.emailPaymentReminders}
                  onChange={(val) => updateSetting("emailPaymentReminders", val)}
                />
                <ToggleRow
                  label="Shipping Updates"
                  checked={settings.emailShipping}
                  onChange={(val) => updateSetting("emailShipping", val)}
                />
                <ToggleRow
                  label="Seller Responds to Question"
                  checked={settings.emailSellerResponse}
                  onChange={(val) => updateSetting("emailSellerResponse", val)}
                />
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdPhone className="text-cyan-400" />
                SMS / WhatsApp Notifications
              </h3>
              <div className="space-y-0">
                <ToggleRow
                  label="Outbid Alerts"
                  checked={settings.smsOutbid}
                  onChange={(val) => updateSetting("smsOutbid", val)}
                />
                <ToggleRow
                  label="Auction Won"
                  checked={settings.smsAuctionWon}
                  onChange={(val) => updateSetting("smsAuctionWon", val)}
                />
                <ToggleRow
                  label="Urgent Platform Announcements"
                  checked={settings.smsUrgent}
                  onChange={(val) => updateSetting("smsUrgent", val)}
                />
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
              <div className="space-y-0">
                <ToggleRow
                  label="Outbid"
                  checked={settings.pushOutbid}
                  onChange={(val) => updateSetting("pushOutbid", val)}
                />
                <ToggleRow
                  label="Auction Ending Soon"
                  checked={settings.pushAuctionEnding}
                  onChange={(val) => updateSetting("pushAuctionEnding", val)}
                />
                <ToggleRow
                  label="Item Price Drops"
                  checked={settings.pushPriceDrops}
                  onChange={(val) => updateSetting("pushPriceDrops", val)}
                />
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Frequency Controls</h3>
              <SelectField
                label="Notification Frequency"
                value={settings.notificationFrequency}
                onChange={(val) => updateSetting("notificationFrequency", val)}
                options={[
                  { value: "realtime", label: "Real-time" },
                  { value: "daily", label: "Daily Digest" },
                  { value: "weekly", label: "Weekly Summary" },
                  { value: "important", label: "Only Important Alerts" },
                ]}
              />
            </div>
          </div>
        );

      case "buying":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Bid Behavior</h3>
              <ToggleRow
                label="Auto-bid"
                hint="Set maximum bid limit and let the system bid for you"
                checked={settings.autoBid}
                onChange={(val) => updateSetting("autoBid", val)}
              />
              <ToggleRow
                label="Bid Confirmation"
                hint="Confirm before placing a bid"
                checked={settings.bidConfirmation}
                onChange={(val) => updateSetting("bidConfirmation", val)}
              />
              <ToggleRow
                label="Quick Bid Toggle"
                hint="Enable one-click bidding"
                checked={settings.quickBid}
                onChange={(val) => updateSetting("quickBid", val)}
              />
              <SelectField
                label="Default Bid Increment Preference"
                value={settings.defaultBidIncrement}
                onChange={(val) => updateSetting("defaultBidIncrement", val)}
                options={[
                  { value: "1%", label: "1%" },
                  { value: "5%", label: "5%" },
                  { value: "10%", label: "10%" },
                  { value: "custom", label: "Custom" },
                ]}
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Buyer Preferences</h3>
              <SelectField
                label="Default Payment Method"
                value={settings.defaultPaymentMethod}
                onChange={(val) => updateSetting("defaultPaymentMethod", val)}
                options={[
                  { value: "card", label: "Credit/Debit Card" },
                  { value: "upi", label: "UPI" },
                  { value: "paypal", label: "PayPal" },
                ]}
              />
              <SelectField
                label="Preferred Shipping Method"
                value={settings.preferredShipping}
                onChange={(val) => updateSetting("preferredShipping", val)}
                options={[
                  { value: "standard", label: "Standard" },
                  { value: "express", label: "Express" },
                  { value: "overnight", label: "Overnight" },
                ]}
              />
              <ToggleRow
                label="Auto-watchlist"
                hint="Automatically add all bid items to watchlist"
                checked={settings.autoWatchlist}
                onChange={(val) => updateSetting("autoWatchlist", val)}
              />
            </div>
          </div>
        );

      case "selling":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Store / Seller Info</h3>
              <InputField
                label="Store Name"
                value={settings.storeName}
                onChange={(val) => updateSetting("storeName", val)}
              />
              <InputField
                label="Business Email"
                type="email"
                value={settings.businessEmail}
                onChange={(val) => updateSetting("businessEmail", val)}
              />
              <InputField
                label="Business Address"
                value={settings.businessAddress}
                onChange={(val) => updateSetting("businessAddress", val)}
              />
              <InputField
                label="Return Policy"
                value={settings.returnPolicy}
                onChange={(val) => updateSetting("returnPolicy", val)}
                placeholder="Describe your return policy"
              />
              <SelectField
                label="Shipping Handling Time"
                value={settings.shippingHandlingTime}
                onChange={(val) => updateSetting("shippingHandlingTime", val)}
                options={[
                  { value: "1-2 days", label: "1-2 days" },
                  { value: "3-5 days", label: "3-5 days" },
                  { value: "5-7 days", label: "5-7 days" },
                  { value: "7+ days", label: "7+ days" },
                ]}
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Auction Defaults</h3>
              <SelectField
                label="Default Auction Duration"
                value={settings.defaultAuctionDuration}
                onChange={(val) => updateSetting("defaultAuctionDuration", val)}
                options={[
                  { value: "1 day", label: "1 day" },
                  { value: "3 days", label: "3 days" },
                  { value: "7 days", label: "7 days" },
                  { value: "14 days", label: "14 days" },
                ]}
              />
              <InputField
                label="Default Starting Bid"
                type="number"
                value={settings.defaultStartingBid}
                onChange={(val) => updateSetting("defaultStartingBid", val)}
                placeholder="Enter amount"
              />
              <ToggleRow
                label="Automatic Relisting"
                hint="Automatically relist unsold items"
                checked={settings.autoRelisting}
                onChange={(val) => updateSetting("autoRelisting", val)}
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Seller Tools</h3>
              <InputField
                label="Auto-response Message Template"
                value=""
                onChange={() => {}}
                placeholder="Enter template message"
              />
              <ToggleRow
                label="Vacation Mode"
                hint="Pause all listings temporarily"
                checked={settings.vacationMode}
                onChange={(val) => updateSetting("vacationMode", val)}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Payment Receiving Account</label>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                    Add UPI ID
                  </button>
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                    Add Bank Account
                  </button>
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                    Add PayPal
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdCreditCard className="text-cyan-400" />
                Payment Methods
              </h3>
              <div className="space-y-3 mb-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdCreditCard className="text-2xl text-slate-300" />
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-slate-400">Expires 12/25</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm border border-white/8 text-slate-200 rounded-md">
                    Remove
                  </button>
                </div>
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add Payment Method
                </button>
              </div>
              <SelectField
                label="Set Default Payment Method"
                value={settings.defaultPaymentMethod}
                onChange={(val) => updateSetting("defaultPaymentMethod", val)}
                options={[
                  { value: "card", label: "Credit/Debit Card" },
                  { value: "upi", label: "UPI" },
                  { value: "paypal", label: "PayPal" },
                ]}
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Billing</h3>
              <InputField
                label="Billing Address"
                value={settings.billingAddress}
                onChange={(val) => updateSetting("billingAddress", val)}
              />
              <div className="mt-4 space-y-2">
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left flex items-center justify-between">
                  <span>Tax Invoices</span>
                  <MdDownload />
                </button>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left flex items-center justify-between">
                  <span>Download Past Bills</span>
                  <MdDownload />
                </button>
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Payouts (For Sellers)</h3>
              <InputField
                label="GST / VAT Number"
                value={settings.gstNumber}
                onChange={(val) => updateSetting("gstNumber", val)}
                placeholder="Enter GST/VAT number"
              />
              <div className="mt-4 space-y-2">
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                  Manage Linked Bank Accounts
                </button>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                  View Withdrawal History
                </button>
                <div className="p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4">
                  <div className="text-sm text-slate-400">Minimum Payout Threshold</div>
                  <div className="text-lg font-semibold mt-1">$50.00</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdVisibility className="text-cyan-400" />
                Visibility Preferences
              </h3>
              <div className="space-y-0">
                <ToggleRow
                  label="Show Profile Details"
                  checked={settings.showProfileDetails}
                  onChange={(val) => updateSetting("showProfileDetails", val)}
                />
                <ToggleRow
                  label="Show Listings"
                  checked={settings.showListings}
                  onChange={(val) => updateSetting("showListings", val)}
                />
                <ToggleRow
                  label="Show Ratings"
                  checked={settings.showRatingsPrivacy}
                  onChange={(val) => updateSetting("showRatingsPrivacy", val)}
                />
                <ToggleRow
                  label="Show Bid History"
                  hint="Privacy mode - hide your bidding activity"
                  checked={settings.showBidHistory}
                  onChange={(val) => updateSetting("showBidHistory", val)}
                />
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Data Controls</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left flex items-center justify-between">
                  <span>Download Your Data (GDPR Compliant)</span>
                  <MdDownload />
                </button>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left flex items-center justify-between">
                  <span>Export Purchase History</span>
                  <MdDownload />
                </button>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                  Request Account Data
                </button>
                <button className="w-full px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-md hover:bg-red-600/30 text-left flex items-center justify-between">
                  <span>Delete Account Request</span>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        );

      case "communication":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold">G</span>
                    </div>
                    <div>
                      <div className="font-medium">Google</div>
                      <div className="text-sm text-slate-400">Connected</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm border border-white/8 text-slate-200 rounded-md">
                    Disconnect
                  </button>
                </div>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6">
                  Connect Apple Account
                </button>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6">
                  Connect Facebook Account
                </button>
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Marketing & Communications</h3>
              <div className="space-y-0">
                <ToggleRow
                  label="Marketing Emails"
                  hint="Receive promotional emails and offers"
                  checked={settings.marketingEmails}
                  onChange={(val) => updateSetting("marketingEmails", val)}
                />
                <ToggleRow
                  label="Newsletter Subscription"
                  checked={settings.newsletter}
                  onChange={(val) => updateSetting("newsletter", val)}
                />
                <ToggleRow
                  label="Promotional Offer Alerts"
                  checked={settings.promotionalAlerts}
                  onChange={(val) => updateSetting("promotionalAlerts", val)}
                />
                <ToggleRow
                  label="Partner Ads Visibility"
                  hint="Show relevant partner advertisements"
                  checked={settings.partnerAds}
                  onChange={(val) => updateSetting("partnerAds", val)}
                />
              </div>
            </div>
          </div>
        );

      case "app":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdDarkMode className="text-cyan-400" />
                Themes
              </h3>
              <SelectField
                label="Theme"
                value={settings.theme}
                onChange={(val) => updateSetting("theme", val)}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                  { value: "system", label: "System" },
                ]}
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">UI Density</h3>
              <SelectField
                label="Interface Density"
                value={settings.uiDensity}
                onChange={(val) => updateSetting("uiDensity", val)}
                options={[
                  { value: "comfortable", label: "Comfortable" },
                  { value: "compact", label: "Compact" },
                ]}
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdLanguage className="text-cyan-400" />
                Language & Region
              </h3>
              <SelectField
                label="Language"
                value={settings.language}
                onChange={(val) => updateSetting("language", val)}
                options={[
                  { value: "en", label: "English" },
                  { value: "es", label: "Spanish" },
                  { value: "fr", label: "French" },
                  { value: "de", label: "German" },
                ]}
              />
              <SelectField
                label="Currency Display"
                value={settings.currency}
                onChange={(val) => updateSetting("currency", val)}
                options={[
                  { value: "USD", label: "USD ($)" },
                  { value: "EUR", label: "EUR (€)" },
                  { value: "GBP", label: "GBP (£)" },
                  { value: "INR", label: "INR (₹)" },
                ]}
              />
              <SelectField
                label="Timezone"
                value={settings.timezone}
                onChange={(val) => updateSetting("timezone", val)}
                options={[
                  { value: "UTC", label: "UTC" },
                  { value: "EST", label: "EST" },
                  { value: "PST", label: "PST" },
                  { value: "IST", label: "IST" },
                ]}
              />
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Accessibility</h3>
              <div className="space-y-0">
                <ToggleRow
                  label="Reduce Motion"
                  hint="Minimize animations and transitions"
                  checked={settings.reduceMotion}
                  onChange={(val) => updateSetting("reduceMotion", val)}
                />
                <ToggleRow
                  label="High Contrast Mode"
                  checked={settings.highContrast}
                  onChange={(val) => updateSetting("highContrast", val)}
                />
                <ToggleRow
                  label="Larger Text Mode"
                  checked={settings.largerText}
                  onChange={(val) => updateSetting("largerText", val)}
                />
              </div>
            </div>
          </div>
        );

      case "legal":
        return (
          <div className="space-y-6">
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Legal Documents</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                  Terms of Service
                </button>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                  Privacy Policy
                </button>
                <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                  Cookie Settings
                </button>
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Compliance & KYC</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4">
                  <div className="font-medium mb-2">KYC Verification Status</div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 text-sm rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                    Upload ID Document
                  </button>
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                    Upload Business Proof
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Agreement History</h3>
              <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left">
                View User Agreement Logs
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-7xl">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your account preferences and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-4 sticky top-4">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                          : "text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      <Icon className="text-xl" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
}
