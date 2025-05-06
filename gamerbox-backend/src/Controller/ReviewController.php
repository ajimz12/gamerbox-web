<?php

namespace App\Controller;

use App\Entity\GameReference;
use App\Entity\Review;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReviewController extends AbstractController
{
    #[Route('/api/reviews', name: 'api_create_review', methods: ['POST'])]
    public function createReview(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['gameId']) || !isset($data['rating'])) {
            return new JsonResponse(['error' => 'Faltan datos requeridos'], Response::HTTP_BAD_REQUEST);
        }

        // Buscar la referencia del juego
        $gameReference = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $data['gameId']]);
        
        // Si no existe, crear una nueva referencia
        if (!$gameReference) {
            $gameReference = new GameReference();
            $gameReference->setRawgId($data['gameId']);
            $gameReference->setSlug('temp-slug'); // Required field
            $gameReference->setName('temp-name'); // Required field
            $entityManager->persist($gameReference);
        }

        $review = new Review();
        $review->setGame($gameReference);
        $review->setRating($data['rating']);
        $review->setText($data['text'] ?? '');
        $review->setAuthor($user);
        $review->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($review);
        $entityManager->flush();

        return new JsonResponse([
            'id' => $review->getId(),
            'gameId' => $review->getGame()->getRawgId(),
            'rating' => $review->getRating(),
            'text' => $review->getText(),
            'createdAt' => $review->getCreatedAt()->format('c'),
            'author' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'profilePicture' => $user->getProfilePicture()
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/games/{gameId}/reviews', name: 'api_get_game_reviews', methods: ['GET'])]
    public function getGameReviews(string $gameId, EntityManagerInterface $entityManager): JsonResponse
    {
        $gameReference = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $gameId]);
        
        if (!$gameReference) {
            return new JsonResponse([], Response::HTTP_OK);
        }

        $reviews = $entityManager->getRepository(Review::class)->findBy(
            ['game' => $gameReference],
            ['createdAt' => 'DESC']
        );

        $reviewsData = array_map(function (Review $review) {
            return [
                'id' => $review->getId(),
                'gameId' => $review->getGame()->getId(),
                'rating' => $review->getRating(),
                'text' => $review->getText(),
                'createdAt' => $review->getCreatedAt()->format('c'),
                'author' => [
                    'id' => $review->getAuthor()->getId(),
                    'username' => $review->getAuthor()->getUsername(),
                    'profilePicture' => $review->getAuthor()->getProfilePicture()
                ]
            ];
        }, $reviews);

        return new JsonResponse($reviewsData);
    }

    #[Route('/api/reviews/{id}', name: 'api_delete_review', methods: ['DELETE'])]
    public function deleteReview(Review $review, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        if ($review->getAuthor() !== $user) {
            return new JsonResponse(['error' => 'No tienes permiso para eliminar esta reseña'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($review);
        $entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/users/{username}/reviews', name: 'api_get_user_reviews', methods: ['GET'])]
    public function getUserReviews(string $username, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);
        
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $reviews = $entityManager->getRepository(Review::class)->findBy(
            ['author' => $user],
            ['createdAt' => 'DESC']
        );

        $reviewsData = array_map(function (Review $review) {
            return [
                'id' => $review->getId(),
                'gameId' => $review->getGame()->getId(),
                'rating' => $review->getRating(),
                'text' => $review->getText(),
                'createdAt' => $review->getCreatedAt()->format('c'),
                'author' => [
                    'id' => $review->getAuthor()->getId(),
                    'username' => $review->getAuthor()->getUsername(),
                    'profilePicture' => $review->getAuthor()->getProfilePicture()
                ]
            ];
        }, $reviews);

        return new JsonResponse($reviewsData);
    }
}