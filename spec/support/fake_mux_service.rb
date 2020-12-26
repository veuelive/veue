# frozen_string_literal: true

class FakeMuxService
  def create_live_stream
    seed = Faker::Number.unique.number
    OpenStruct.new({
                     data: OpenStruct.new({
                                            id: "ID-#{seed}",
                                            stream_key: "STREAM_KEY-#{seed}",
                                          }),
                   })
  end
end
