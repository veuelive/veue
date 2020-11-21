# frozen_string_literal: true

module BroadcastSystemHelpers
  def navigate_to(url)
    bar = find("input[data-target='broadcast--browser.addressBar']")
    bar.set(url)
    bar.native.send_keys(:return)
    expect(find("*[data-broadcast--browser-url]")["data-broadcast--browser-url"]).to eq(url)
  end
end
