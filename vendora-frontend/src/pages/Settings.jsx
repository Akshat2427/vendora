import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../store/slices/userSlice";
import { toast } from "react-hot-toast";
import { apiRequest } from "../services/api";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profilePhotoUrl: "",
    billingAddress: "",
    shippingAddress: "",
  });
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

  // Icon mapping for dynamic icon rendering
  const iconMap = {
    MdAccountCircle,
    MdSecurity,
    MdNotifications,
    MdGavel,
    MdStore,
    MdPayment,
    MdPrivacyTip,
    MdEmail,
    MdSettings,
    MdLegal,
    MdLock,
    MdDeviceHub,
    MdVisibility,
    MdCreditCard,
    MdLanguage,
    MdDarkMode,
    MdPhone,
  };

  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    fetchSettingsSections();
    if (currentUser?.id) {
      fetchSettings();
    }
  }, [currentUser?.id]);

  const fetchSettingsSections = async () => {
    try {
      setLoadingSections(true);
      const response = await apiRequest('/settings_sections');
      if (!response.ok) {
        throw new Error("Failed to fetch settings sections");
      }
      const data = await response.json();
      setSections(data.sections || []);
    } catch (error) {
      toast.error(error.message || "Failed to load settings sections");
    } finally {
      setLoadingSections(false);
    }
  };

  const fetchSettings = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      const response = await apiRequest(`/settings/${currentUser.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      
      setUserData({
        fullName: data.user.name || "",
        username: data.user.username || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        dateOfBirth: data.user.date_of_birth || "",
        profilePhotoUrl: data.user.profile_photo_url || "",
        billingAddress: data.user.billing_address || "",
        shippingAddress: data.user.shipping_address || "",
      });
      
      setSettings(data.preferences || {});
    } catch (error) {
      toast.error(error.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!currentUser?.id) return;

    try {
      setSaving(true);
      const response = await apiRequest(`/settings/${currentUser.id}`, {
        method: "PUT",
        body: JSON.stringify({
          user: {
            fullName: userData.fullName,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            date_of_birth: userData.dateOfBirth,
            profile_photo_url: userData.profilePhotoUrl,
            billing_address: userData.billingAddress,
            shipping_address: userData.shippingAddress,
          },
          preferences: settings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(", ") || "Failed to save settings");
      }

      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    // Auto-save after a short delay
    clearTimeout(window.settingsSaveTimeout);
    window.settingsSaveTimeout = setTimeout(() => {
      saveSettings();
    }, 1000);
  };

  const updateUserData = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
    // Auto-save after a short delay
    clearTimeout(window.settingsSaveTimeout);
    window.settingsSaveTimeout = setTimeout(() => {
      saveSettings();
    }, 1000);
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

  const renderField = (field) => {
    const fieldValue = field.key === "fullName" || field.key === "username" || field.key === "email" || 
                      field.key === "phone" || field.key === "dateOfBirth" || field.key === "billingAddress" || 
                      field.key === "shippingAddress"
      ? userData[field.key === "fullName" ? "fullName" : field.key === "dateOfBirth" ? "dateOfBirth" : 
         field.key === "billingAddress" ? "billingAddress" : field.key === "shippingAddress" ? "shippingAddress" : 
         field.key === "email" ? "email" : field.key === "phone" ? "phone" : "username"]
      : settings[field.key] || field.default_value || "";

    const handleChange = (value) => {
      if (field.key === "fullName" || field.key === "username" || field.key === "email" || 
          field.key === "phone" || field.key === "dateOfBirth" || field.key === "billingAddress" || 
          field.key === "shippingAddress") {
        updateUserData(field.key === "fullName" ? "fullName" : field.key === "dateOfBirth" ? "dateOfBirth" : 
                     field.key === "billingAddress" ? "billingAddress" : field.key === "shippingAddress" ? "shippingAddress" : 
                     field.key === "email" ? "email" : field.key === "phone" ? "phone" : "username", value);
      } else {
        updateSetting(field.key, value);
      }
    };

    switch (field.type) {
      case "toggle":
        return (
          <ToggleRow
            key={field.key}
            label={field.label}
            hint={field.hint}
            checked={fieldValue === true || fieldValue === "true"}
            onChange={(val) => handleChange(val)}
          />
        );
      case "select":
        return (
          <SelectField
            key={field.key}
            label={field.label}
            value={fieldValue}
            onChange={handleChange}
            options={field.options || []}
          />
        );
      case "textarea":
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
            <textarea
              value={fieldValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-slate-500 resize-none"
            />
          </div>
        );
      default:
        return (
          <InputField
            key={field.key}
            label={field.label}
            type={field.type}
            value={fieldValue}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const renderSection = () => {
    const currentSection = sections.find((s) => s.id === activeSection);
    if (!currentSection) return null;

    // Group fields by group_label
    const groupedFields = {};
    const ungroupedFields = [];

    currentSection.fields.forEach((field) => {
      if (field.type === "group") {
        // This is a group container
        if (!groupedFields[field.label]) {
          groupedFields[field.label] = [];
        }
        field.fields.forEach((f) => {
          groupedFields[field.label].push(f);
        });
      } else {
        if (field.group_label) {
          if (!groupedFields[field.group_label]) {
            groupedFields[field.group_label] = [];
          }
          groupedFields[field.group_label].push(field);
        } else {
          ungroupedFields.push(field);
        }
      }
    });

    return (
      <div className="space-y-6">
        {/* Special handling for account section - Profile Photo */}
        {activeSection === "account" && (
          <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
            <div className="mb-6">
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
          </div>
        )}

        {/* Render ungrouped fields first */}
        {ungroupedFields.length > 0 && (
          <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
            {ungroupedFields.map((field) => renderField(field))}
          </div>
        )}

        {/* Render grouped fields */}
        {Object.entries(groupedFields).map(([groupLabel, fields]) => (
          <div key={groupLabel} className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">{groupLabel}</h3>
            <div className="space-y-0">
              {fields.map((field) => renderField(field))}
            </div>
          </div>
        ))}

        {/* Logout button in account section */}
        {activeSection === "account" && (
          <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
            <button
              onClick={async () => {
                try {
                  await dispatch(logoutUser()).unwrap();
                  toast.success("Logged out successfully");
                  navigate("/login");
                } catch {
                  toast.error("Failed to logout");
                }
              }}
              className="w-full px-4 py-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all font-medium"
            >
              Logout
            </button>
          </div>
        )}

        {/* Special sections that need custom rendering */}
        {activeSection === "security" && (
          <>
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
          </>
        )}

        {activeSection === "payment" && (
          <>
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
            </div>
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Billing</h3>
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
          </>
        )}

        {activeSection === "privacy" && (
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
        )}

        {activeSection === "communication" && (
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
        )}

        {activeSection === "legal" && (
          <>
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
          </>
        )}

        {activeSection === "selling" && (
          <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Seller Tools</h3>
            <InputField
              label="Auto-response Message Template"
              value=""
              onChange={() => {}}
              placeholder="Enter template message"
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
        )}
      </div>
    );
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
                {loadingSections ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                  </div>
                ) : (
                  sections.map((section) => {
                    const Icon = iconMap[section.icon] || MdSettings;
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
                  })
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <>
                {renderSection()}
                {saving && (
                  <div className="fixed bottom-4 right-4 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    Saving...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
