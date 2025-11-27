class SettingsController < ApplicationController
  before_action :set_user, only: [:show, :update]

  def show
    user_id = params[:user_id]
    
    unless user_id
      return render json: { error: "user_id is required" }, status: :bad_request
    end

    user = User.find(user_id)
    user_preference = UserPreference.find_or_create_by(user_id: user_id) do |up|
      up.preferences = {}
    end

    render json: {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        profile_photo_url: user.profile_photo_url,
        billing_address: user.billing_address,
        shipping_address: user.shipping_address
      },
      preferences: user_preference.all_preferences
    }
  end

  def update
    user_id = params[:user_id]
    
    unless user_id
      return render json: { error: "user_id is required" }, status: :bad_request
    end

    user = User.find(user_id)
    user_preference = UserPreference.find_or_create_by(user_id: user_id) do |up|
      up.preferences = {}
    end

    # Update user fields
    user_params = params[:user] || {}
    user.update(
      name: user_params[:fullName] || user_params[:name] || user.name,
      username: user_params[:username] || user.username,
      email: user_params[:email] || user.email,
      phone: user_params[:phone] || user.phone,
      date_of_birth: user_params[:date_of_birth] || user.date_of_birth,
      profile_photo_url: user_params[:profile_photo_url] || user.profile_photo_url,
      billing_address: user_params[:billing_address] || user.billing_address,
      shipping_address: user_params[:shipping_address] || user.shipping_address
    )

    # Update preferences
    preferences_params = params[:preferences] || {}
    user_preference.update_preferences(preferences_params)

    if user.save && user_preference.save
      render json: {
        success: true,
        message: "Settings updated successfully",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          date_of_birth: user.date_of_birth,
          profile_photo_url: user.profile_photo_url,
          billing_address: user.billing_address,
          shipping_address: user.shipping_address
        },
        preferences: user_preference.all_preferences
      }
    else
      errors = user.errors.full_messages + user_preference.errors.full_messages
      render json: {
        success: false,
        errors: errors
      }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "User not found" }, status: :not_found
  end
end

