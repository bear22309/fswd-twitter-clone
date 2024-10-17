module Api
  class TweetsController < ApplicationController
    def index
      @tweets = Tweet.all.order(created_at: :desc)
      render 'api/tweets/index'
    end

    def create
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)

  
      unless session
        return render json: { error: 'Unauthorized - no active session' }, status: :unauthorized
      end

      user = session.user

      
      @tweet = user.tweets.new(tweet_params)

      if @tweet.save
        TweetMailer.notify(@tweet).deliver!
        render 'api/tweets/create', status: :created
      else
        render json: { error: @tweet.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    end

    def destroy
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)

      
      unless session
        return render json: { success: false, error: 'Unauthorized - no active session' }, status: :unauthorized
      end

      user = session.user
      tweet = Tweet.find_by(id: params[:id])

      if tweet && (tweet.user == user) && tweet.destroy
        render json: {
          success: true
        }
      else
        render json: {
          success: false,
          error: 'Tweet could not be deleted'
        }, status: :unprocessable_entity
      end
    end

    def index_by_user
      user = User.find_by(username: params[:username])

      if user
        @tweets = user.tweets
        render 'api/tweets/index'
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end

    private

    def tweet_params
      params.require(:tweet).permit(:message, :image)
    end
  end
end
