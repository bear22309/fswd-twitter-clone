module Api
  class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    def create
      @user = User.new(user_params)

      if @user.save
        render 'api/users/create'
      else
        render json: {
          success: false
        }
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
