# frozen_string_literal: true

require "system_helper"

describe "Scheduling" do
  let(:channel) { create(:channel) }

  it "should show a stream happening today" do
    # NOTE: We use `update_columns` because we don't want it recalculating the date
    channel.update_columns(next_show_at: 2.hours.from_now)

    visit(channel_path(channel))

    expect(page).to have_content("Today")
  end

  it "a stream next week on the same day as today will show the day name" do
    day = 7.days.from_now - 1.hour
    channel.update_columns(next_show_at: day)

    visit(channel_path(channel))

    expect(page).to have_content(Date::DAYNAMES[day.wday])
  end
end