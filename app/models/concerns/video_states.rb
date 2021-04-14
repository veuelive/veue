# frozen_string_literal: true

module VideoStates
  extend ActiveSupport::Concern

  included do
    aasm column: "state" do
      state :pending, initial: true

      # The stream is scheduled to take place some point in the future
      state :scheduled

      # The streamer has started, but MUX isn't yet fully live via RTMP. Their clock has started though
      # LEGACY for old Mux streams
      state :starting

      # The video is live! Things are happening!
      # Despite the name, normally this comes from a "recording" event coming from Mux
      state :live

      # The stream is ending but playback Id is not changed yet!
      state :ended

      # The stream is over, but we might not be ready to do replay yet
      state :finished

      # The stream was going to happen, but we cancelled it
      state :cancelled

      event :start do
        before do
          self.started_at_ms = Time.now.utc.to_ms
        end

        after do
          after_go_live
        end

        transitions from: %i[pending scheduled], to: :live
        transitions from: :live, to: :live
      end

      event :schedule do
        transitions from: %i[pending scheduled], to: :scheduled
      end

      event :cancel do
        transitions from: :scheduled, to: :pending
        transitions from: :pending, to: :cancelled
      end

      event :end do
        after do
          after_end
        end

        transitions from: %i[live starting ended], to: :ended
      end

      event :finish do
        transitions from: %i[live paused pending ended starting finished], to: :finished
      end
    end
  end
end
