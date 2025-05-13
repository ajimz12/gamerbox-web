<?php

namespace App\Controller;

use App\Entity\Review;
use App\Entity\ReviewComment;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CommentController extends AbstractController
{
    private function formatCommentData(ReviewComment $comment): array
    {
        return [
            'id' => $comment->getId(),
            'text' => $comment->getContent(),
            'createdAt' => $comment->getCreatedAt()->format('c'),
            'author' => [
                'id' => $comment->getAuthor()->getId(),
                'username' => $comment->getAuthor()->getUsername(),
                'profilePicture' => $comment->getAuthor()->getProfilePicture()
            ]
        ];
    }

    #[Route('/api/reviews/{id}/comments', name: 'api_get_review_comments', methods: ['GET'])]
    public function getReviewComments(Review $review): JsonResponse
    {
        $comments = $review->getReviewComments();
        $commentsData = array_map([$this, 'formatCommentData'], $comments->toArray());
        
        return new JsonResponse($commentsData);
    }

    #[Route('/api/reviews/{id}/comments', name: 'api_create_comment', methods: ['POST'])]
    public function createComment(
        Review $review,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['text']) || empty(trim($data['text']))) {
            return new JsonResponse(['error' => 'El comentario no puede estar vacío'], Response::HTTP_BAD_REQUEST);
        }

        $comment = new ReviewComment();
        $comment->setReview($review);
        $comment->setContent($data['text']);
        $comment->setAuthor($user);
        $comment->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($comment);
        $entityManager->flush();

        return new JsonResponse($this->formatCommentData($comment), Response::HTTP_CREATED);
    }

    #[Route('/api/comments/{id}', name: 'api_delete_comment', methods: ['DELETE'])]
    public function deleteComment(
        ReviewComment $comment,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        if ($comment->getAuthor() !== $user) {
            return new JsonResponse(['error' => 'No tienes permiso para eliminar este comentario'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($comment);
        $entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}