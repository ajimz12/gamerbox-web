<?php

namespace App\Controller;

use App\Entity\GameReference;
use App\Entity\Review;
use App\Entity\User;
use App\Entity\UserGame;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ReviewController extends AbstractController
{


    #[Route('/api/reviews/following', name: 'api_get_following_reviews', methods: ['GET'])]
    public function getFollowingReviews(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $reviews = $entityManager->getRepository(Review::class)->findFollowingReviews($user);
        $reviewsData = array_map([$this, 'formatReviewData'], $reviews);

        return new JsonResponse($reviewsData);
    }


    #[Route('/api/reviews', name: 'api_create_review', methods: ['POST'])]
    public function createReview(
        Request $request,
        EntityManagerInterface $entityManager,
        HttpClientInterface $httpClient,
        #[Autowire('%env(RAWG_API_KEY)%')] string $rawgApiKey
    ): JsonResponse {
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

        // Verificar si el usuario ya tiene una reseña para este juego
        if ($gameReference) {
            $existingReview = $entityManager->getRepository(Review::class)->findOneBy([
                'author' => $user,
                'game' => $gameReference
            ]);

            if ($existingReview) {
                return new JsonResponse(
                    ['error' => 'Ya has publicado una reseña para este juego'],
                    Response::HTTP_CONFLICT
                );
            }
        }

        // Si no existe, crear una nueva referencia
        if (!$gameReference) {
            $gameReference = new GameReference();
            $gameReference->setRawgId($data['gameId']);

            // Llamada a la API de RAWG
            try {
                $response = $httpClient->request('GET', 'https://api.rawg.io/api/games/' . $data['gameId'], [
                    'query' => [
                        'key' => $rawgApiKey,
                    ]
                ]);

                if ($response->getStatusCode() === 200) {
                    $gameData = $response->toArray();
                    error_log('RAWG API Response: ' . json_encode($gameData));

                    $gameReference->setName($gameData['name'] ?? 'Nombre desconocido');
                    $gameReference->setSlug($gameData['slug'] ?? 'slug-desconocido');
                    $gameReference->setBackgroundImage($gameData['background_image'] ?? null);
                } else {
                    $gameReference->setName('Nombre desconocido');
                    $gameReference->setSlug('slug-desconocido');
                    $gameReference->setBackgroundImage(null);
                }
            } catch (\Throwable $e) {
                return new JsonResponse(['error' => 'Error al consultar la API de RAWG'], Response::HTTP_BAD_GATEWAY);
            }

            $entityManager->persist($gameReference);
            $entityManager->flush();
        }

        $review = new Review();
        $review->setGame($gameReference);
        $review->setRating($data['rating']);
        $review->setText($data['text'] ?? '');
        $review->setAuthor($user);
        $review->setCreatedAt(new \DateTimeImmutable());
        $review->setPlayedBefore($data['playedBefore'] ?? false);

        // Buscar UserGame existente o crear uno nuevo
        $userGame = $entityManager->getRepository(UserGame::class)->findOneBy([
            'user' => $user,
            'game' => $gameReference
        ]);

        if (!$userGame) {
            $userGame = new UserGame();
            $userGame->setUser($user);
            $userGame->setGame($gameReference);
            $userGame->setIsFavorite(false);
            $userGame->setPlayedAt($review->getPlayedAt() ?? new \DateTimeImmutable());
        }

        // Actualizar el estado a 'played' independientemente de si existía o no
        $userGame->setStatus('played');

        $entityManager->persist($userGame);
        $entityManager->flush();

        $entityManager->persist($review);
        $entityManager->persist($userGame);
        $entityManager->flush();

        if (isset($data['playedAt'])) {
            $review->setPlayedAt(new \DateTimeImmutable($data['playedAt']));
        }

        $entityManager->persist($review);
        $entityManager->flush();

        return new JsonResponse([
            'id' => $review->getId(),
            'gameId' => $review->getGame()->getRawgId(),
            'rating' => $review->getRating(),
            'text' => $review->getText(),
            'createdAt' => $review->getCreatedAt()->format('c'),
            'playedBefore' => $review->isPlayedBefore(),
            'playedAt' => $review->getPlayedAt()?->format('c'),
            'author' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'profilePicture' => $user->getProfilePicture()
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/reviews/{id}/like', name: 'api_like_review', methods: ['POST'])]
    public function likeReview(Review $review, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        if ($review->hasLiked($user)) {
            $review->removeLike($user);
        } else {
            $review->addLike($user);
        }

        $entityManager->flush();

        return new JsonResponse([
            'likes' => $review->getLikes()->count(),
            'hasLiked' => $review->hasLiked($user)
        ]);
    }

    private function formatReviewData(Review $review): array
    {
        /** @var User $user */
        $user = $this->getUser();

        return [
            'id' => $review->getId(),
            'gameId' => $review->getGame()->getRawgId(),
            'gameName' => $review->getGame()->getName(),
            'gameSlug' => $review->getGame()->getSlug(),
            'rating' => $review->getRating(),
            'text' => $review->getText(),
            'createdAt' => $review->getCreatedAt()->format('c'),
            'playedBefore' => $review->isPlayedBefore(),
            'playedAt' => $review->getPlayedAt()?->format('c'),
            'likes' => $review->getLikes()->count(),
            'hasLiked' => $user !== null ? $review->hasLiked($user) : false,
            'author' => [
                'id' => $review->getAuthor()->getId(),
                'username' => $review->getAuthor()->getUsername(),
                'profilePicture' => $review->getAuthor()->getProfilePicture()
            ]
        ];
    }

    #[Route('/api/games/{gameId}/reviews', name: 'api_get_game_reviews', methods: ['GET'])]
    public function getGameReviews(string $gameId, EntityManagerInterface $entityManager): JsonResponse
    {
        $gameReference = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $gameId]);

        if (!$gameReference) {
            return new JsonResponse([], Response::HTTP_OK);
        }

        $reviews = $entityManager->getRepository(Review::class)->findByGame($gameReference);
        $reviewsData = array_map([$this, 'formatReviewData'], $reviews);

        return new JsonResponse($reviewsData);
    }

    #[Route('/api/users/{username}/reviews', name: 'api_get_user_reviews', methods: ['GET'])]
    public function getUserReviews(string $username, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $reviews = $entityManager->getRepository(Review::class)->findByUser($user);
        $reviewsData = array_map([$this, 'formatReviewData'], $reviews);

        return new JsonResponse($reviewsData);
    }

    #[Route('/api/reviews', name: 'api_get_all_reviews', methods: ['GET'])]
    public function getAllReviews(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $orderBy = $request->query->get('orderBy', 'date');
        $reviews = $orderBy === 'popular'
            ? $entityManager->getRepository(Review::class)->findAllOrderedByPopularity()
            : $entityManager->getRepository(Review::class)->findAllOrderedByDate();

        $reviewsData = array_map([$this, 'formatReviewData'], $reviews);

        return new JsonResponse($reviewsData);
    }

    #[Route('/api/reviews/{id}', name: 'api_get_review', methods: ['GET'])]
    public function getReview(Review $review): JsonResponse
    {
        return new JsonResponse($this->formatReviewData($review));
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

    #[Route('/api/reviews/{id}', name: 'api_update_review', methods: ['PUT'])]
    public function updateReview(Review $review, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        if ($review->getAuthor() !== $user) {
            return new JsonResponse(['error' => 'No tienes permiso para editar esta reseña'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['rating'])) {
            $review->setRating($data['rating']);
        }
        if (isset($data['text'])) {
            $review->setText($data['text']);
        }
        if (isset($data['playedBefore'])) {
            $review->setPlayedBefore($data['playedBefore']);
        }
        if (isset($data['playedAt'])) {
            $review->setPlayedAt(new \DateTimeImmutable($data['playedAt']));
        }

        $entityManager->flush();

        return new JsonResponse([
            'id' => $review->getId(),
            'gameId' => $review->getGame()->getRawgId(),
            'gameName' => $review->getGame()->getName(),
            'gameSlug' => $review->getGame()->getSlug(),
            'rating' => $review->getRating(),
            'text' => $review->getText(),
            'createdAt' => $review->getCreatedAt()->format('c'),
            'playedBefore' => $review->isPlayedBefore(),
            'playedAt' => $review->getPlayedAt()?->format('c'),
            'likes' => $review->getLikes()->count(),
            'hasLiked' => $user ? $review->hasLiked($user) : false,
            'author' => [
                'id' => $review->getAuthor()->getId(),
                'username' => $review->getAuthor()->getUsername(),
                'profilePicture' => $review->getAuthor()->getProfilePicture()
            ]
        ]);
    }
}
