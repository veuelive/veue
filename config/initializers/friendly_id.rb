# frozen_string_literal: true

RESERVED_WORDS = %w[
  index
  new
  edit
  create
  read
  update
  destroy
  delete
  channel
  channels
].freeze

FriendlyId.defaults do |config|
  config.use(:reserved)
  config.reserved_words = RESERVED_WORDS
end
