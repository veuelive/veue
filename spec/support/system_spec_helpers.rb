# frozen_string_literal: true

module SystemSpecHelpers
  def expect_no_javascript_errors
    logs = page.driver.browser.manage.logs.get(:browser)
    logs.each do |log|
      puts log.inspect
    end
    # For some reason, on random runs the video source won't start in Chromium, so this
    # filters out those errors... it's not our fault!
    logs.filter! do |log|
      !log.message.ends_with?("Uncaught DOMException: Could not start video source")
    end
    expect(logs).to be_empty
  end

  def find_test_id(str, **options)
    find("[data-test-id='#{str}']", **options)
  end
end
