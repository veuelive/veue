# frozen_string_literal: true

class VideoSnapshotDecorator < ApplicationDecorator
  delegate_all

  def secondary_button_text(video)
    return "Remove Secondary" if secondary_shot?(video)

    "Set Secondary"
  end

  def secondary_button_class(video)
    return "btn--danger" if secondary_shot?(video)

    "btn--secondary"
  end
end
