# frozen_string_literal: true

require "rails_helper"

describe "Schedulatron" do
  before do
    Timecop.freeze("Thursday Sept 2, 1982 16:00:00 Z")
  end

  after do
    Timecop.return_to_baseline
  end

  it "should give no dates when there are no repeaters!" do
    expect(Schedulatron.upcoming_shows({})).to eq([])
  end

  describe "weekly" do
    describe "UTC times" do
      describe "one weekly show" do
        it "should work in utc with one weekly show scheduled during this week" do
          shows = Schedulatron.upcoming_shows(
            {
              days_of_the_week: ["Sunday"],
              type: "weekly",
              timezone: "UTC",
              minute_of_day: 930,
            },
          )
          expect(shows.count).to eq(1)
          expect(shows[0]).to eq(Time.zone.parse("1982-09-05 15:30:00 Z"))
          expect(shows[0].strftime("%a")).to eq("Sun")
        end

        it "should roll to the next week if the day is in the past this week" do
          # We're on a Thursday, so this Tuesday shouldn't be THIS monday, but the following one
          # This is important by the way we calculate, since Date.parse will initially pick 2 days previous Tuesday
          shows = Schedulatron.upcoming_shows(
            {
              days_of_the_week: ["Tuesday"],
              type: "weekly",
              timezone: "UTC",
              minute_of_day: 930,
            },
          )
          expect(shows.count).to eq(1)
          expect(shows[0]).to eq(Time.zone.parse("1982-09-07 15:30:00 Z"))
          expect(shows[0].strftime("%a")).to eq("Tue")
        end

        it "should go to next week after the time" do
          # Given that we JUST hit the scheduled time, we should roll to next week's entry!
          # This show is Thursdays at 3pm and it's 4:00pm
          shows = Schedulatron.upcoming_shows(
            {
              days_of_the_week: ["Thursday"],
              type: "weekly",
              timezone: "UTC",
              minute_of_day: 900,
            },
          )
          expect(shows.count).to eq(1)
          expect(shows[0]).to eq(Time.zone.parse("1982-09-09 15:00:00 Z"))
          expect(shows[0].strftime("%a")).to eq("Thu")
        end
      end

      describe "two shows a week" do
        it "should schedule both shows, one in this week, and one rolling into the next" do
          shows = Schedulatron.upcoming_shows(
            {
              days_of_the_week: %w[Sunday Wednesday],
              type: "weekly",
              timezone: "UTC",
              minute_of_day: 930,
            },
          )
          expect(shows.count).to eq(2)

          # The next show is on Sunday
          expect(shows[0]).to eq(Time.zone.parse("1982-09-05 15:30:00 Z"))
          expect(shows[0].strftime("%a")).to eq("Sun")

          # Then we go to the Wednesday show
          expect(shows[1]).to eq(Time.zone.parse("1982-09-08 15:30:00 Z"))
          expect(shows[1].strftime("%a")).to eq("Wed")
        end
      end
    end
  end
end
