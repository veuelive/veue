# frozen_string_literal: true

class VideoViewMinute < ApplicationRecord
  belongs_to :video_view, counter_cache: true
end
