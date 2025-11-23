class SubmissionsController < ApplicationController
  before_action :set_submission, only: [:show, :update, :destroy]

  def index
    @submissions = Submission.all
    @submissions = @submissions.where(form_id: params[:form_id]) if params[:form_id].present?
    @submissions = @submissions.where(user_id: params[:user_id]) if params[:user_id].present?
    render json: @submissions, include: [:form, :user, :answers]
  end

  def show
    render json: @submission, include: [:form, :user, :answers, :attachments]
  end

  def create
    @submission = Submission.new(submission_params)
    if @submission.save
      render json: @submission, status: :created, include: [:form, :answers]
    else
      render json: { errors: @submission.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @submission.update(submission_params)
      render json: @submission, include: [:form, :answers]
    else
      render json: { errors: @submission.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @submission.destroy
    head :no_content
  end

  private

  def set_submission
    @submission = Submission.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Submission not found" }, status: :not_found
  end

  def submission_params
    params.require(:submission).permit(:form_id, :user_id, :submitter_type, :status, :question_version, meta: {})
  end
end
