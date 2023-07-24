import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

const index = new TableIndex({ columnNames: ["chainId", "address"], isUnique: true });
export class GamesIndex1690135873083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex("games", index);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("games", index);
  }
}
