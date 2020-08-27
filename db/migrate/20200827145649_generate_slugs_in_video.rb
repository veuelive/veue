# frozen_string_literal: true

require "nanoid"

class GenerateSlugsInVideo < ActiveRecord::Migration[6.0]
  def change
    Video.all.each do |v|
      loop do
        v.slug = Nanoid.generate(size: 10)
        break unless Video.exists?(slug: v.slug)
      end
      v.save!
    end
  end
end
