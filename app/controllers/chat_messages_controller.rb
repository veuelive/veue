# frozen_string_literal: true

class ChatMessagesController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  before_action :current_video

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
      timecode_ms: 0,
      # ^^^ This needs to get replaced!
    )
  end

  def current_video
    @current_video ||= Video.find(params[:video_id])
  end
  helper_method :current_video
end
