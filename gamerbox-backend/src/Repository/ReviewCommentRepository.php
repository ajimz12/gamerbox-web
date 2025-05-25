<?php

namespace App\Repository;

use App\Entity\Review;
use App\Entity\ReviewComment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ReviewComment>
 */
class ReviewCommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReviewComment::class);
    }

    public function findByReview(Review $review): array
    {
        return $this->findBy(
            ['review' => $review],
            ['createdAt' => 'ASC']
        );
    }

    public function save(ReviewComment $comment, bool $flush = true): void
    {
        $this->getEntityManager()->persist($comment);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ReviewComment $comment, bool $flush = true): void
    {
        $this->getEntityManager()->remove($comment);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
