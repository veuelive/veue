# frozen_string_literal: true

class ModerationItem < ApplicationRecord
  belongs_to :video_event, optional: true
  belongs_to :user, optional: true
  belongs_to :video, optional: true

  aasm column: :state do
    state :open, initial: true

    state :approved

    state :rejected

    event :approve do
      transitions to: :approved
    end

    event :reject do
      transitions to: :rejected
    end
  end

  def fetch_scores!
    start_at = Time.zone.now
    score, full_result = PerspectiveApi.score(text, video_id)
    self.summary_score = score
    self.scores = full_result

    self.processing_time = Time.zone.now - start_at

    if score > PerspectiveApi.threshold
      reject
    else
      approve
    end
  end
end
