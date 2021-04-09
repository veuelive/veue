# frozen_string_literal: true

module Internal
  class WebhooksController < ApplicationController
    protect_from_forgery with: :null_session
    skip_before_action :http_authenticate

    # This is where we receive "notifications" from the Phenix service
    #
    # Sample starting payload:
    #
    #       {
    #         apiVersion: 0,
    #         entity: "stream",
    #         what: "started",
    #         data: {
    #           streamId: "us-northeast#US-ASHBURN-AD-1.wTa8U91C.20210408.PS39wE1G",
    #           tags: [
    #             "channelId:northamerica-northeast#veue.tv#65998Ca15D7F43D7Ab.ky7cgenoYF1z",
    #             "channelAlias:65998ca1-5d7f-43d7-ab",
    #             "videoId:d90d7ed4-3e20-4a99-9eb2-523bb09bc9b3",
    #           ],
    #         },
    #         sessionId: "us-northeast#3k6FqA67A5a0zphbcOHmNH",
    #         timestamp: "2021-04-08T19:46:39.877Z",
    #       }
    #
    def phenix
      Phenix::Webhooks.process(JSON.parse(request.body.read))
    end
  end
end
