# frozen_string_literal: true

require "rails_helper"

describe Category, type: :model do
  describe "creating a new category" do
    it "shouldn't create category without title" do
      category = Category.new(title: nil)
      expect(category).to_not be_valid
    end

    it "can have many videos" do
      should respond_to(:videos)
    end
  end
end
