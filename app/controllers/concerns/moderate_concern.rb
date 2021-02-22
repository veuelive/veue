# frozen_string_literal: true

module ModerateConcern
  extend ActiveSupport::Concern

  def create_moderation_item(text:, **options)
    moderation_item = ModerationItem.create!(text: text, **options)
    moderation_item.fetch_scores!
    moderation_item
  end
end
