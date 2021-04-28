# frozen_string_literal: true

class Host < ApplicationRecord
  belongs_to :user
  belongs_to :channel
end
