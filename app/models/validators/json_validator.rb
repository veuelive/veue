# frozen_string_literal: true

class JsonValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, json)
    @record = record
    @attribute = attribute
    schema = record.public_send("#{attribute}_schema") || {}
    schema.deep_stringify_keys!
    json.deep_stringify_keys!
    validate_required_keys(schema, json) if schema["required"]
    if schema["properties"]
      properties = schema["properties"].stringify_keys

      validate_object_properties(properties, json)
      validate_known_properties(properties, json)
    else
      Rails.logger.warn("Should specify properties in a JSON schema")
    end
  end

  def add_error(name, message)
    @record.errors.add(@attribute, name, message: message)
  end

  private

  def validate_required_keys(schema, json)
    (schema["required"] - json.keys).each do |key|
      add_error(:json_missing_required_property, "Missing property #{key}")
    end
  end

  def validate_object_properties(schema_properties, data, prefix="")
    schema_properties.each do |key, type|
      next unless data.has_key?(key)

      validate_property(type, data[key], prefix + "." + key)
    end
  end

  def validate_property(type, value, key)
    return if value.nil?

    case type
    when :boolean
      unless (value == true) || (value == false)
        add_error(:json_wrong_property_type, "Wrong type for #{key}– expected boolean")
      end
    when Array
      validate_array_property(type, value, key)
    else
      add_error(:json_wrong_property_type, "Wrong type for #{key}– expected #{type}") unless value.is_a?(type)
    end
  end

  def validate_array_property(type, value, prefix)
    array_type = type[0]
    return true if value.empty?

    value.each_with_index do |element, index|
      key = prefix + "[#{index}]"
      if array_type.is_a?(Hash)
        validate_object_properties(array_type, element, key)
      else
        validate_property(array_type, element, key)
      end
    end
  end

  def validate_known_properties(schema, data, prefix="")
    data.each do |key, value|
      add_error(:json_unknown_property, "Unknown property #{prefix}#{key}") && next unless schema.has_key?(key)
      next unless value.is_a?(Array)

      array_type = schema[key][0]
      next unless array_type.is_a?(Hash)

      value.each_with_index do |object, index|
        validate_known_properties(array_type, object.stringify_keys, prefix + "#{key}[#{index}].")
      end
    end
  end
end
