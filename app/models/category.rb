# frozen_string_literal: true

class Category < ApplicationRecord
  validates :title, presence: true

  belongs_to :category, optional: true
  has_many :video_categories
  has_many :videos, through: :video_categories
end
