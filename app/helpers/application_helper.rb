# frozen_string_literal: true

module ApplicationHelper
  def body_attributes
    {id: "#{controller.controller_name}__#{controller.action_name}"}
  end

  def svg_tag(filename, svg_class: nil)
    inline_svg_pack_tag("media/images/#{filename}.svg", class: svg_class)
  end
end
