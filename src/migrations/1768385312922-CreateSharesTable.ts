import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSharesTable1768385312922 implements MigrationInterface {
    name = 'CreateSharesTable1768385312922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Shares" ("userId" integer NOT NULL, "postId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f8dab56097cec731cdb04dae700" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`ALTER TABLE "Shares" ADD CONSTRAINT "FK_37df37e76e28dcd508461e7315f" FOREIGN KEY ("postId") REFERENCES "posts"("id_post") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Shares" ADD CONSTRAINT "FK_a7ac63f6ca72b0c16a770d8b7ce" FOREIGN KEY ("userId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Shares" DROP CONSTRAINT "FK_a7ac63f6ca72b0c16a770d8b7ce"`);
        await queryRunner.query(`ALTER TABLE "Shares" DROP CONSTRAINT "FK_37df37e76e28dcd508461e7315f"`);
        await queryRunner.query(`DROP TABLE "Shares"`);
    }

}
