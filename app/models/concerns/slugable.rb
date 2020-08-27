# frozen_string_literal: true

require "nanoid"

module Slugable
  extend ActiveSupport::Concern

  included do
    before_create :generate_slug

    def generate_slug
      loop do
        self.slug = Nanoid.generate(size: 10)
        break unless Video.exists?(slug: slug)
      end
    end

    # It overrides & replace route /:id with /:slug if
    # slug value exists in data record.
    def to_param
      return unless persisted?
      return id.to_s if slug.blank?

      slug
    end
  end

  module ClassMethods
    # Overrides active_record find method to get record if
    # provided argument is slug instead of id. It will automatically
    # call base/super method if argument is id of record.
    def find(*args)
      id = args.first
      return super if args.count != 1 || id.class == Integer || primary_key?(id)

      find_by(slug: id).tap { |result| return result unless result.nil? }
      raise_not_found_exception(id)
    end

    private

    def primary_key?(id)
      key_type = columns_hash[primary_key].type
      case key_type
      when :integer
        begin
          Integer(id, 10)
        rescue StandardError
          false
        end
      else
        false
      end
    end

    def raise_not_found_exception(id)
      message = "can't find record with slug based id: #{id.inspect}"
      raise(ActiveRecord::RecordNotFound.new(message))
    end
  end
end
