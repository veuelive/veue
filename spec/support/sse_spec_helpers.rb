# frozen_string_literal: true

module SseSpecHelpers
  def sse_url_matcher
    Regexp.new(GripBroadcaster.base_url)
  end

  def stub_sse_broadcasts!
    stub_request(:post, sse_url_matcher)
      .to_return(status: 200)
  end

  def expect_to_sse_broadcast(times=1)
    assert_requested(
      :any,
      sse_url_matcher,
      times: times,
    )
  end
end
