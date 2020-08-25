# frozen_string_literal: true

class AddNameAndDescriptionToVideo < ActiveRecord::Migration[6.0]
  def change
    change_table :videos, bulk: true do |t|
      t.string(:name)
      t.text(:description)
    end
  end
end
