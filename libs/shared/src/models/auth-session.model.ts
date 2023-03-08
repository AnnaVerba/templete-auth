import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';

@Table
export class AuthSession extends Model {
  @PrimaryKey
  @Column(DataType.CHAR)
  token: string;
}
