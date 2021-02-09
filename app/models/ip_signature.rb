# frozen_string_literal: true

class IpSignature < ApplicationRecord
  encrypts :ip_address
  blind_index :ip_address, expression: ->(address) { address.downcase }
end
