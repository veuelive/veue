# frozen_string_literal: true

module AuthenticationsHelper
  def mask_phone_number(phone_number)
    offset = phone_number.length - 4
    digits_to_show = phone_number.slice(offset, phone_number.length)
    "*" * offset + digits_to_show
  end

  def auth_input_tag
    input_options = {
      class: "auth-input",
      inputmode: "numeric",
      minlength: "4",
      maxlength: "4",
      contenteditable: "true",
      name: "secret_code",
      autocomplete: "one_time_code",
      data: {
        target: "secret-code.authInput",
        action: "input->secret-code#handleInput",
      },
    }

    tag.input(input_options)
  end
end
