# frozen_string_literal: true

class CreateIpSignatures < ActiveRecord::Migration[6.0]
  def change
    create_table(:ip_signatures, id: :uuid) do |t|
      t.string(:location)
      t.text(:ip_address_ciphertext)
      t.string(:ip_address_bidx)
      t.index(:ip_address_bidx)
      t.timestamps
    end
  end
end
