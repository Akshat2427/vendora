class FormsController < ApplicationController
  before_action :set_form, only: [:show, :update, :destroy]

  def index
    @forms = Form.all
    render json: @forms
  end

  def show
    render json: @form, include: [:questions, :submissions]
  end

  def create
    @form = Form.new(form_params)
    if @form.save
      render json: @form, status: :created
    else
      render json: { errors: @form.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @form.update(form_params)
      render json: @form
    else
      render json: { errors: @form.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @form.destroy
    head :no_content
  end

  private

  def set_form
    @form = Form.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Form not found" }, status: :not_found
  end

  def form_params
    params.require(:form).permit(:slug, :title, :description, tags: [])
  end
end
