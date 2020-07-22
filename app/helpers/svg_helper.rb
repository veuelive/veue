# frozen_string_literal: true

module SvgHelper
  def render_svg(name)
    file_path = "#{Rails.root}/public/assets/#{name}"
    if File.exist?(file_path)
      File.read(file_path).html_safe
    else
      logger.error("Unable to find SVG #{name} at #{file_path}")
    end
  end
end