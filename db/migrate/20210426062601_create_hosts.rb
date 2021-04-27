class CreateHosts < ActiveRecord::Migration[6.1]
  def change
    create_table :hosts, id: :uuid do |t|
      t.belongs_to :channel, foreign_key: true, type: :uuid
      t.belongs_to :user, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
