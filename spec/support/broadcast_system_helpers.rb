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
    expect(page).to have_css("div[data-broadcast-state='#{state}']")
  end

  def click_start_broadcast_button
    click_link("Go Live")
  end

  def click_stop_broadcast_button
    click_on(class: "stop-btn")
  end
end
