<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250406191733 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE follow (id INT AUTO_INCREMENT NOT NULL, follower_id INT DEFAULT NULL, followed_id INT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_68344470AC24F853 (follower_id), INDEX IDX_68344470D956F010 (followed_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE game_reference (id INT AUTO_INCREMENT NOT NULL, rawg_id INT NOT NULL, slug VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, background_image VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE list_entity (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, is_public TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_97F8864661220EA6 (creator_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE list_item (id INT AUTO_INCREMENT NOT NULL, list_id INT DEFAULT NULL, game_id INT DEFAULT NULL, INDEX IDX_5AD5FAF73DAE168B (list_id), INDEX IDX_5AD5FAF7E48FD905 (game_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE review (id INT AUTO_INCREMENT NOT NULL, author_id INT DEFAULT NULL, game_id INT DEFAULT NULL, rating INT NOT NULL, text VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_794381C6F675F31B (author_id), INDEX IDX_794381C6E48FD905 (game_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE review_comment (id INT AUTO_INCREMENT NOT NULL, author_id INT DEFAULT NULL, review_id INT DEFAULT NULL, content LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_F9AE69BF675F31B (author_id), INDEX IDX_F9AE69B3E2E969B (review_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_game (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, game_id INT DEFAULT NULL, is_favorite TINYINT(1) NOT NULL, played_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', status VARCHAR(255) NOT NULL, INDEX IDX_59AA7D45A76ED395 (user_id), INDEX IDX_59AA7D45E48FD905 (game_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow ADD CONSTRAINT FK_68344470AC24F853 FOREIGN KEY (follower_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow ADD CONSTRAINT FK_68344470D956F010 FOREIGN KEY (followed_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE list_entity ADD CONSTRAINT FK_97F8864661220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE list_item ADD CONSTRAINT FK_5AD5FAF73DAE168B FOREIGN KEY (list_id) REFERENCES list_entity (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE list_item ADD CONSTRAINT FK_5AD5FAF7E48FD905 FOREIGN KEY (game_id) REFERENCES game_reference (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review ADD CONSTRAINT FK_794381C6F675F31B FOREIGN KEY (author_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review ADD CONSTRAINT FK_794381C6E48FD905 FOREIGN KEY (game_id) REFERENCES game_reference (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review_comment ADD CONSTRAINT FK_F9AE69BF675F31B FOREIGN KEY (author_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review_comment ADD CONSTRAINT FK_F9AE69B3E2E969B FOREIGN KEY (review_id) REFERENCES review (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_game ADD CONSTRAINT FK_59AA7D45A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_game ADD CONSTRAINT FK_59AA7D45E48FD905 FOREIGN KEY (game_id) REFERENCES game_reference (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE follow DROP FOREIGN KEY FK_68344470AC24F853
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow DROP FOREIGN KEY FK_68344470D956F010
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE list_entity DROP FOREIGN KEY FK_97F8864661220EA6
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE list_item DROP FOREIGN KEY FK_5AD5FAF73DAE168B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE list_item DROP FOREIGN KEY FK_5AD5FAF7E48FD905
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review DROP FOREIGN KEY FK_794381C6F675F31B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review DROP FOREIGN KEY FK_794381C6E48FD905
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review_comment DROP FOREIGN KEY FK_F9AE69BF675F31B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review_comment DROP FOREIGN KEY FK_F9AE69B3E2E969B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_game DROP FOREIGN KEY FK_59AA7D45A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_game DROP FOREIGN KEY FK_59AA7D45E48FD905
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE follow
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE game_reference
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE list_entity
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE list_item
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE review
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE review_comment
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_game
        SQL);
    }
}
