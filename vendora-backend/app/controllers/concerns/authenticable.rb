module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  private

  def authenticate_request
    token = extract_token_from_header
    return render_unauthorized unless token

    decoded_token = decode_token(token)
    return render_unauthorized unless decoded_token

    @current_user = User.find_by(id: decoded_token['user_id'])
    return render_unauthorized unless @current_user

    # Check if token is blacklisted
    return render_unauthorized if JwtBlacklist.blacklisted?(decoded_token['jti'])
  rescue JWT::DecodeError, JWT::ExpiredSignature
    render_unauthorized
  end

  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    auth_header.split(' ').last if auth_header.start_with?('Bearer ')
  end

  def decode_token(token)
    JWT.decode(token, User.jwt_secret, true, { algorithm: 'HS256' })[0]
  end

  def render_unauthorized
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  attr_reader :current_user
end

