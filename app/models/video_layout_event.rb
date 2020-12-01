# frozen_string_literal: true

class VideoLayoutEvent < VideoEvent
  # We should pass through all the data we get!
  def input_to_payload
    input
  end

  def input_schema
    {
      properties: {
        width: Integer,
        height: Integer,
        sections: [
          {
            type: String,
            width: Integer,
            height: Integer,
            x: Integer,
            y: Integer,
            priority: Integer,
          },
        ],
      },
      required: %w[width height sections],
    }
  end
end
