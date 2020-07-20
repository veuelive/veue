# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if Rails.env != "production"
  %w[hcatlin@gmail.com malrase@gmail.com].map do |email|
    User.create({
                    email: email,
                    username: email.split("@").first,
                    confirmed_at: Time.now,
                    password: "mohawk",
                    password_confirmation: "mohawk",
                })
  end
end