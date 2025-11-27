class NotificationsController < ApplicationController
  before_action :set_notification, only: [:show, :mark_seen]

  def index
    user_id = params[:user_id]
    
    unless user_id
      return render json: { error: "user_id is required" }, status: :bad_request
    end

    notifications = Notification.where(user_id: user_id)
      .recent
      .limit(params[:limit] || 50)
    
    # Filter by seen status if provided
    notifications = notifications.where(seen: params[:seen]) if params[:seen].present?
    
    # Filter by type if provided
    notifications = notifications.where(notification_type: params[:type]) if params[:type].present?

    render json: {
      notifications: notifications.as_json,
      unread_count: Notification.where(user_id: user_id, seen: false).count
    }
  end

  def show
    render json: @notification.as_json
  end

  def mark_seen
    @notification.mark_as_seen!
    render json: { success: true, notification: @notification.as_json }
  end

  def mark_all_seen
    user_id = params[:user_id]
    
    unless user_id
      return render json: { error: "user_id is required" }, status: :bad_request
    end

    updated_count = Notification.where(user_id: user_id, seen: false).update_all(seen: true)
    
    render json: {
      success: true,
      message: "Marked #{updated_count} notifications as seen"
    }
  end

  private

  def set_notification
    @notification = Notification.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Notification not found" }, status: :not_found
  end
end

