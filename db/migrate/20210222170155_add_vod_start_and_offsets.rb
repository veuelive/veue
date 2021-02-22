# frozen_string_literal: true

class AddVodStartAndOffsets < ActiveRecord::Migration[6.0]
  def change
    change_table(:videos, bulk: true) do |t|
      t.integer(:start_offset, default: 0)
      t.integer(:end_offset, default: 0)
    end
  end
end
