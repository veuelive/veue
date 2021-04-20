# frozen_string_literal: true

module SystemSpecHelpers
  def expect_no_javascript_errors
    logs = page.driver.browser.manage.logs.get(:browser)

    # For some reason, on random runs the video source won't start in Chromium, so this
    # filters out those errors... it's not our fault!
    logs.filter! do |log|
      !log.message.match?(/Uncaught DOMException: Could not start (video|audio) source/)
    end
    expect(logs).to be_empty
  end

  def find_test_id(str, **options)
    find("[data-test-id='#{str}']", **options)
  end

  def grant_clipboard_permissions
    page.driver.browser.execute_cdp(
      "Browser.setPermission",
      origin: page.server_url,
      permission: { name: "clipboard-read" },
      setting: "granted",
    )

    page.driver.browser.execute_cdp(
      "Browser.setPermission",
      origin: page.server_url,
      permission: { name: "clipboard-write" },
      setting: "granted",
    )
  end

  def revoke_clipboard_permissions
    page.driver.browser.execute_cdp(
      "Browser.setPermission",
      origin: page.server_url,
      permission: { name: "clipboard-read" },
      setting: "denied",
    )

    page.driver.browser.execute_cdp(
      "Browser.setPermission",
      origin: page.server_url,
      permission: { name: "clipboard-write" },
      setting: "denied",
    )
  end

  def read_clipboard_text
    page.evaluate_async_script("navigator.clipboard.readText().then(arguments[0])")
  end

  def channel_share_link(channel)
    server = Capybara.current_session.server
    channel_url(channel, host: server.host, port: server.port)
  end

  def private_channel_share_link(channel)
    server = Capybara.current_session.server
    channel_video_url(channel, channel.active_video, host: server.host, port: server.port)
  end
end
