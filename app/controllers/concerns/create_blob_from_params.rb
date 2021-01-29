# frozen_string_literal: true

module CreateBlobFromParams
  def create_blob_from_params(image)
    {
      io: StringIO.new((Base64.decode64(image.split(",")[1]))),
      filename: "user.png",
      content_type: "image/png",
    }
  end
end
