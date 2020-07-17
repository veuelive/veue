class MuxWebhooksController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    MuxWebhook.build_from_json(request.body.read)
    render json: {status: 200}
  end
end
