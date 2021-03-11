# frozen_string_literal: true

class VideoSnapshot < ApplicationRecord
  belongs_to :video

  has_one_attached :image
end
