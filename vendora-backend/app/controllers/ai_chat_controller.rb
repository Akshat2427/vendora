class AiChatController < ApplicationController
  def chat
    message = params[:message]
    conversation_history = params[:conversation_history] || []

    if message.blank?
      return render json: { error: "Message is required" }, status: :bad_request
    end

    Rails.logger.info "AI Chat Request: message=#{message[0..50]}..., history_length=#{conversation_history.length}"

    start_time = Time.current
    result = Ai::GeminiService.chat(message, conversation_history)
    elapsed_time = Time.current - start_time

    Rails.logger.info "AI Chat Response: success=#{result[:success]}, elapsed=#{elapsed_time.round(2)}s"

    if result[:success]
      render json: {
        message: result[:message],
        success: true
      }
    else
      render json: {
        error: result[:error],
        message: result[:message],
        success: false
      }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error "AI Chat Controller Error: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: {
      error: e.message,
      message: "Sorry, I encountered an error. Please try again.",
      success: false
    }, status: :internal_server_error
  end
end

