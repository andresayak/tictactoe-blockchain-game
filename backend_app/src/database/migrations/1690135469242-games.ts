import { MigrationInterface, QueryRunner, Table } from "typeorm";

const name = "games";

export class Games1690135469242 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: name,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "type",
            type: "varchar(128)",
            isNullable: true,
          },
          {
            name: "address",
            type: "varchar(128)",
            isNullable: true,
          },
          {
            name: "tokenAddress",
            type: "varchar(128)",
            isNullable: true,
          },
          {
            name: "factoryAddress",
            type: "varchar(128)",
            isNullable: true,
          },
          {
            name: "creatorAddress",
            type: "varchar(128)",
            isNullable: true,
          },
          {
            name: "params",
            type: "jsonb",
          },
          {
            name: "chainId",
            type: "integer",
          },
          {
            name: "status",
            type: "integer",
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(name);
  }
}
