# frozen_string_literal: true

module SseSpecHelpers
  # # This is a useful mock for non-system tests that should just accept any inputs and move on
  # def setup_sse_mocks!
  #   stub_request(:post, sse_url_matcher)
  #     .to_return({
  #                  body: "Published",
  #                  status: 200,
  #                })
  # end
  #
  # def setup_sse_system_mock!
  #     allow(GripBroadcaster).to receive(:send_message) { |_channel, _id, payload|
  #       puts "Faking SSE Message!"
  #       line = "(function() { globalThis.sendLiveEvent(#{payload.to_json})} )();"
  #       execute_script("console.log('hi');")
  #       true
  #     }
  # end

  def sse_url_matcher
    Regexp.new(GripBroadcaster.base_url)
  end

  def expect_to_sse_broadcast(times=1)
    assert_requested(
      :any,
      sse_url_matcher,
      times: times,
    )
  end
end
