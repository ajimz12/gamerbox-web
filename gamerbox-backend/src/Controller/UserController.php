<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class UserController extends AbstractController
{
    #[Route('/api/profile/update', name: 'api_profile_update', methods: ['POST'])]
    public function updateProfile(
        Request $request,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Campo username desde form-data
        $newUsername = $request->request->get('username');
        if ($newUsername) {
            $user->setUsername($newUsername);
        }

        // Imagen
        $profilePicture = $request->files->get('profilePicture');
        if ($profilePicture) {
            $extension = $profilePicture->guessExtension();
            $safeFilename = $slugger->slug($user->getUsername());
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $extension;

            try {
                $profilePicture->move(
                    $this->getParameter('profile_pictures_directory'),
                    $newFilename
                );

                $oldPicture = $user->getProfilePicture();
                if ($oldPicture) {
                    $oldPicturePath = $this->getParameter('profile_pictures_directory') . '/' . $oldPicture;
                    if (file_exists($oldPicturePath)) {
                        unlink($oldPicturePath);
                    }
                }

                $user->setProfilePicture($newFilename);
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Error uploading profile picture'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        try {
            $entityManager->flush();

            return new JsonResponse([
                'message' => 'Profile updated successfully',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'profilePicture' => $user->getProfilePicture()
                        ? '/uploads/profile_pictures/' . $user->getProfilePicture()
                        : null
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error updating profile'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
