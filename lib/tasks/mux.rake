# frozen_string_literal: true

namespace :mux do
  task destroy_environment: :environment do
    MUX_SERVICE
  end
end
