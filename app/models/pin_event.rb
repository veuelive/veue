# frozen_string_literal: true

class PinEvent < VideoEvent
  has_one :pin, dependent: :delete

  def input_to_payload
    {
      pin_id: pin.id,
    }
  end
end
