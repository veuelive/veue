# frozen_string_literal: true

module Channels
  module Live
    class ChatMessagesController < ApplicationController
      include ChannelConcern
      before_action :authenticate_user!, only: [:create]

      def create
        message = build_chat_message

        unless message.save
          render(json: {success: false, error_messages: message.errors.full_messages})
          return
        end

        render(json: {success: true})
      end

      def index
        respond_to do |format|
          format.js {
            render(
              partial: "shared/chat",
              content_type: "html",
            )
          }
        end
      end

      private

      def build_chat_message
        ChatMessage.new(
          user: current_user,
          input: {message: params[:message]},
          video: current_video,
        )
      end
    end
  end
end
