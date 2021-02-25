# frozen_string_literal: true

module IpcMockConcern
  # This is ACTUALLY a public controller action ONLY in test environment
  def ipc_mock
    @events = []
    @return = nil
    case params["channel"]
    when "getEnvironment"
      environment_payload
    when "wakeup"
      wakeup_payload
    when "navigate"
      process_navigation_event
    when "start"
      process_start_event
    when "stop"
      process_stop_event
    else
      Rails.logger.debug("No response for mock")
    end
    render(json: {events: @events, returnValue: @return})
  end

  private

  # Data about the Broadcaster's environment that we
  # expect to get from Electron
  def environment_payload
    @return = {
      displays: [test_display],
      primaryDisplay: test_display,
      system: {
        platform: "test",
        arch: "test",
      },
    }
  end

  # The second message sent from the Stimulus Broadcast Controller
  # is the "wakeup" command and we respond with information about our
  # window sizes
  #
  # You can see documentation for the source of this faked payload here:
  # https://www.electronjs.org/docs/api/browser-window#wingetcontentbounds
  #
  def wakeup_payload
    rect = {
      width: 1982,
      height: 1982,
      x: 0,
      y: 0,
    }
    @return = {
      bounds: rect,
      contentBounds: rect,
      normalBounds: rect,
    }
  end

  # This fakes that we've completed any navigation... not enough here to build a full test suite
  def process_navigation_event
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

  def test_display
    {
      size: {
        width: 1982,
        height: 1982,
      },
      workArea: {
        x: 0,
        y: 20,
        width: 1982,
        height: 1962,
      },
      id: 1982,
      scaleFactor: 1,
    }
  end
end
