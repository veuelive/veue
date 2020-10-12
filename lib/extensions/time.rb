# frozen_string_literal: true

class Time
  def to_ms
    (to_r * 1000).round
  end
end
