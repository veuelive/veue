# frozen_string_literal: true

class FakeTwilio
  cattr_accessor :messages
  self.messages = []

  def messages
    self
  end

  def create(from:, to:, body:)
    self.class.messages << Struct.new(:from, :to, :body).new(from, to, body)

    Struct.new(:status, :error_code).new(status: "success")
  end
end
