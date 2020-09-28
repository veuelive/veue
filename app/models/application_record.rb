# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include AASM

  self.abstract_class = true
  self.implicit_order_column = :created_at
end
