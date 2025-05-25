<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\User;
use App\Repository\FollowRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FollowController extends AbstractController
{
    public function __construct(
        private FollowRepository $followRepository,
        private UserRepository $userRepository
    ) {}

    #[Route('/api/follow/{id}', name: 'api_follow_user', methods: ['POST'])]
    public function followUser(int $id): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $userToFollow = $this->userRepository->find($id);
        
        if (!$userToFollow) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        if ($currentUser === $userToFollow) {
            return new JsonResponse(['error' => 'No puedes seguirte a ti mismo'], Response::HTTP_BAD_REQUEST);
        }

        $existingFollow = $this->followRepository->findOneByUsers($currentUser, $userToFollow);

        if ($existingFollow) {
            $this->followRepository->remove($existingFollow);
            $isNowFollowing = false;
        } else {
            $follow = new Follow();
            $follow->setFollower($currentUser);
            $follow->setFollowed($userToFollow);
            $follow->setCreatedAt(new \DateTimeImmutable());
            $this->followRepository->save($follow);
            $isNowFollowing = true;
        }

        return new JsonResponse([
            'message' => $isNowFollowing ? 'Usuario seguido exitosamente' : 'Usuario dejado de seguir exitosamente',
            'isFollowing' => $isNowFollowing
        ]);
    }
}