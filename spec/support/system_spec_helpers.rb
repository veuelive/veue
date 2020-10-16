# frozen_string_literal: true

module SystemSpecHelpers
  def expect_no_javascript_errors
    logs = page.driver.browser.manage.logs.get(:browser)
    logs.each do |log|
      puts log.inspect
    end
    expect(logs).to be_empty
  end
end
