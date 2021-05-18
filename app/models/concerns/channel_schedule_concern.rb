# frozen_string_literal: true

module ChannelScheduleConcern
  extend ActiveSupport::Concern

  included do
    before_save :update_next_show
  end

  def update_next_show
    self.next_show_at = calculate_next_show
  end

  def calculate_next_show
    Schedulatron.upcoming_shows(schedule)[0]
  end

  def schedule_type
    schedule&.dig("type") || "none"
  end

  def schedule_type=(type)
    return unless Schedulatron.types.include?(type)

    schedule["type"] = type
  end

  def schedule_day
    schedule&.dig("day_of_week")
  end

  def schedule_day=(day)
    # Later make this multiple options
    schedule["days_of_the_week"] = [day]
  end

  # We just store the minutes instead of hour and minutes separately
  def schedule_minutes
    schedule&.dig("minute_of_day")
  end

  def schedule_minutes=(minutes)
    schedule["minute_of_day"] = Integer(minutes, 10)
  end

  def schedule_timezone
    schedule&.dig("timezone")
  end

  def schedule_timezone=(timezone)
    schedule["timezone"] = timezone
  end
end
