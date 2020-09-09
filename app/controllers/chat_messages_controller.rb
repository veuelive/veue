# frozen_string_literal: true

class ChatMessagesController < ApplicationController
  before_action :set_video
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
          locals: {video: @video},
          content_type: "html",
        )
      }
    end
  end

  private

  def build_chat_message
    current_user.chat_messages.new(
      body: params[:body],
      video: @video,
    )
  end

  def set_video
    @video = Video.find_by(slug: params[:video_id])
  end
end
