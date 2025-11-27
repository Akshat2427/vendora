require "net/http"
require "json"
require "uri"

module Ai
  class GeminiService
    API_KEY = "AIzaSyA7nh3nDWLRBlm2psgv98B8IG7iS8651M4"
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

    def self.chat(message, conversation_history = [])
      uri = URI("#{BASE_URL}?key=#{API_KEY}")

      # Build the conversation context
      contents = []

      # Add conversation history
      conversation_history.each do |msg|
        role = msg[:role] || msg["role"]
        text = msg[:text] || msg[:message] || msg["text"] || msg["message"]

        next if text.blank?

        # Map 'model' to 'model' and 'user' to 'user'
        role = "model" if role == "assistant" || role == "model"
        role = "user" if role == "user"

        contents << {
          role: role,
          parts: [ { text: text.to_s } ]
        }
      end

      # Add current message
      contents << {
        role: "user",
        parts: [ { text: message.to_s } ]
      }

      request_body = {
        contents: contents
      }

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.read_timeout = 30 # 30 second timeout
      http.open_timeout = 10 # 10 second connection timeout

      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request.body = request_body.to_json

      Rails.logger.info "Gemini API Request: #{uri.host}#{uri.path}"
      Rails.logger.debug "Request body: #{request_body.to_json}"

      start_time = Time.current
      response = http.request(request)
      elapsed_time = Time.current - start_time

      Rails.logger.info "Gemini API Response: #{response.code} (#{elapsed_time.round(2)}s)"

      if response.code == "200"
        data = JSON.parse(response.body)
        text = data.dig("candidates", 0, "content", "parts", 0, "text")

        if text.blank?
          Rails.logger.error "Empty response from Gemini: #{data.inspect}"
        end

        {
          success: true,
          message: text || "No response from AI",
          full_response: data
        }
      else
        error_body = response.body
        Rails.logger.error "Gemini API Error: #{response.code} - #{error_body}"
        {
          success: false,
          error: "API Error: #{response.code} - #{error_body}",
          message: "Sorry, I encountered an error. Please try again."
        }
      end
    rescue Net::TimeoutError, Timeout::Error => e
      Rails.logger.error "Gemini API Timeout: #{e.message}"
      {
        success: false,
        error: "Request timeout: #{e.message}",
        message: "The request took too long. Please try again."
      }
    rescue Net::OpenTimeout => e
      Rails.logger.error "Gemini API Connection Timeout: #{e.message}"
      {
        success: false,
        error: "Connection timeout: #{e.message}",
        message: "Could not connect to AI service. Please try again."
      }
    rescue JSON::ParserError => e
      Rails.logger.error "Gemini API JSON Parse Error: #{e.message}"
      {
        success: false,
        error: "Invalid response format: #{e.message}",
        message: "Sorry, I received an invalid response. Please try again."
      }
    rescue StandardError => e
      Rails.logger.error "Gemini API Error: #{e.class} - #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      {
        success: false,
        error: "#{e.class}: #{e.message}",
        message: "Sorry, I encountered an error. Please try again."
      }
    end
  end
end
