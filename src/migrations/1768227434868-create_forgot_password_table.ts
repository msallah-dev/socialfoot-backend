import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateForgotPasswordTable1768227434868 implements MigrationInterface {
    name = 'CreateForgotPasswordTable1768227434868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "forgot_password" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userIdUser" integer, CONSTRAINT "UQ_d4c574a9c74929c60da5a8c89f4" UNIQUE ("token"), CONSTRAINT "PK_9b1bedb8b9dd6834196533ee41b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "forgot_password" ADD CONSTRAINT "FK_0a93c1431de65c482792ea548e3" FOREIGN KEY ("userIdUser") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot_password" DROP CONSTRAINT "FK_0a93c1431de65c482792ea548e3"`);
        await queryRunner.query(`DROP TABLE "forgot_password"`);
    }

}
