# frozen_string_literal: true

class Category < ApplicationRecord
  validates :title, presence: true

  has_many :categories, dependent: :destroy
  belongs_to :category, optional: true
  has_many :video_categories, dependent: :destroy
  has_many :videos, through: :video_categories
end
