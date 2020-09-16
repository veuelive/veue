# frozen_string_literal: true

module ApplicationHelper
  def body_attributes
    {id: "#{controller.controller_name}__#{controller.action_name}"}
  end

  def svg_tag(filename, options={})
    inline_svg_pack_tag("media/images/#{filename}.svg", options)
  end
end
