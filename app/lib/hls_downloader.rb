# frozen_string_literal: true

module HlsDownloader
  FILE_MATCHER = /\n([^#\n]+)\n/.freeze
  public_constant(:FILE_MATCHER)

  def self.transfer_video(video)
    return if video.hls_url.nil?
    return if video.hls_url =~ /aws/
  end

  def self.fetch_manifest(video)
    gsub_files(Faraday.get(video.hls_url)) do |rendition_path|
      rendition_url = URI.join(video.hls_url, rendition_path)
      puts rendition_url
      rendition_response = Faraday.get(rendition_url)
      upload_file(video, rendition_response)

      gsub_files(rendition_response) do |fragment_path|
      end
    end
  end

  def self.gsub_files(response, &block)
    response.body.gsub(FILE_MATCHER) do |file_matcher|
      return block.call(file_matcher[0])
    end
  end
end
