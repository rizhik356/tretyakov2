import { Table, Column, Model, DataType } from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'

@Table({ tableName: 'images', timestamps: false })
export class ImagesModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  })
  id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  original_name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: string

  @Column({
    type: DataType.DATE,
    defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 день
  })
  expires_at: string
}
