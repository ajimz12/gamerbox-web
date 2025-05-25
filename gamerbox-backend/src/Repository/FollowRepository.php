<?php

namespace App\Repository;

use App\Entity\Follow;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Follow>
 */
class FollowRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Follow::class);
    }

    public function findOneByUsers(User $follower, User $followed): ?Follow
    {
        return $this->findOneBy([
            'follower' => $follower,
            'followed' => $followed
        ]);
    }

    public function save(Follow $follow, bool $flush = true): void
    {
        $this->getEntityManager()->persist($follow);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Follow $follow, bool $flush = true): void
    {
        $this->getEntityManager()->remove($follow);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
