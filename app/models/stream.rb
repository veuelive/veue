require 'nanoid'

class Stream < ApplicationRecord
  before_create :generate_slug
  belongs_to :user
  has_many :mux_webhooks

  private

  def randomize_slug
    begin
      self.slug = Nanoid.generate
    end while Stream.where(id: slug).exists?
  end
end