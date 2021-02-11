# frozen_string_literal: true

class AddUserTypesToUsers < ActiveRecord::Migration[6.0]
  def change
    create_enum("user_type_enum", %w[normal employee admin])

    change_table(:users) do |t|
      t.enum(:user_type, as: "user_type_enum", default: "normal")
    end
  end
end
