# frozen_string_literal: true

class AddUniquenessIndexToVideo < ActiveRecord::Migration[6.0]
  def change
    add_index(:videos, :slug, unique: true)
  end
end
