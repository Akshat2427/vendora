class AuthenticationController < ApplicationController
  skip_before_action :authenticate_request, only: [:signup, :login]

  def signup
    user = User.new(user_params)
    user.password = params[:password]
    user.status = :active

    if user.save
      token = user.generate_jwt
      render json: {
        message: 'User created successfully',
        user: user.as_json(except: [:password_digest]),
        token: token
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = user.generate_jwt
      render json: {
        message: 'Login successful',
        user: user.as_json(except: [:password_digest]),
        token: token
      }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def logout
    token = extract_token_from_header
    if token
      begin
        decoded_token = decode_token(token)
        expires_at = Time.at(decoded_token['exp'])
        JwtBlacklist.add_to_blacklist(decoded_token['jti'], expires_at)
        render json: { message: 'Logged out successfully' }, status: :ok
      rescue JWT::DecodeError, JWT::ExpiredSignature
        render json: { message: 'Logged out successfully' }, status: :ok
      end
    else
      render json: { message: 'Logged out successfully' }, status: :ok
    end
  end

  def me
    if @current_user
      render json: {
        user: @current_user.as_json(except: [:password_digest])
      }, status: :ok
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.permit(:name, :email, :phone, :prefix, :address, :username, :role)
  end

  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    auth_header.split(' ').last if auth_header.start_with?('Bearer ')
  end

  def decode_token(token)
    JWT.decode(token, User.jwt_secret, true, { algorithm: 'HS256' })[0]
  end
end

