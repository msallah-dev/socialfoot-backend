import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectEntityTableNames1768386650171 implements MigrationInterface {
    name = 'CorrectEntityTableNames1768386650171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id_commentaire" SERIAL NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "postIdPost" integer, "userIdUser" integer, CONSTRAINT "PK_e557ce13337327662f88f4f9689" PRIMARY KEY ("id_commentaire"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("userId" integer NOT NULL, "postId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_74b9b8cd79a1014e50135f266fe" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "shares" ("userId" integer NOT NULL, "postId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1f05a1021275459391bdf3ebfea" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "follow" ("followerId" integer NOT NULL, "followedId" integer NOT NULL, "followed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e746877023d5b76b9550ba0ea38" PRIMARY KEY ("followerId", "followedId"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_1608f17c213be07c6419cdac3b8" FOREIGN KEY ("postIdPost") REFERENCES "posts"("id_post") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_453ca0eac2135b5cd7ddafe0b44" FOREIGN KEY ("userIdUser") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50" FOREIGN KEY ("postId") REFERENCES "posts"("id_post") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shares" ADD CONSTRAINT "FK_75fbef00ed9a5529ba75aeaada4" FOREIGN KEY ("postId") REFERENCES "posts"("id_post") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shares" ADD CONSTRAINT "FK_969e9a7c89cbbd57c889ba5f45d" FOREIGN KEY ("userId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_f4a9d59861c87ba252ead40d84d" FOREIGN KEY ("followedId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_f4a9d59861c87ba252ead40d84d"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
        await queryRunner.query(`ALTER TABLE "shares" DROP CONSTRAINT "FK_969e9a7c89cbbd57c889ba5f45d"`);
        await queryRunner.query(`ALTER TABLE "shares" DROP CONSTRAINT "FK_75fbef00ed9a5529ba75aeaada4"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_453ca0eac2135b5cd7ddafe0b44"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_1608f17c213be07c6419cdac3b8"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`DROP TABLE "shares"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
