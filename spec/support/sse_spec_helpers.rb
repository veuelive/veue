# frozen_string_literal: true

module SseSpecHelpers
  def sse_url_matcher
    Regexp.new(GripBroadcaster.base_url)
  end

  def ensure_live_event_source
    expect(page).to have_selector("body[data-live-event-source]")
  end

  def expect_to_sse_broadcast(times=1)
    assert_requested(
      :any,
      sse_url_matcher,
      times: times,
    )
  end
end
