class HelloWorldController < ApplicationController
  skip_before_action :authenticate_request

  def index
    render json: { message: "Hello World" }
  end
end
