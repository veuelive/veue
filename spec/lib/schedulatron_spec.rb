# frozen_string_literal: true

require "rails_helper"

describe "Schedulatron" do
  before do
    Timecop.freeze("Sept 2, 1982 16:00:00 Z")
  end

  after do
    Timecop.return_to_baseline
  end

  it "should give no dates when there are no repeaters!" do
    expect(Schedulatron.upcoming_shows([])).to eq([])
  end

  describe "UTC times" do
    describe "one weekly show" do
    it "should work in utc with one weekly show scheduled during this week" do
      shows = Schedulatron.upcoming_shows([{days_of_the_week: ["Sunday"], timezone: "UTC", minute_of_day: 930}])
      expect(shows.count).to eq(1)
      puts shows[0]
      expect(shows[0]).to eq(Time.zone.parse("1982-09-02 15:30:00 Z"))
    end
    end
  end
end
