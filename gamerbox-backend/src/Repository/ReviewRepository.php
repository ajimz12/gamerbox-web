<?php

namespace App\Repository;

use App\Entity\Review;
use App\Entity\User;
use App\Entity\GameReference;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Review>
 */
class ReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    public function findAll(): array
    {
        return $this->createQueryBuilder('r')
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findFollowingReviews(User $user): array
    {
        return $this->createQueryBuilder('r')
            ->join('r.author', 'a')
            ->join('a.followers', 'f')
            ->where('f.follower = :user')
            ->setParameter('user', $user)
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByGameAndUser(GameReference $game, User $user): ?Review
    {
        return $this->createQueryBuilder('r')
            ->where('r.game = :game')
            ->andWhere('r.author = :user')
            ->setParameter('game', $game)
            ->setParameter('user', $user)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByGame(GameReference $game): array
    {
        return $this->findBy(
            ['game' => $game],
            ['createdAt' => 'DESC']
        );
    }

    public function findByUser(User $user): array
    {
        return $this->findBy(
            ['author' => $user],
            ['createdAt' => 'DESC']
        );
    }

    public function findAllOrderedByPopularity(): array
    {
        return $this->createQueryBuilder('r')
            ->leftJoin('r.likes', 'l')
            ->groupBy('r.id')
            ->orderBy('COUNT(l.id)', 'DESC')
            ->addOrderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findAllOrderedByDate(): array
    {
        return $this->findBy([], ['createdAt' => 'DESC']);
    }
}
