# frozen_string_literal: true

module StimulusHelper
  def stimulus_attributes(stimulus_controller_name, data_attributes)
    attributes = {}
    data_attributes.each do |name, value|
      attributes["data-#{stimulus_controller_name}-#{name}"] = value.to_s
    end

    attributes.merge(
      "data-controller": stimulus_controller_name,
    )
  end

  def page_stim_controller
    "pages--#{controller.controller_name}-#{controller.action_name}"
  end

  def page_stimulus_target(_name, _value)
    {}
  end
end
