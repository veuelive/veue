# frozen_string_literal: true

class PageVisit < VideoEvent
  def input_to_payload
    {
      url: input["url"],
    }
  end

  def input_schema
    {
      properties: {
        url: String,
      },
      required: ["url"],
    }
  end
end
