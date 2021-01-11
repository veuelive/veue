# frozen_string_literal: true

module ResponsiveHelpers
  def resize_window_to_mobile
    resize_window_by({width: 640, height: 480})
  end

  def resize_window_desktop
    resize_window_by({width: 1280, height: 768})
  end

  private

  def resize_window_by(size={})
    return unless Capybara.current_session.driver.browser.respond_to?("manage")

    Capybara.current_session.driver.browser.manage.window.resize_to(size[:width], size[:height])
  end
end
