# frozen_string_literal: true

class AddNameDescriptionToVideos < ActiveRecord::Migration[6.0]
  def change
    change_table :videos, bulk: true do |t|
      t.string(:name)
      t.string(:description)
    end
  end
end
