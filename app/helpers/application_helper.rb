# frozen_string_literal: true

module ApplicationHelper
  def body_attributes
    {
      id: "#{controller.controller_name}__#{controller.action_name}",
    }
  end

  # See `/app/javascript/helpers/app_config.ts` and ensure these remain in sync!
  # This is cached on every deploy, so DO NOT put user-specific or changing information,
  # that is what we use the data-* attributes for.
  def app_config
    {
      env: Rails.env,
      host: ENV["RENDER_EXTERNAL_URL"],
      veue: {
        env: ENV["VEUE_ENV"] || "dev",
        revision: ENV["RENDER_GIT_COMMIT"] || `git rev-parse HEAD`,
        branch: ENV["RENDER_GIT_BRANCH"] || `git branch --show-current`,
      },
      service: {
        id: ENV["RENDER_SERVICE_ID"],
        name: ENV["RENDER_SERVICE_NAME"],
        pod: ENV["RENDER_POD_NAME"],
      },
      appsignal: {
        key: ENV["APPSIGNAL_FRONTEND_KEY"],
      },
    }
  end

  def svg_tag(filename, options={})
    inline_svg_pack_tag("media/images/#{filename}.svg", options)
  end

  # Formats into 1.4K, 2.4M, etc
  # @param {Number} number - The number to format
  # @return {String} - A formatted number as a string, IE: 1.4K
  # @example
  #   number_to_social(10512) # => 10.5K
  def number_to_social(number)
    number_to_human(
      number,
      format: "%n%u",
      units: {thousand: "K", million: "M", billion: "B"},
    )
  end

  def circle_image_tag(image, size: 64, draggable: "false")
    image_tag(image.variant(resize_to_fill: [size, size]), style: "border-radius: 50%;", draggable: draggable)
  end
end
