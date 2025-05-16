<?php

namespace App\Controller;

use App\Entity\GameReference;
use App\Entity\User;
use App\Entity\UserGame;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class UserGameController extends AbstractController
{
    private $rawgApiKey;
    private $httpClient;

    public function __construct(
        HttpClientInterface $httpClient,
        #[Autowire('%env(RAWG_API_KEY)%')] string $rawgApiKey
    ) {
        $this->httpClient = $httpClient;
        $this->rawgApiKey = $rawgApiKey;
    }

    #[Route('/api/users/{username}/games', name: 'api_get_user_games', methods: ['GET'])]
    public function getUserGames(
        string $username,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $userGames = $entityManager->getRepository(UserGame::class)->findBy(
            ['user' => $user],
            ['playedAt' => 'DESC']
        );

        $gamesData = array_map(function (UserGame $userGame) {
            $review = $userGame->getGame()->getReviews()->filter(
                fn($review) => $review->getAuthor() === $userGame->getUser()
            )->first();

            return [
                'id' => $userGame->getGame()->getId(),
                'rawgId' => $userGame->getGame()->getRawgId(),
                'name' => $userGame->getGame()->getName(),
                'backgroundImage' => $userGame->getGame()->getBackgroundImage(),
                'playedAt' => $review?->getPlayedAt()?->format('c') ?? $userGame->getPlayedAt()->format('c'),
                'rating' => $review?->getRating() ?? null,
                'isFavorite' => $userGame->isFavorite(),
                'status' => $userGame->getStatus()
            ];
        }, $userGames);

        return new JsonResponse(['games' => $gamesData]);
    }

    #[Route('/api/users/{username}/favorites', name: 'api_get_user_favorites', methods: ['GET'])]
    public function getUserFavorites(
        string $username,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $userGames = $entityManager->getRepository(UserGame::class)->findBy(
            ['user' => $user, 'isFavorite' => true],
            ['playedAt' => 'DESC']
        );

        $gamesData = array_map(function (UserGame $userGame) {
            return [
                'id' => $userGame->getGame()->getId(),
                'rawgId' => $userGame->getGame()->getRawgId(),
                'name' => $userGame->getGame()->getName(),
                'backgroundImage' => $userGame->getGame()->getBackgroundImage(),
                'playedAt' => $userGame->getPlayedAt()->format('c'),
                'status' => $userGame->getStatus()
            ];
        }, $userGames);

        return new JsonResponse(['games' => $gamesData]);
    }

    #[Route('/api/games/{id}/favorite', name: 'api_toggle_game_favorite', methods: ['POST'])]
    public function toggleGameFavorite(
        string $id,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $gameReference = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $id]);
        if (!$gameReference) {
            $gameReference = new GameReference();
            $gameReference->setRawgId($id);

            try {
                $response = $this->httpClient->request('GET', 'https://api.rawg.io/api/games/' . $id, [
                    'query' => [
                        'key' => $this->rawgApiKey,
                    ]
                ]);

                if ($response->getStatusCode() === 200) {
                    $gameData = $response->toArray();
                    $gameReference->setName($gameData['name'] ?? 'Unknown Game');
                    $gameReference->setSlug($gameData['slug'] ?? 'unknown-game');
                    $gameReference->setBackgroundImage($gameData['background_image'] ?? null);
                } else {
                    $gameReference->setName('Unknown Game');
                    $gameReference->setSlug('unknown-game');
                }
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Error fetching game details: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            $entityManager->persist($gameReference);
        }

        // Buscar o crear UserGame
        $userGame = $entityManager->getRepository(UserGame::class)->findOneBy([
            'user' => $user,
            'game' => $gameReference
        ]);

        if (!$userGame) {
            $userGame = new UserGame();
            $userGame->setUser($user);
            $userGame->setGame($gameReference);
            $userGame->setPlayedAt(new \DateTimeImmutable());
            $userGame->setStatus('pending');
        }

        // Cambiar el estado de favorito
        $userGame->setIsFavorite(!$userGame->isFavorite());

        $entityManager->persist($userGame);
        $entityManager->flush();

        return new JsonResponse(['isFavorite' => $userGame->isFavorite()]);
    }

    #[Route('/api/games/{id}/favorite', name: 'api_get_game_favorite_status', methods: ['GET'])]
    public function getGameFavoriteStatus(
        string $id,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $gameReference = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $id]);
        if (!$gameReference) {
            return new JsonResponse(['isFavorite' => false]);
        }

        $userGame = $entityManager->getRepository(UserGame::class)->findOneBy([
            'user' => $user,
            'game' => $gameReference
        ]);

        return new JsonResponse(['isFavorite' => $userGame ? $userGame->isFavorite() : false]);
    }
}