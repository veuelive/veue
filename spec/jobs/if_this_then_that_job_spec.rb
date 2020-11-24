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
  end

  it "should build a payload" do
    url = "hello.com"
    result = IfThisThenThatJob.process!(message: "whoops", url: url)
    expect(result[0]).to include(IfThisThenThatJob::IFTTT_URL)

    payload_hash = result[1].inspect
    expect(payload_hash).to include(url)
  end
end
