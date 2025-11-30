import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdNotifications,
  MdNotificationsActive,
  MdCheckCircle,
  MdGavel,
  MdFeedback,
  MdAddCircle,
  MdDelete,
  MdArrowBack,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { apiRequest } from "../services/api";

function Notification() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      const seenParam = filter === "unread" ? "false" : filter === "read" ? "true" : null;
      const url = `/notifications?user_id=${currentUser.id}${seenParam ? `&seen=${seenParam}` : ""}`;

      const response = await apiRequest(url);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      toast.error(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, filter]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
    }
  }, [currentUser?.id, fetchNotifications]);

  const markAsSeen = async (notificationId) => {
    try {
      const response = await apiRequest(`/notifications/${notificationId}/mark_seen`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as seen");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, seen: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(error.message || "Failed to update notification");
    }
  };

  const markAllAsSeen = async () => {
    if (!currentUser?.id) return;

    try {
      const response = await apiRequest('/notifications/mark_all_seen', {
        method: "POST",
        body: JSON.stringify({ user_id: currentUser.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as seen");
      }

      // Update local state
      setNotifications((prev) => prev.map((notif) => ({ ...notif, seen: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(error.message || "Failed to update notifications");
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as seen if not already seen
    if (!notification.seen) {
      markAsSeen(notification.id);
    }

    // Navigate to deeplink if available
    if (notification.deeplink) {
      navigate(notification.deeplink);
    }
  };

  const getNotificationIcon = (notificationType) => {
    switch (notificationType) {
      case "bid_placed":
      case "bid_received":
        return <MdGavel className="text-cyan-400" />;
      case "feedback_submitted":
        return <MdFeedback className="text-indigo-400" />;
      case "auction_created":
        return <MdAddCircle className="text-green-400" />;
      default:
        return <MdNotifications className="text-slate-400" />;
    }
  };

  const getNotificationColor = (notificationType) => {
    switch (notificationType) {
      case "bid_placed":
      case "bid_received":
        return "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30";
      case "feedback_submitted":
        return "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30";
      case "auction_created":
        return "from-green-500/20 to-green-600/10 border-green-500/30";
      default:
        return "from-slate-500/20 to-slate-600/10 border-slate-500/30";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500">
                <MdNotifications className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">Notifications</h1>
                <p className="text-sm text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsSeen}
                className="px-4 py-2 bg-white/6 hover:bg-white/8 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <MdCheckCircle />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                  : "bg-white/6 text-slate-300 hover:bg-white/8"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                filter === "unread"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                  : "bg-white/6 text-slate-300 hover:bg-white/8"
              }`}
            >
              <MdNotificationsActive />
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "read"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                  : "bg-white/6 text-slate-300 hover:bg-white/8"
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-12 text-center">
            <MdNotifications className="text-6xl text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-slate-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-gradient-to-r ${getNotificationColor(notification.notification_type)} backdrop-blur-sm rounded-xl border p-4 cursor-pointer hover:scale-[1.02] transition-all ${
                    !notification.seen ? "ring-2 ring-cyan-400/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-100 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {formatTime(notification.created_at)}
                          </p>
                        </div>
                        {!notification.seen && (
                          <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
