# frozen_string_literal: true

module AuthenticationsHelper
  def mask_phone_number(phone_number)
    offset = phone_number.length - 4
    digits_to_show = phone_number.slice(offset, phone_number.length)
    "*" * offset + digits_to_show
  end
end
