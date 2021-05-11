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
  def self.upcoming_shows(schedule)
    schedule.flat_map do |repeater|
      repeater.symbolize_keys!
      Time.use_zone(repeater[:timezone]) do
        repeater[:days_of_the_week].map do |week_day|
          date = Time.zone.parse(week_day)
          date = date.advance(minutes: repeater[:minute_of_day])
          date = date.advance(weeks: 1) if date.past?
          date
        end
      end
    end
  end
end
