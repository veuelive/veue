# frozen_string_literal: true

class FakeMuxService
  def create_live_stream
    OpenStruct.new({
                     data: OpenStruct.new({
                                            id: "ID",
                                            stream_key: "STREAM_KEY",
                                          }),
                   })
  end
end
