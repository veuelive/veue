# frozen_string_literal: true

module AuthenticationsHelper
  def mask_phone_number(phone_number)
    offset = phone_number.length - 4
    digits_to_show = phone_number.slice(offset, phone_number.length)
    "*" * offset + digits_to_show
  end

  def auth_input_tag(index, one_time_code: false)
    input_options = {
      class: "auth-input",
      inputmode: "numeric",
      minlength: "1",
      maxlength: "1",
      contenteditable: "true",
      name: "secret_code_#{index}",
      data: {
        target: "secret-code.authInput",
        action: "input->secret-code#handleInput
                 keydown->secret-code#handleKeyboardNav
                 paste->secret-code#handlePaste",
      },
    }

    input_options.merge!({autocomplete: "one_time_code"}) if one_time_code == true

    tag.input(input_options)
  end
end
