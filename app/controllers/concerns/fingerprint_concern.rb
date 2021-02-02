# frozen_string_literal: true

module FingerprintConcern
  extend ActiveSupport::Concern

  included do
    before_action :ensure_fingerprinted
  end

  def ensure_fingerprinted
    cookies[:fp] ||= SecureRandom.uuid
  end

  def user_fingerprint
    cookies[:fp]
  end
end
