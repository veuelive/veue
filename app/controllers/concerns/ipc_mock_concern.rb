# frozen_string_literal: true

module IpcMockConcern
  # This is ACTUALLY a public controller action ONLY in test environment
  def ipc_mock
    @events = []
    case params["channel"]
    when "wakeup"
      process_wakeup_event
    when "navigate"
      process_navigation_event
    when "start"
      process_start_event
    when "stop"
      process_stop_event
    else
      Rails.logger.debug("No response for mock")
    end
    render(json: {events: @events})
  end

  private

  # This fakes that we've completed any navigation... not enough here to build a full test suite
  def process_navigation_event
    @events << {
      channel: "browserView",
      args: [
        {
          eventName: "will-navigate",
          url: params["args"][0],
          canGoBack: true,
          canGoForward: false,
          isLoading: true,
        },
      ],
    }

    @events << {
      channel: "browserView",
      args: [
        {
          eventName: "did-navigate",
          url: params["args"][0],
          canGoBack: true,
          canGoForward: false,
          isLoading: false,
        },
      ],
    }



  end

  def process_wakeup_event
    @events << {
      channel: "visible",
      args: [1, 2, 3, "MOCK"],
    }
  end

  # Normally we know to stop from MUX, but for testing, we know here that we should do our own events
  def process_stop_event
    current_video.finish!
  end

  def process_start_event
    current_video.go_live!
  end

  def current_video
    Video.last
  end
end
