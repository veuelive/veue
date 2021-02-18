module ModerateConcern
  extend ActiveSupport::Concern

  def create_moderation_item(text:, **options)
    return unless PerspectiveApi.enabled

    moderation_item = ModerationItem.create!(text: text, **options)
    moderation_item.fetch_scores!
    moderation_item
  end
end
