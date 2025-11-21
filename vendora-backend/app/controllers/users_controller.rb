class UsersController < ApplicationController
  before_action :validate_params, only: [:create]
    def index
      render json: { message: "User Index" }
    end

    def create
      user = User.create(params.permit(:name, :email, :phone, :prefix, :address).merge(status: :active))
      if user.persisted?
        render json: { message: "User created successfully", user: user }, status: :created
      else
        render json: { error: "Failed to create user", errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def validate_params
      if params[:name].blank? || params[:email].blank?
        render json: { error: "Name, email and password are required" }, status: :bad_request
      end
    end
end
