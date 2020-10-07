# frozen_string_literal: true

class BrowserNavigation < VideoEvent
  def input_to_payload
    {
      url: input["url"],
      canGoBack: input["canGoBack"],
      canGoForward: input["canGoForward"],
      isLoading: input["isLoading"],
    }
  end

  def input_schema
    {
      properties: {
        url: String,
        canGoBack: :boolean,
        canGoForward: :boolean,
        isLoading: :boolean,
      },
      required: ["url"],
    }
  end
end
