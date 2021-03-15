# frozen_string_literal: true

# PER MINUTE
USER_JOIN_RATE_LIMIT = Integer(ENV.fetch("USER_JOIN_RATE_LIMIT", "60"), 10)
