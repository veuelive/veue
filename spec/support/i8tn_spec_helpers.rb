# frozen_string_literal: true

module I8tnSpecHelpers
  def do_not_translate
    allow(I18n).to(receive(:t)) { |*args|
      args[0]
    }
  end
end