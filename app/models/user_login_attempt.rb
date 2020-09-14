# frozen_string_literal: true

class UserLoginAttempt < ApplicationRecord
  belongs_to :user, optional: true

  validates :phone_number, phone_number: true

  encrypts :secret_code
  encrypts :phone_number
  blind_index :phone_number
  encrypts :session_uuid
  blind_index :session_uuid

  before_create :setup_secrets!
  before_validation :copy_phone_if_user
  after_create :send_sms_message!

  aasm column: "state" do
    state :new, initial: true
    state :pending_confirmation
    state :failed
    state :active
    state :revoked

    event :sent_code do
      transitions from: :new, to: :pending_confirmation
    end

    event :wrong_code do
      transitions from: %i[pending_confirmation new], to: :failed
    end

    event :correct_code do
      transitions from: :pending_confirmation, to: :active
    end

    event :logout do
      transitions from: :active, to: :revoked
    end
  end

  def setup_secrets!
    # You might be wondering why the numbers below aren't 0..9999... well, check out the doc Authentication Strategy
    self.secret_code = SecureRandom.rand(1982..9820)
    self.session_uuid = SecureRandom.uuid
  end

  def send_sms_message!
    SendConfirmationTextJob.perform_later self
  end

  def process_secret_code!(possible_secret_code)
    return unless pending_confirmation?

    if secret_code.to_s == possible_secret_code.to_s
      correct_code!
    else
      wrong_code!
    end
  end

  def create_user(display_name)
    return if user

    self.user = User.new(phone_number: phone_number, display_name: display_name)
    save!
  end

  private

  # If we are just being created and have a USER, but no PHONE NUMBER, then use the users phone number!
  def copy_phone_if_user
    self.phone_number = user.phone_number if user && !phone_number
  end
end
