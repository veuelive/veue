# frozen_string_literal: true

require "rails_helper"

RSpec.describe SendConfirmationTextJob do
  let(:session_token) { create(:session_token) }

  it "succeeds when new" do
    expect(session_token.state).to eq("new")
    # We have already enqueued this job!
    perform_enqueued_jobs
    assert_performed_jobs 1
    expect(FakeTwilio.messages.size).to eq(1)
    expect(FakeTwilio.messages.first.body).to include(session_token.secret_code)
    expect(FakeTwilio.messages.first.to).to include(session_token.phone_number)
  end

  # This is a reproduction of https://app.clickup.com/t/8444384/VEUE-270
  it "ignores SMS failed attempts" do
    session_token.send_failed!
    perform_enqueued_jobs
    assert_performed_jobs 1
    expect(FakeTwilio.messages.size).to eq(0)
  end

  # Related to the VEUE-270 issue
  it "ignores resending ones that have been guessed wrong too" do
    session_token.wrong_code!
    perform_enqueued_jobs
    assert_performed_jobs 1
    expect(FakeTwilio.messages.size).to eq(0)
  end

  it "should gracefully deal with send-failures" do
    expect(session_token.state).to eq("new")
    assert_enqueued_jobs 1
    FakeTwilio.fail_mode = true
    perform_enqueued_jobs
    assert_performed_jobs 1
    expect(FakeTwilio.messages.size).to eq(0)
    session_token.reload
    expect(session_token.state).to eq("failed")
  end
end
