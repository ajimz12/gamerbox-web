<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FollowController extends AbstractController
{
    #[Route('/api/follow/{id}', name: 'api_follow_user', methods: ['POST'])]
    public function followUser(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $userToFollow = $entityManager->getRepository(User::class)->find($id);
        
        if (!$userToFollow) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        if ($currentUser === $userToFollow) {
            return new JsonResponse(['error' => 'No puedes seguirte a ti mismo'], Response::HTTP_BAD_REQUEST);
        }

        $existingFollow = $entityManager->getRepository(Follow::class)->findOneBy([
            'follower' => $currentUser,
            'followed' => $userToFollow
        ]);

        if ($existingFollow) {
            $entityManager->remove($existingFollow);
            $isNowFollowing = false;
        } else {
            $follow = new Follow();
            $follow->setFollower($currentUser);
            $follow->setFollowed($userToFollow);
            $follow->setCreatedAt(new \DateTimeImmutable());
            $entityManager->persist($follow);
            $isNowFollowing = true;
        }

        $entityManager->flush();

        return new JsonResponse([
            'message' => $isNowFollowing ? 'Usuario seguido exitosamente' : 'Usuario dejado de seguir exitosamente',
            'isFollowing' => $isNowFollowing
        ]);
    }
}