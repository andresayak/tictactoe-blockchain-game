import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/base.entity";

@Entity("games_players")
export class GamePlayerEntity extends BaseEntity<GamePlayerEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "game_id", type: "integer" })
  gameId: number;

  @Column({ name: "address", type: "varchar", length: "128" })
  address: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    nullable: false,
  })
  createdAt: Date;
}
