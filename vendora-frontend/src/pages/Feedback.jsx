import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
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
  MdHistory,
} from "react-icons/md";

const API_BASE = "http://localhost:5000";

// Icon mapping for FAQ categories
const iconMap = {
  MdHelpOutline: MdHelpOutline,
  MdQuestionAnswer: MdQuestionAnswer,
  MdFeedback: MdFeedback,
};

export default function Feedback() {
  const { currentUser } = useSelector((state) => state.user);
  const [activeCategory, setActiveCategory] = useState("faq");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [faqCategories, setFaqCategories] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    type: "general",
    subject: "",
    message: "",
    rating: 0,
  });

  const feedbackTypes = [
    { value: "general", label: "General Feedback" },
    { value: "bug", label: "Report a Bug" },
    { value: "feature", label: "Feature Request" },
    { value: "complaint", label: "Complaint" },
    { value: "compliment", label: "Compliment" },
  ];

  useEffect(() => {
    fetchFaqs();
    if (activeCategory === "your-feedbacks" && currentUser?.id) {
      fetchUserFeedbacks();
    }
  }, [activeCategory, currentUser?.id]);

  const fetchFaqs = async () => {
    try {
      setLoadingFaqs(true);
      const response = await fetch(`${API_BASE}/faqs`);
      if (!response.ok) {
        throw new Error("Failed to fetch FAQs");
      }
      const data = await response.json();
      setFaqCategories(data.faq_categories || []);
    } catch (error) {
      toast.error(error.message || "Failed to load FAQs");
    } finally {
      setLoadingFaqs(false);
    }
  };

  const fetchUserFeedbacks = async () => {
    if (!currentUser?.id) return;

    try {
      setLoadingFeedbacks(true);
      const response = await fetch(`${API_BASE}/feedback?user_id=${currentUser.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }
      const data = await response.json();
      setUserFeedbacks(data.feedbacks || []);
    } catch (error) {
      toast.error(error.message || "Failed to load your feedbacks");
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackForm.subject.trim() || !feedbackForm.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/feedback/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: feedbackForm.type,
          subject: feedbackForm.subject,
          message: feedbackForm.message,
          rating: feedbackForm.rating,
          user_id: currentUser?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(", ") || data.error || "Failed to submit feedback");
      }

      toast.success(data.message || "Thank you for your feedback! We'll review it and get back to you soon.");

      setFeedbackForm({
        type: "general",
        subject: "",
        message: "",
        rating: 0,
      });

      // Refresh user feedbacks if on that tab
      if (activeCategory === "your-feedbacks") {
        fetchUserFeedbacks();
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFeedbackTypeLabel = (type) => {
    const feedbackType = feedbackTypes.find((ft) => ft.value === type);
    return feedbackType ? feedbackType.label : type;
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
              <MdSend className="inline mr-2" />
              Send Feedback
            </button>
            {currentUser?.id && (
              <button
                onClick={() => setActiveCategory("your-feedbacks")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === "your-feedbacks"
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                    : "bg-white/6 text-slate-300 hover:bg-white/8"
                }`}
              >
                <MdHistory className="inline mr-2" />
                Your Feedbacks
              </button>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {activeCategory === "faq" && (
          <div className="space-y-6">
            {loadingFaqs ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : faqCategories.length === 0 ? (
              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-12 text-center">
                <MdHelpOutline className="text-6xl text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No FAQs available</h3>
                <p className="text-slate-400">Check back later for frequently asked questions.</p>
              </div>
            ) : (
              faqCategories.map((category) => {
                const Icon = iconMap[category.icon] || MdHelpOutline;
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
              })
            )}
          </div>
        )}

        {/* Your Feedbacks Section */}
        {activeCategory === "your-feedbacks" && (
          <div className="space-y-4">
            {loadingFeedbacks ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : userFeedbacks.length === 0 ? (
              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-12 text-center">
                <MdFeedback className="text-6xl text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No feedbacks yet</h3>
                <p className="text-slate-400 mb-4">You haven't submitted any feedback yet.</p>
                <button
                  onClick={() => setActiveCategory("feedback")}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-600 transition-all"
                >
                  Submit Your First Feedback
                </button>
              </div>
            ) : (
              userFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 border border-indigo-500/30 rounded-lg text-sm font-medium text-cyan-400">
                          {getFeedbackTypeLabel(feedback.type)}
                        </span>
                        {feedback.rating > 0 && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <MdStar
                                key={i}
                                className={
                                  i < feedback.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-slate-500"
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-1">
                        {feedback.subject}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                      {formatDate(feedback.created_at)}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{feedback.message}</p>
                </div>
              ))
            )}
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
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdSend />
                    {submitting ? "Submitting..." : "Submit Feedback"}
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
