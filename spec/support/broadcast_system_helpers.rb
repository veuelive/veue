# frozen_string_literal: true

module BroadcastSystemHelpers

  def navigate_to(url)
    bar = find("input[data-target='broadcast--browser.addressBar']")
    bar.set(url)
    bar.native.send_keys(:return)
    expect(find("*[data-broadcast--browser-url]")["data-broadcast--browser-url"]).to eq(url)
  end

  def shift_to_broadcast_view
    expect(page).to have_css("#startup")
    click_on("Open Broadcaster")
    switch_to_broadcast
  end

  def switch_to_broadcast
    broadcast_view = page.driver.browser.window_handles.last
    page.driver.browser.switch_to.window(broadcast_view)
  end

  def update_video_visibility(visibility)
    find("[value='#{visibility}']").select_option

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

  def active_capture_sources
    evaluate_script("globalThis.captureSources")
  end

  def expect_video_capture_source_count(count, *types)
    types = %w[camera screen] if types.empty?
    sources =
      active_capture_sources.select do |_device_id, capture_source|
        types.include?(capture_source.dig("layout", "type"))
      end
    expect(sources.count).to eq(count)
  end
end
