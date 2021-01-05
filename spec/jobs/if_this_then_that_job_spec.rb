# frozen_string_literal: true

require "rails_helper"

RSpec.describe IfThisThenThatJob, type: :job do
  let(:video) { create(:video) }

  it "should run without error" do
    message = "shazam!"
    url = "https://google.com"

    IfThisThenThatJob.perform_later(message: message, url: url)

    expect(IfThisThenThatJob).to have_been_enqueued.with(
      message: message,
      url: url,
    )

    perform_enqueued_jobs(only: IfThisThenThatJob)

    expect(WebMock).to have_requested(:post, IfThisThenThatJob.post_url)
      .with(body: {value1: message, value2: url})
      .once
  end

  it "should build a payload" do
    url = "hello.com"
    result = IfThisThenThatJob.process!(message: "whoops", url: url)
    expect(result[0]).to include(IfThisThenThatJob.post_url)

    payload_hash = result[1].inspect
    expect(payload_hash).to include(url)
  end
end
