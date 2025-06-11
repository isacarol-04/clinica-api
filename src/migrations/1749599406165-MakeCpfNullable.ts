import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCpfNullable1749599406165 implements MigrationInterface {
    name = 'MakeCpfNullable1749599406165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "cpf" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "cpf" SET NOT NULL`);
    }

}
