# frozen_string_literal: true

class IfThisThenThatJob < ApplicationJob
  queue_as :default

  IFTTT_URL = "https://maker.ifttt.com/trigger/site_event/with/key"
  public_constant(:IFTTT_URL)

  def perform(message:, url: nil)
    return if ENV["IFTTT_PUSH_KEY"].blank?

    IfThisThenThatJob.process!(message: message, url: url)
  end

  def self.process!(message:, url:)
    post_url = "#{IFTTT_URL}/#{ENV['IFTTT_PUSH_KEY']}"
    payload = {
      value1: message,
      value2: url,
    }
    Faraday.post(post_url, payload.to_json, "Content-Type": "application/json") unless Rails.env.test?
    [post_url, payload]
  end
end
