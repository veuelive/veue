# frozen_string_literal: true

module ResponsiveHelpers
  def resize_window_to_mobile
    resize_window_by({ width: 640, height: 480 })
  end

  def resize_window_default
    resize_window_by({ width: 1024, height: 768 })
  end

  private

  def resize_window_by(size={})
    Capybara.current_session.driver.browser.manage.window.resize_to(size[:width], size[:height]) if Capybara.current_session.driver.browser.respond_to?('manage')
  end
end
