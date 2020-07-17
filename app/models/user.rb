class User < ApplicationRecord
  # This is used for email-or-username login functionality
  attr_accessor :login

  validates :username,
            presence: true

  # Include default devise modules. Others available are:
  # and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :trackable

  has_many :streams

  # This allows us to lookup users via either email OR username. Pretty cool, huh?
  def self.find_for_database_authentication(warden_condition)
    conditions = warden_condition.dup
    login = conditions.delete(:login)
    where(conditions).where(
      ["lower(username) = :value OR lower(email) = :value",
       {value: login.strip.downcase}]
    ).first
  end
end
