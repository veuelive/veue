# frozen_string_literal: true

class VideoLayoutEvent < VideoEvent
  def input_to_payload
    {
      width: input["width"],
      height: input["height"],
      sections: input["sections"],
    }
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
