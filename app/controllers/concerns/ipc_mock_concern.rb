# frozen_string_literal: true

module IpcMockConcern
  # This is ACTUALLY a public controller action ONLY in test environment
  def ipc_mock
    events = []
    case params["channel"]
    when "wakeup"
      events << {
        channel: "visible",
        args: [1, 2, 3, "MOCK"],
      }
    else
      Rails.logger.debug("No response for mock")
    end
    render(json: {events: events})
  end
end
