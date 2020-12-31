# frozen_string_literal: true

class VideoLayoutEvent < VideoEvent
  def input_to_payload
    {
      width: input["width"],
      height: input["height"],
      sections: input["sections"],
      timecode: input["timecode"],
    }
  end

  def input_schema
    {
      properties: {
        width: Integer,
        height: Integer,
        sections: [section_schema],
        timecode: timecode_schema,
      },
      required: %w[width height sections timecode],
    }
  end

  private

  def timecode_schema
    {
      digits: Integer,
      width: Integer,
      height: Integer,
      x: Integer,
      y: Integer,
    }
  end

  def section_schema
    {
      type: String,
      width: Integer,
      height: Integer,
      x: Integer,
      y: Integer,
      priority: Integer,
    }
  end
end
