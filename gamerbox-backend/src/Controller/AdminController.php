<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Review;
use App\Entity\ReviewComment;
use App\Entity\ListEntity;
use App\Repository\ListEntityRepository;
use App\Repository\ListItemRepository;
use App\Repository\ReviewRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/stats', name: 'admin_stats', methods: ['GET'])]
    public function getStats(
        UserRepository $userRepository,
        ReviewRepository $reviewRepository,
        ListEntityRepository $listEntityRepository
    ): JsonResponse {
        $userCount = count($userRepository->findAll());
        $reviewCount = count($reviewRepository->findAll());
        $listCount = count($listEntityRepository->findAll());

        return new JsonResponse([
            'totalUsers' => $userCount,
            'totalReviews' => $reviewCount,
            'totalLists' => $listCount,
        ]);
    }



    #[Route('/users/{id}/ban', name: 'admin_ban_user', methods: ['POST'])]
    public function banUser(User $userToBan): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        if ($currentUser->getId() === $userToBan->getId()) {
            return new JsonResponse(['error' => 'No puedes banearte a ti mismo.'], Response::HTTP_FORBIDDEN);
        }
        // Optional: Check if userToBan is also an admin
        // if (in_array('ROLE_ADMIN', $userToBan->getRoles())) {
        //     return new JsonResponse(['error' => 'No puedes banear a otro administrador.'], Response::HTTP_FORBIDDEN);
        // }

        $userToBan->setBanned(true);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Usuario baneado con éxito.']);
    }

    #[Route('/users/{id}/unban', name: 'admin_unban_user', methods: ['POST'])]
    public function unbanUser(User $userToUnban): JsonResponse
    {
        $userToUnban->setBanned(false);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Usuario desbaneado con éxito.']);
    }

    #[Route('/reviews/{id}/delete', name: 'admin_delete_review', methods: ['DELETE'])]
    public function deleteReview(Review $review): JsonResponse
    {
        $this->entityManager->remove($review);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Reseña eliminada con éxito.'], Response::HTTP_NO_CONTENT);
    }

    #[Route('/comments/{id}/delete', name: 'admin_delete_comment', methods: ['DELETE'])]
    public function deleteComment(ReviewComment $comment): JsonResponse
    {
        $this->entityManager->remove($comment);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Comentario eliminado con éxito.'], Response::HTTP_NO_CONTENT);
    }

    #[Route('/lists/{id}/delete', name: 'admin_delete_list', methods: ['DELETE'])]
    public function deleteList(ListEntity $listEntity): JsonResponse
    {
        $this->entityManager->remove($listEntity);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Lista eliminada con éxito.'], Response::HTTP_NO_CONTENT);
    }

    #[Route('/users/{id}/promote', name: 'admin_promote_user', methods: ['POST'])]
    public function promoteUser(User $userToPromote): JsonResponse
    {
        $roles = $userToPromote->getRoles();
        if (!in_array('ROLE_ADMIN', $roles)) {
            $roles[] = 'ROLE_ADMIN';
            $userToPromote->setRoles(array_unique($roles));
            $this->entityManager->flush();
            return new JsonResponse(['message' => 'Usuario ascendido a administrador con éxito.']);
        }
        return new JsonResponse(['message' => 'El usuario ya es administrador.'], Response::HTTP_OK);
    }

    #[Route('/users/{id}/demote', name: 'admin_demote_user', methods: ['POST'])]
    public function demoteUser(User $userToDemote): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        if ($currentUser->getId() === $userToDemote->getId()) {
            return new JsonResponse(['error' => 'No puedes degradarte a ti mismo.'], Response::HTTP_FORBIDDEN);
        }

        $roles = $userToDemote->getRoles();
        if (in_array('ROLE_ADMIN', $roles)) {
            $newRoles = array_filter($roles, fn($role) => $role !== 'ROLE_ADMIN');
            // Ensure user always has at least ROLE_USER
            if (empty($newRoles)) {
                $newRoles[] = 'ROLE_USER';
            }
            $userToDemote->setRoles($newRoles);
            $this->entityManager->flush();
            return new JsonResponse(['message' => 'Administrador degradado a usuario con éxito.']);
        }
        return new JsonResponse(['message' => 'El usuario no es administrador.'], Response::HTTP_OK);
    }
}
