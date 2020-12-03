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

  def self.create_first_navigation!(video, url)
    video.browser_navigations.create!(
      timecode_ms: 0,
      user_id: video.user_id,
      input: {
        url: url,
        canGoBack: false,
        canGoForward: false,
        isLoading: false,
      },
      )
  end
end
