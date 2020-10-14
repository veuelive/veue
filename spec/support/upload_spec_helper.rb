# frozen_string_literal: true

module UploadSpecHelper
  def some_thumbnail_upload
    Rack::Test::UploadedFile.new(Rails.root.join("public/__test/thumbnail.jpg"), "image/jpeg")
  end
end
