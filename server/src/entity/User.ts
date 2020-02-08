import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  //Doens't do a sequencial increment of ids,
  // so the user doens't get to the have the info of how much user he have, etc, etc
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("boolean", { default: false })
  confirmed: boolean;
}
