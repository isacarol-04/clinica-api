import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameScheduledAtToAppointmentDate1749596041603 implements MigrationInterface {
    name = 'RenameScheduledAtToAppointmentDate1749596041603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" RENAME COLUMN "scheduledAt" TO "appointmentDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" RENAME COLUMN "appointmentDate" TO "scheduledAt"`);
    }

}
