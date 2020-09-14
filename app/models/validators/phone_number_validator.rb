# frozen_string_literal: true

class PhoneNumberValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record[attribute] = Phoner::Phone.parse(value).to_s
  rescue Phoner::PhoneError
    record.errors.add(attribute, "Must be a valid phone number")
  end
end
