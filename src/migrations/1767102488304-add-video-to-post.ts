import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVideoToPost1767102488304 implements MigrationInterface {
    name = 'AddVideoToPost1767102488304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "video" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "video"`);
    }

}
