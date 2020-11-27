# frozen_string_literal: true

class FakeTwilio
  TEST_ERROR = Twilio::REST::RestError.new(
    "Test Error",
    Twilio::Response.new(1982, ""),
  )
  public_constant :TEST_ERROR
  cattr_accessor :messages
  cattr_accessor :fail_mode
  self.messages = []
  self.fail_mode = false

  def messages
    self
  end

  def create(from:, to:, body:)
    raise(TEST_ERROR) if is_in_fail_mode?

    self.class.messages << Struct.new(:from, :to, :body).new(from, to, body)

    Struct.new(:status, :error_code).new(status: "success")
  end

  def is_in_fail_mode?
    FakeTwilio.fail_mode
  end

  def self.reset!
    self.messages = []
    self.fail_mode = false
  end
end
