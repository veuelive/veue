# frozen_string_literal: true

#
#
# Schedule objects are like the following
#
#
# schedule = [{
#   days_of_the_week: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
#   timezone: "America/New_York",
#   minute_of_day: 930   #3:30pm,
# }]
#

module Schedulatron
  def self.types
    %w[none weekly]
  end

  def self.upcoming_shows(schedule)
    schedule.symbolize_keys!
    return [] unless schedule[:type] == "weekly"
    return [] unless schedule[:timezone]
    return [] unless schedule[:days_of_the_week]
    return [] unless schedule[:minute_of_day]

    Time.use_zone(schedule[:timezone]) do
      schedule[:days_of_the_week].map do |week_day|
        date = Date.parse(week_day).in_time_zone(schedule[:timezone])
        date = date.advance(minutes: schedule[:minute_of_day])
        date = date.advance(weeks: 1) if date.past?
        date
      end
    end
  end
end
