# frozen_string_literal: true

class AddEmailEncryption < ActiveRecord::Migration[6.0]
  def change
    change_table(:users, bulk: true) do |t|
      t.column(:email_ciphertext, :text)
      t.column(:email_bidx, :string)
      t.index(:email, unique: true, where: "email IS NOT NULL")
      t.index(:email_bidx, unique: true, where: "email_bidx IS NOT NULL")
    end
  end
end
