import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/base.entity";

export enum Statuses {
  WAIT,
  PROGRESS,
  FINISHED,
  CANCELED,
}
@Entity("games")
export class GameEntity extends BaseEntity<GameEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "type", type: "varchar", length: "128" })
  type: string;

  @Column({ name: "factoryAddress", type: "varchar", length: "128" })
  factoryAddress: string;

  @Column({ name: "tokenAddress", type: "varchar", length: "128" })
  tokenAddress: string;

  @Column({ name: "creatorAddress", type: "varchar", length: "128" })
  creatorAddress: string;

  @Column({ name: "address", type: "varchar", length: "128" })
  address: string;

  @Column({ name: "params", type: "jsonb" })
  params: any;

  @Column({ name: "chainId", type: "integer" })
  chainId: number;

  @Column({ name: "status", type: "integer", default: Statuses.WAIT })
  status: Statuses;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    nullable: false,
  })
  createdAt: Date;
}
