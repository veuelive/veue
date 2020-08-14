# frozen_string_literal: true

class User < ApplicationRecord
  # This is used for email-or-username login functionality
  attr_accessor :login

  validates :username,
            presence: true,
            uniqueness: true

  # Include default devise modules. Others available are:
  # and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :confirmable,
         :lockable,
         :trackable

  has_many :videos, dependent: :destroy
  has_many :mux_live_streams, dependent: :destroy
  belongs_to :mux_live_stream, optional: true
  delegate :stream_key, to: :mux_live_stream
  has_many :chat_messages, dependent: :destroy

  # # This allows us to lookup users via either email OR username. Pretty cool, huh?
  # def self.find_for_database_authentication(warden_condition)
  #   conditions = warden_condition.dup
  #   login = conditions.delete(:email)
  #   find_by(conditions).find_by(
  #     [
  #       "lower(username) = :value OR lower(email) = :value",
  #       {value: login.strip.downcase},
  #     ],
  #   )
  # end

  def setup_as_streamer!
    stream_object = MuxLiveStream.create!(user: self)
    update!({
              mux_live_stream: stream_object,
            })
  end

  def full_name
    "#{first_name} #{last_name}"
  end
end
