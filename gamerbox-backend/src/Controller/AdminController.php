<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Review;
use App\Entity\ListEntity;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class AdminController extends AbstractController
{
    private function isAdmin(EntityManagerInterface $entityManager): bool
    {
        $user = $this->getUser();
        if (!$user) {
            return false;
        }

        $freshUser = $entityManager->getRepository(User::class)->find($user->id);
        if (!$freshUser) {
            return false;
        }
        return in_array('ROLE_ADMIN', $freshUser->getRoles());
    }

    #[Route('/api/admin/stats', name: 'api_admin_stats', methods: ['GET'])]
    public function getStats(EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$this->isAdmin($entityManager)) {
            return new JsonResponse(['error' => 'Acceso denegado'], Response::HTTP_FORBIDDEN);
        }

        $userCount = $entityManager->getRepository(User::class)->count([]);
        $reviewCount = $entityManager->getRepository(Review::class)->count([]);
        $listCount = $entityManager->getRepository(ListEntity::class)->count([]);

        return new JsonResponse([
            'stats' => [
                'totalUsers' => $userCount,
                'totalReviews' => $reviewCount,
                'totalLists' => $listCount
            ]
        ]);
    }

    #[Route('/api/admin/users', name: 'api_admin_users', methods: ['GET'])]
    public function getUsers(EntityManagerInterface $entityManager): JsonResponse
    {
        $users = $entityManager->getRepository(User::class)->findAll();
        $usersData = array_map(function($user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles(),
                'isBanned' => in_array('ROLE_BANNED', $user->getRoles()),
                'createdAt' => $user->getCreatedAt()->format('c')
            ];
        }, $users);

        return new JsonResponse(['users' => $usersData]);
    }

    #[Route('/api/admin/users/{id}/ban', name: 'api_admin_ban_user', methods: ['POST'])]
    public function banUser(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $roles = $user->getRoles();
        if (!in_array('ROLE_BANNED', $roles)) {
            $roles[] = 'ROLE_BANNED';
            $user->setRoles($roles);
            $entityManager->flush();
        }

        return new JsonResponse(['message' => 'Usuario baneado exitosamente']);
    }

    #[Route('/api/admin/users/{id}/unban', name: 'api_admin_unban_user', methods: ['POST'])]
    public function unbanUser(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $roles = array_diff($user->getRoles(), ['ROLE_BANNED']);
        $user->setRoles($roles);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Usuario desbaneado exitosamente']);
    }

    #[Route('/api/admin/reviews/{id}', name: 'api_admin_delete_review', methods: ['DELETE'])]
    public function deleteReview(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $review = $entityManager->getRepository(Review::class)->find($id);
        
        if (!$review) {
            return new JsonResponse(['error' => 'Reseña no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($review);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Reseña eliminada exitosamente']);
    }

    #[Route('/api/admin/lists/{id}', name: 'api_admin_delete_list', methods: ['DELETE'])]
    public function deleteList(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $list = $entityManager->getRepository(ListEntity::class)->find($id);
        
        if (!$list) {
            return new JsonResponse(['error' => 'Lista no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($list);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Lista eliminada exitosamente']);
    }
}