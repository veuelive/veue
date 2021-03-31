# frozen_string_literal: true

module BroadcastSystemHelpers
  def navigate_to(url)
    bar = find("input[data-target='broadcast--browser.addressBar']")
    bar.set(url)
    bar.native.send_keys(:return)
    expect(find("*[data-broadcast--browser-url]")["data-broadcast--browser-url"]).to eq(url)
  end

  def update_video_visibility(visibility)
    find("#settings-btn").click
    within(".broadcast-settings__form") do
      find("[value='#{visibility}']").select_option
      click_button("Update")
    end

    expect(page).to have_css("[data-video-visibility='#{visibility}']")
  end

  def wait_for_broadcast_state(state)
    # We do need to wait a second here, as we are making external calls that take a while especially on GH Actions
    expect(page).to have_css("div[data-broadcast-state='#{state}']", wait: 20)
  end

  def click_start_broadcast_button
    click_link("Go Live")
  end

  def click_stop_broadcast_button
    click_on(class: "stop-btn")
  end

  # Finds the <option> tag for the given day. Must be within 14 days of the day
  # @example
  #   find_day_option(5.days.since)
  #   find_day_option(15.days.since) invalid
  #   find_day_option(14.days.since) perfect
  #   find_day_option(1.day.ago) invalid
  #   find_day_option(time.current) perfect
  # @example
  def find_day_option(time)
    year = time.year

    # Months are 0-indexed in javascript (Jan 0) and 1-indexed in Ruby (Jan 0), so lets fix it.
    month = time.month - 1
    day = time.day

    find("#scheduled-day-#{year}-#{month}-#{day}")
  end

  # Find a time option by the given hours / minutes
  #  Valid numbers are hours 0-23 and minute must be in 15 min increments. (0, 15, 30, 45)
  # @example
  #   find_time_option(0, 15)
  #   # will find <option id="time-0:15">00:15</option>
  def find_time_option(hours, minutes)
    find("#scheduled-time-#{hours}-#{minutes}")
  end
end
