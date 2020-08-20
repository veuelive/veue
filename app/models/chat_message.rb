# frozen_string_literal: true

class ChatMessage < ApplicationRecord
  belongs_to :user
  belongs_to :video

  validates :body, presence: true
end
