class FaqsController < ApplicationController
  def index
    faqs = Faq.formatted
    render json: { faq_categories: faqs }
  end

  def show
    @faq = Faq.find(params[:id])
    render json: @faq.as_json
  end
end

