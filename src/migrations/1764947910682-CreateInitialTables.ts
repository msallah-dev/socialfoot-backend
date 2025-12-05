import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1764947910682 implements MigrationInterface {
    name = 'CreateInitialTables1764947910682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Comments" ("id_commentaire" SERIAL NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "postIdPost" integer, "userIdUser" integer, CONSTRAINT "PK_9f1992c3d50c8c6c9a599329f8a" PRIMARY KEY ("id_commentaire"))`);
        await queryRunner.query(`CREATE TABLE "Likes" ("userId" integer NOT NULL, "postId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c375c4edb6067951c571030dcc6" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id_post" SERIAL NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userIdUser" integer, CONSTRAINT "PK_3f6b287bd4de2d788acf407f7e7" PRIMARY KEY ("id_post"))`);
        await queryRunner.query(`CREATE TABLE "Follow" ("followerId" integer NOT NULL, "followedId" integer NOT NULL, "followed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c962ac14d51bcb0621f08bc7a9" PRIMARY KEY ("followerId", "followedId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id_user" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "prenom" character varying NOT NULL, "password" character varying NOT NULL, "age" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_fbb07fa6fbd1d74bee9782fb945" PRIMARY KEY ("id_user"))`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_d381f183df7cc1cdc10642326f9" FOREIGN KEY ("postIdPost") REFERENCES "posts"("id_post") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_6e97c6d8cc82b79f04eb2711908" FOREIGN KEY ("userIdUser") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Likes" ADD CONSTRAINT "FK_f1893ea82bd69980e2667505fca" FOREIGN KEY ("postId") REFERENCES "posts"("id_post") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Likes" ADD CONSTRAINT "FK_eb14edaf42c147177b6f90ebf0c" FOREIGN KEY ("userId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_a6f8c21ee23ae519680db8e4a64" FOREIGN KEY ("userIdUser") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Follow" ADD CONSTRAINT "FK_95e2aeeb6fb7219c842d9ec0947" FOREIGN KEY ("followerId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Follow" ADD CONSTRAINT "FK_b0a7ef80bae1293c715c708029e" FOREIGN KEY ("followedId") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Follow" DROP CONSTRAINT "FK_b0a7ef80bae1293c715c708029e"`);
        await queryRunner.query(`ALTER TABLE "Follow" DROP CONSTRAINT "FK_95e2aeeb6fb7219c842d9ec0947"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_a6f8c21ee23ae519680db8e4a64"`);
        await queryRunner.query(`ALTER TABLE "Likes" DROP CONSTRAINT "FK_eb14edaf42c147177b6f90ebf0c"`);
        await queryRunner.query(`ALTER TABLE "Likes" DROP CONSTRAINT "FK_f1893ea82bd69980e2667505fca"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_6e97c6d8cc82b79f04eb2711908"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_d381f183df7cc1cdc10642326f9"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "Follow"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "Likes"`);
        await queryRunner.query(`DROP TABLE "Comments"`);
    }

}
