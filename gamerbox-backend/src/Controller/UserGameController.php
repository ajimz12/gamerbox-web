<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserGame;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserGameController extends AbstractController
{
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
}