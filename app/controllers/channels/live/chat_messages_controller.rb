# frozen_string_literal: true

module Channels
  module Live
    class ChatMessagesController < ApplicationController
      include ModerateConcern
      include ChannelConcern

      before_action :authenticate_user!, only: [:create]

      def create
        moderation_item = create_moderation_item(
          text: params[:message],
          user: current_user,
          video: current_video,
        )

        message = build_chat_message(published: moderation_item.approved?)

        if message.save
          # Has to be updated *after* the message is saved.
          moderation_item.update!(video_event: message)
          render(json: {success: true, message: message.to_hash})
        else
          render(json: {success: false, error_messages: message.errors.full_messages})
        end
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

      def build_chat_message(published:)
        ChatMessage.new(
          user: current_user,
          input: {message: params[:message]},
          video: current_video,
          published: published,
        )
      end
    end
  end
end
