# frozen_string_literal: true

#
# API for using Googles "perspective" api.
#
# Documentation here: https://support.perspectiveapi.com/s/about-the-api
#
# Sample JSON results:
#
#   {
#     attributeScores: {
#       TOXICITY: {
#         spanScores: [
#           {
#             begin: 0,
#             end: 15,
#             score: {value: 0.851465, type: "PROBABILITY"}}
#         ],
#         summaryScore:
#           {
#             value: 0.851465, type: "PROBABILITY"
#           }
#       },
#     },
#     detectedLanguages: ["en"],
#     languages: ["en"],
#   }
#

module PerspectiveApi
  extend self

  require "appsignal"

  class Error < StandardError; end

  attr_accessor :key, :enabled, :threshold

  # Returns a score from 0 to -1, and then the full results
  def score(text, stream_id)
    return [-1, {}] unless PerspectiveApi.enabled

    result = make_request(text, stream_id)
    Rails.logger.info("CommentAnalyzer: #{result}")

    return handle_error(result) if result["error"]

    [result["attributeScores"]["TOXICITY"]["summaryScore"]["value"], result]
  end

  private

  def build_payload(text, stream_id)
    {
      comment: {
        text: text,
      },
      requestedAttributes: {
        TOXICITY: {},
      },
      sessionId: stream_id,
    }
  end

  def make_request(text, stream_id)
    url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=" + PerspectiveApi.key
    response = Faraday.post url,
                            build_payload(text, stream_id).to_json,
                            "Content-Type": "application/json"

    JSON.parse(response.body)
  end

  def handle_error(result_with_error)
    Rails.logger.error(result_with_error)
    Appsignal.set_error(Error.new(result_with_error["error"]["message"]))
    [-1, {}]
  end
end
