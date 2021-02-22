# frozen_string_literal: true

class AddVodStartAndOffsets < ActiveRecord::Migration[6.0]
  def change
    add_column(:videos, :start_offset, :integer, default: 0)
    add_column(:videos, :end_offset, :integer, default: 0)
  end
end
