class Stream < ApplicationRecord
  before_create :generate_slug
end
