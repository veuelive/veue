# frozen_string_literal: true

class AddEmailEncryption < ActiveRecord::Migration[6.0]
  def change
    change_table(:users, bulk: true) do |t|
      t.column(:email_ciphertext, :text)
      t.column(:email_bidx, :string)
      t.index(:email_bidx)
    end
  end
end
