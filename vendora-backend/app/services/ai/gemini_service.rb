require "net/http"
require "json"
require "uri"
require "timeout"

module Ai
  class GeminiService
    API_KEY = ENV['GEMINI_API_KEY'] || Rails.application.credentials.dig(:gemini, :api_key)
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

    def self.api_key
      if API_KEY.blank?
        Rails.logger.error "GEMINI_API_KEY environment variable or credentials not set"
        raise "GEMINI_API_KEY environment variable or credentials not set. Please set it in .env file or Rails credentials."
      end
      API_KEY
    end

    def self.chat(message, conversation_history = [])
      api_key = self.api_key
      uri = URI("#{BASE_URL}?key=#{api_key}")

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
    rescue Timeout::Error, Net::ReadTimeout => e
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

    def self.suggest_price(product_name)
      api_key = self.api_key
      uri = URI("#{BASE_URL}?key=#{api_key}")

      prompt = "Based on current market prices, suggest a price range for the following product: #{product_name}. 
      Please provide:
      1. Minimum price (lowest reasonable price)
      2. Maximum price (highest reasonable price)
      3. Average price (typical market price)
      4. Suggested starting price for auction (80% of minimum)
      5. Suggested reserve price (90% of average)
      
      Respond in JSON format with this structure:
      {
        \"min\": number,
        \"max\": number,
        \"average\": number,
        \"suggested_starting\": number,
        \"suggested_reserve\": number,
        \"message\": \"brief explanation\"
      }"

      contents = [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]

      request_body = {
        contents: contents
      }

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.read_timeout = 30
      http.open_timeout = 10

      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request.body = request_body.to_json

      Rails.logger.info "Gemini Price Suggestion Request for: #{product_name}"

      start_time = Time.current
      response = http.request(request)
      elapsed_time = Time.current - start_time

      Rails.logger.info "Gemini Price Suggestion Response: #{response.code} (#{elapsed_time.round(2)}s)"

      if response.code == "200"
        data = JSON.parse(response.body)
        text = data.dig("candidates", 0, "content", "parts", 0, "text")

        if text.blank?
          return {
            success: false,
            error: "Empty response from AI",
            price_range: default_price_range
          }
        end

        # Try to extract JSON from the response
        json_match = text.match(/\{[\s\S]*\}/)
        if json_match
          price_data = JSON.parse(json_match[0])
          {
            success: true,
            price_range: {
              min: price_data["min"] || 100,
              max: price_data["max"] || 1000,
              average: price_data["average"] || 500,
              suggested_starting: price_data["suggested_starting"] || 100,
              suggested_reserve: price_data["suggested_reserve"] || 450
            },
            message: price_data["message"] || "AI-suggested price based on market research"
          }
        else
          # If no JSON found, try to extract numbers from text
          numbers = text.scan(/\d+/).map(&:to_i).reject { |n| n == 0 }
          if numbers.length >= 3
            {
              success: true,
              price_range: {
                min: numbers.min,
                max: numbers.max,
                average: (numbers.sum.to_f / numbers.length).round(2),
                suggested_starting: (numbers.min * 0.8).round(2),
                suggested_reserve: ((numbers.sum.to_f / numbers.length) * 0.9).round(2)
              },
              message: "AI-suggested price based on market research"
            }
          else
            {
              success: false,
              error: "Could not parse price data",
              price_range: default_price_range
            }
          end
        end
      else
        Rails.logger.error "Gemini Price Suggestion Error: #{response.code} - #{response.body}"
        {
          success: false,
          error: "API Error: #{response.code}",
          price_range: default_price_range
        }
      end
    rescue StandardError => e
      Rails.logger.error "Gemini Price Suggestion Error: #{e.class} - #{e.message}"
      {
        success: false,
        error: e.message,
        price_range: default_price_range
      }
    end

    def self.default_price_range
      {
        min: 100,
        max: 1000,
        average: 500,
        suggested_starting: 100,
        suggested_reserve: 450
      }
    end
  end
end
