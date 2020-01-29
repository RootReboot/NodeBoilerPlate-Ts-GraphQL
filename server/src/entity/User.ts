import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity
} from "typeorm";
import * as uuidv4 from "uuid/v4";
@Entity()
export class User extends BaseEntity {
  //Doens't do a sequencial increment of ids,
  // so the user doens't get to the have the info of how much user he have, etc, etc
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column()
  age: number;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
