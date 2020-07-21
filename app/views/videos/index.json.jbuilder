# frozen_string_literal: true

json.array!(@videos, partial: "videos/video", as: :video)
