# frozen_string_literal: true

class UserDecorator < ApplicationDecorator
  delegate_all

  def masked_phone_number
    "#{phone_number.first(2)} (***) ***-#{phone_number.last(4)}"
  end
end
