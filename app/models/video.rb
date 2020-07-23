# frozen_string_literal: true

class Video < ApplicationRecord
  belongs_to :user

  belongs_to :mux_live_stream
  has_many :mux_assets, dependent: :destroy

  aasm column: "state" do
    # We aren't totally live yet, but it'sa coming!
    state :waiting, initial: true

    # The video is live! Things are happening!
    # Despite the name, normally this comes from a "recording" event coming from Mux
    state :live

    # The stream isn't officially over yet, but we're not longer getting a live feed for whatever reason
    state :paused

    # The stream is over, but we might not be ready to do replay yet
    state :finished

    event :go_live do
      transitions from: :waiting, to: :live
      transitions from: :paused, to: :live
    end

    event :pause do
      transitions from: :live, to: :paused
    end

    event :finish do
      transitions from: %i[live paused], to: :finished
    end
  end
end
