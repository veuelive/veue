# frozen_string_literal: true

module PhoneTestHelpers
  def self.generate_valid
    "+1904384#{SecureRandom.rand(1000...9999)}"
  end
end
