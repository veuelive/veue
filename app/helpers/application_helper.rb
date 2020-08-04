# frozen_string_literal: true

module ApplicationHelper
  def body_attributes
    {id: "#{controller.controller_name}__#{controller.action_name}"}
  end
end
