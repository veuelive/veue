# frozen_string_literal: true

class JsonValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, json)
    schema = record.public_send("#{attribute}_schema") || {}
    schema.stringify_keys!
    validate_required_keys(record, attribute, schema, json) if schema["required"]
    if schema["properties"]
      properties = schema["properties"].stringify_keys

      validate_key_types(record, attribute, properties, json)
      validate_only_allowed_keys(record, attribute, properties, json)
    else
      Rails.logger.warn("Should specify properties in a JSON schema")
    end
  end

  private

  def validate_required_keys(record, attribute, schema, json)
    (schema["required"] - json.keys).each do |key|
      record.errors.add(attribute, :json_missing_required_property, message: "Missing property #{key}")
    end
  end

  def validate_key_types(record, attribute, schema_properties, json)
    schema_properties.each do |key, type|
      next unless json.has_key?(key)
      next if json[key]&.is_a?(type)

      record.errors.add(attribute, :json_wrong_type, message: "#{attribute}.#{key} should be a #{type}")
    end
  end

  def validate_only_allowed_keys(record, attribute, schema_properties, json)
    (json.keys - schema_properties.keys).each do |unallowed_key|
      record.errors.add(attribute, :json_unknown_property, message: "Unknown property #{unallowed_key}")
    end
  end
end
