# frozen_string_literal: true

class VideoCategory < ApplicationRecord
  belongs_to :category
  belongs_to :video
end
