# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

unless Rails.env.production?
  %w[test@veuelive.com hcatlin@gmail.com malrase@gmail.com].map do |email|
    user = User.new(
      email: email,
      username: email.split("@").first,
      password: 'mohawk',
      password_confirmation: 'mohawk',
    )
    user.skip_confirmation!
    user.save!
  end
end

if Rails.env.development?
  Admin.create!(
    email: 'test@veuelive.com',
    password: 'mohawk',
    password_confirmation: 'mohawk',
  )
end