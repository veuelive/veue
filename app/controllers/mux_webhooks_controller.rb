# frozen_string_literal: true

class MuxWebhooksController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    MuxWebhook.handle_webhook(request.body.read)
    render(json: {status: 200})
  end
end
