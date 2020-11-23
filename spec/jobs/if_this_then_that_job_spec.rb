# frozen_string_literal: true

require "rails_helper"

RSpec.describe IfThisThenThatJob, type: :job do
  include ActiveJob::TestHelper

  let(:video) { create(:video) }

  it "should run without error" do
    IfThisThenThatJob.perform_later(message: "shazam!", url: "https://google.com")
    perform_enqueued_jobs
  end

  it "should build a payload" do
    url = "hello.com"
    result = IfThisThenThatJob.process!(message: "whoops", url: url)
    expect(result[0]).to include("key")
    expect(result[1].inspect).to include(url)
  end
end
