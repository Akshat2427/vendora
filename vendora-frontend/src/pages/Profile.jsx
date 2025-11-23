// ProfilePageFuturistic.jsx
import React, { useState } from "react";
import {
  MdVerified,
  MdStar,
  MdEdit,
  MdSecurity,
  MdLock,
  MdNotifications,
  MdEmail,
} from "react-icons/md";

/*
  Futuristic profile page (Tailwind CSS).
  - Uses glassmorphism cards, gradients, and subtle animations
  - Avatar uses local generated logo path: /mnt/data/A_vector_logo_design_in_black_features_a_stylized_.png
  - Keep your existing state hooks (isEditing, personalInfo, preferences, bio)
*/

export default function Profile({
  initialPersonalInfo,
  initialPreferences,
  initialBio,
}) {
  // initial props fallback
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(
    initialPersonalInfo || {
      fullName: "Akshat Vashisht",
      email: "akvashisht24@gmail.com",
      phone: "+91-9876543210",
      location: "New Delhi, India",
    }
  );

  const [preferences, setPreferences] = useState(
    initialPreferences || {
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
    }
  );

  const [bio, setBio] = useState(initialBio || "I sell vintage watches.");
  const [saving, setSaving] = useState(false);

  // example save handler (replace with real API call)
  const saveProfile = async () => {
    setSaving(true);
    try {
      // await api.updateProfile(personalInfo, preferences, bio)
      await new Promise((r) => setTimeout(r, 700)); // mimic latency
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your personal info, preferences and listings.
          </p>
        </div>

        {/* Header Card (glass) */}
        <div className="bg-white/6 backdrop-blur-sm border border-white/6 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with gradient ring */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400 opacity-90 filter blur-lg animate-[pulse_6s_linear_infinite]" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center">
                  {/* Local path to generated logo (transform to CDN if needed) */}
                  <img
                    src="vendora_logo.png"
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Name, role, bio, actions */}
            <div className="flex-1 w-full">
              <div className="flex items-start sm:items-center gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                      {personalInfo.fullName}
                    </h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-cyan-500 text-black text-sm font-semibold rounded-full">
                      Buyer / Seller
                    </span>
                    <div className="flex items-center gap-3 ml-3">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <MdVerified />
                        <span className="text-sm font-medium text-emerald-300">
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <MdStar />
                        <span className="text-sm font-medium text-amber-300">
                          4.8
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Short bio (editable) */}
                  <div className="mt-3">
                    {isEditing ? (
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={2}
                        className="w-full resize-none bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    ) : (
                      <p className="text-sm text-slate-300 max-w-2xl">{bio}</p>
                    )}
                  </div>
                </div>

                {/* Edit / Save Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (isEditing) saveProfile();
                      else setIsEditing(true);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-transform transform
                      ${isEditing ? "bg-emerald-500 hover:scale-[1.02]" : "bg-indigo-600 hover:scale-[1.02]"} 
                      text-white shadow-lg`}
                    disabled={saving}
                  >
                    <MdEdit />
                    {saving ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
                  </button>

                  {/* Quick public preview CTA */}
                  <button className="px-3 py-2 bg-white/5 text-sm rounded-md hover:bg-white/6">
                    View Public
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (primary) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="text-sm text-slate-400">Private to you</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={saveProfile}
                    className="px-4 py-2 bg-emerald-500 text-black rounded-md font-medium shadow hover:brightness-105"
                    disabled={saving}
                  >
                    Save changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // reset to initial data if needed
                    }}
                    className="px-4 py-2 border border-white/8 rounded-md text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Preferences Card */}
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <div className="text-sm text-slate-400">Customize notifications</div>
              </div>

              <div className="space-y-4">
                <ToggleRow
                  label="Email Notifications"
                  hint="Bids, outbid alerts, promotions"
                  checked={preferences.emailNotifications}
                  onChange={(val) => setPreferences({ ...preferences, emailNotifications: val })}
                />
                <ToggleRow
                  label="SMS Notifications"
                  hint="Receive text updates"
                  checked={preferences.smsNotifications}
                  onChange={(val) => setPreferences({ ...preferences, smsNotifications: val })}
                />
                <ToggleRow
                  label="Public Profile"
                  hint="Allow others to view your public profile"
                  checked={preferences.publicProfile}
                  onChange={(val) => setPreferences({ ...preferences, publicProfile: val })}
                />
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <MdSecurity className="text-cyan-400 text-2xl" />
                <h3 className="text-lg font-semibold">Security</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4">
                  <div className="flex items-center gap-3">
                    <MdLock className="text-slate-300 text-xl" />
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-400">Add an extra layer of security</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 rounded-md text-white">Enable</button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/4">
                  <div className="flex items-center gap-3">
                    <MdLock className="text-slate-300 text-xl" />
                    <div>
                      <div className="font-medium">Change Password</div>
                      <div className="text-sm text-slate-400">Update your account password</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-white/8 rounded-md text-slate-200">Change</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column (secondary) */}
          <aside className="space-y-6">
            {/* Listings (glass) */}
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Listings</h3>
                <button className="text-sm text-cyan-300">View All</button>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-white/2 to-white/1 border border-white/5"
                  >
                    <div className="w-16 h-12 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">Product {i}</div>
                      <div className="text-sm text-slate-400">$99.99</div>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 rounded text-white">Manage</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <h3 className="text-lg font-semibold mb-3">Activity Summary</h3>
              <div className="grid grid-cols-1 gap-3">
                <StatCard number="24" label="Active Bids" tone="blue" />
                <StatCard number="12" label="Wins" tone="green" />
                <StatCard number="8" label="Watchlist" tone="amber" />
              </div>
            </div>

            {/* Notification Settings (compact) */}
            <div className="bg-white/6 backdrop-blur-sm p-6 rounded-xl border border-white/6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <MdNotifications className="text-cyan-400 text-2xl" />
                <h3 className="text-lg font-semibold">Notification Settings</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MdEmail className="text-slate-300" />
                    <div>
                      <div className="text-sm">Email Frequency</div>
                      <div className="text-xs text-slate-400">Daily / Weekly / Never</div>
                    </div>
                  </div>
                  <select className="bg-white/5 px-3 py-1 rounded-md text-slate-100">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Never</option>
                  </select>
                </div>

                <button className="w-full px-3 py-2 rounded-md bg-white/6 text-slate-100">
                  Manage All Notifications
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

// Reusable toggle row (simple)
function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-slate-200">{label}</div>
        <div className="text-xs text-slate-400">{hint}</div>
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
}

// Stat card small
function StatCard({ number, label, tone = "blue" }) {
  const toneMap = {
    blue: "from-blue-500 to-cyan-400 text-white",
    green: "from-emerald-400 to-green-500 text-white",
    amber: "from-amber-400 to-yellow-500 text-slate-900",
  };
  return (
    <div className={`p-3 rounded-lg bg-gradient-to-r ${toneMap[tone]} shadow`}>
      <div className="text-2xl font-bold">{number}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}