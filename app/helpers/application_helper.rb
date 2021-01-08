# frozen_string_literal: true

module ApplicationHelper
  def body_attributes
    {id: "#{controller.controller_name}__#{controller.action_name}"}
  end

  def svg_tag(filename, options={})
    inline_svg_pack_tag("media/images/#{filename}.svg", options)
  end

  # Formats into 1.4K, 2.4M, etc
  # @param {Number} number - The number to format
  # @return {String} - A formatted number as a string, IE: 1.4K
  # @example
  #   number_to_social(10512) # => 10.5K
  def number_to_social(number)
    number_to_human(
      number,
      format: "%n%u",
      units: {thousand: "K", million: "M", billion: "B"},
    )
  end
end
