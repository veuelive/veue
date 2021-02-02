# frozen_string_literal: true

USER_JOIN_RATE_LIMIT_SECONDS = Integer(ENV.fetch("USER_JOIN_RATE_LIMIT_SECONDS", "5"), 10)
