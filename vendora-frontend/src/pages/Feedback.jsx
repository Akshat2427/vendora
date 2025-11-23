import React, { useState } from "react";
import {
  MdFeedback,
  MdHelpOutline,
  MdQuestionAnswer,
  MdSend,
  MdExpandMore,
  MdExpandLess,
  MdStar,
  MdEmail,
  MdPhone,
} from "react-icons/md";

export default function Feedback() {
  const [activeCategory, setActiveCategory] = useState("faq");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    type: "general",
    subject: "",
    message: "",
    rating: 0,
  });

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: MdHelpOutline,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on the 'Sign Up' button in the top right corner, enter your email address, create a password, and verify your email. You can also sign up using Google, Apple, or Facebook.",
        },
        {
          q: "How do I place a bid?",
          a: "Browse available auctions, select an item you're interested in, and click 'Place Bid'. Enter your bid amount and confirm. You can also enable auto-bidding to automatically bid up to your maximum limit.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept credit/debit cards, UPI, PayPal, and bank transfers. You can add multiple payment methods in your Settings under Payment & Billing.",
        },
        {
          q: "How does shipping work?",
          a: "After winning an auction, you'll receive payment instructions. Once payment is confirmed, the seller will ship your item. Shipping times vary by seller and method selected.",
        },
      ],
    },
    {
      id: "bidding",
      title: "Bidding & Auctions",
      icon: MdQuestionAnswer,
      questions: [
        {
          q: "What is auto-bidding?",
          a: "Auto-bidding allows you to set a maximum bid amount. The system will automatically bid on your behalf up to that limit, helping you stay competitive without constant monitoring.",
        },
        {
          q: "Can I retract a bid?",
          a: "Bids are generally final. However, you may retract a bid within 5 minutes of placing it if you made an error. After that, bids cannot be retracted.",
        },
        {
          q: "What happens if I win an auction?",
          a: "You'll receive an email notification and payment instructions. Complete payment within 48 hours. The seller will then ship your item to the address on file.",
        },
        {
          q: "How do I know if I've been outbid?",
          a: "You'll receive notifications via email, SMS, or push notifications (based on your preferences) when you're outbid. You can also check your 'My Bids' section.",
        },
      ],
    },
    {
      id: "selling",
      title: "Selling on Vendora",
      icon: MdFeedback,
      questions: [
        {
          q: "How do I list an item for auction?",
          a: "Go to 'Sell' in the navigation, click 'Create Listing', upload photos, add a description, set your starting bid and reserve price, choose auction duration, and publish.",
        },
        {
          q: "What fees do sellers pay?",
          a: "Sellers pay a 10% commission on final sale price, plus payment processing fees. There are no listing fees or monthly subscriptions.",
        },
        {
          q: "When do I receive payment?",
          a: "Payment is released to your account 3-5 business days after the buyer confirms receipt of the item. You can set up payout methods in Settings.",
        },
        {
          q: "Can I cancel an auction?",
          a: "You can cancel an auction before any bids are placed. Once bidding starts, you can only end it early if you accept the current highest bid.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Security",
      icon: MdHelpOutline,
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Settings > Security & Login > Change Password. Enter your current password and create a new one. We recommend using a strong, unique password.",
        },
        {
          q: "How do I enable two-factor authentication?",
          a: "Navigate to Settings > Security & Login > Two-Factor Authentication. Choose your preferred method (Email, SMS, or Authenticator App) and follow the setup instructions.",
        },
        {
          q: "How do I update my profile information?",
          a: "You can edit your profile in Settings > Account Settings. Update your name, email, phone, address, and profile photo. Changes are saved immediately.",
        },
        {
          q: "What should I do if I notice suspicious activity?",
          a: "Immediately change your password and enable 2FA if not already active. Contact our support team and review your login activity in Settings > Security & Login.",
        },
      ],
    },
    {
      id: "payments",
      title: "Payments & Refunds",
      icon: MdQuestionAnswer,
      questions: [
        {
          q: "How do I add a payment method?",
          a: "Go to Settings > Payment & Billing > Payment Methods. Click 'Add Payment Method' and enter your card details, UPI ID, or PayPal information.",
        },
        {
          q: "What is your refund policy?",
          a: "Refunds are handled on a case-by-case basis. If an item doesn't match its description or arrives damaged, contact support within 7 days of delivery for a refund request.",
        },
        {
          q: "How long do refunds take?",
          a: "Refunds are processed within 5-10 business days after approval. The time may vary depending on your payment method and bank processing times.",
        },
        {
          q: "Are there any transaction fees?",
          a: "Buyers pay the final bid amount plus shipping. Sellers pay a 10% commission and payment processing fees. All fees are clearly displayed before you commit.",
        },
      ],
    },
  ];

  const feedbackTypes = [
    { value: "general", label: "General Feedback" },
    { value: "bug", label: "Report a Bug" },
    { value: "feature", label: "Feature Request" },
    { value: "complaint", label: "Complaint" },
    { value: "compliment", label: "Compliment" },
  ];

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // Handle feedback submission
    alert("Thank you for your feedback! We'll review it and get back to you soon.");
    setFeedbackForm({
      type: "general",
      subject: "",
      message: "",
      rating: 0,
    });
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-7xl">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <MdFeedback className="text-cyan-400" />
            Feedback & FAQ
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Find answers to common questions or send us your feedback
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("faq")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === "faq"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                  : "bg-white/6 text-slate-300 hover:bg-white/8"
              }`}
            >
              <MdHelpOutline className="inline mr-2" />
              FAQ
            </button>
            <button
              onClick={() => setActiveCategory("feedback")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === "feedback"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                  : "bg-white/6 text-slate-300 hover:bg-white/8"
              }`}
            >
              <MdFeedback className="inline mr-2" />
              Send Feedback
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        {activeCategory === "faq" && (
          <div className="space-y-6">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="text-cyan-400 text-2xl" />
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {category.questions.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg border border-white/5 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(`${category.id}-${index}`)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="font-medium text-slate-200">{faq.q}</span>
                          {expandedFaq === `${category.id}-${index}` ? (
                            <MdExpandLess className="text-slate-400 text-xl flex-shrink-0" />
                          ) : (
                            <MdExpandMore className="text-slate-400 text-xl flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === `${category.id}-${index}` && (
                          <div className="px-4 pb-4 text-slate-300 text-sm leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback Form Section */}
        {activeCategory === "feedback" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feedback Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MdSend className="text-cyan-400" />
                  Send Us Your Feedback
                </h2>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Feedback Type
                    </label>
                    <select
                      value={feedbackForm.type}
                      onChange={(e) =>
                        setFeedbackForm({ ...feedbackForm, type: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    >
                      {feedbackTypes.map((type) => (
                        <option key={type.value} value={type.value} className="bg-slate-800">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      value={feedbackForm.subject}
                      onChange={(e) =>
                        setFeedbackForm({ ...feedbackForm, subject: e.target.value })
                      }
                      placeholder="Brief description of your feedback"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                    <textarea
                      value={feedbackForm.message}
                      onChange={(e) =>
                        setFeedbackForm({ ...feedbackForm, message: e.target.value })
                      }
                      rows={6}
                      placeholder="Tell us more about your feedback, suggestion, or issue..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-slate-500 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      How would you rate your experience?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                          className="text-3xl transition-transform hover:scale-110"
                        >
                          <MdStar
                            className={
                              star <= feedbackForm.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-500"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                  >
                    <MdSend />
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Need More Help?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <MdEmail className="text-cyan-400 text-xl" />
                    <div>
                      <div className="text-sm font-medium">Email Support</div>
                      <div className="text-xs text-slate-400">support@vendora.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <MdPhone className="text-cyan-400 text-xl" />
                    <div>
                      <div className="text-sm font-medium">Phone Support</div>
                      <div className="text-xs text-slate-400">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 rounded-lg border border-indigo-500/30">
                    <div className="text-sm font-medium mb-1">Response Time</div>
                    <div className="text-xs text-slate-300">
                      We typically respond within 24-48 hours
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left text-sm">
                    Terms of Service
                  </button>
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left text-sm">
                    Privacy Policy
                  </button>
                  <button className="w-full px-4 py-2 bg-white/5 border border-white/8 text-slate-200 rounded-md hover:bg-white/6 text-left text-sm">
                    Community Guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

