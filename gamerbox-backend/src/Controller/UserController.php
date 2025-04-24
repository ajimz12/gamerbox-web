<?php

namespace App\Controller;

use App\Entity\Follow;
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

        // Campos adicionales del perfil
        $location = $request->request->get('location');
        if ($location !== null) {
            $user->setLocation($location);
        }

        $description = $request->request->get('description');
        if ($description !== null) {
            $user->setDescription($description);
        }

        $instagramProfile = $request->request->get('instagram_profile');
        if ($instagramProfile !== null) {
            $user->setInstagramProfile($instagramProfile);
        }

        $twitterProfile = $request->request->get('twitter_profile');
        if ($twitterProfile !== null) {
            $user->setTwitterProfile($twitterProfile);
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
                        : null,
                    'location' => $user->getLocation(),
                    'description' => $user->getDescription(),
                    'instagram_profile' => $user->getInstagramProfile(),
                    'twitter_profile' => $user->getTwitterProfile(),
                    'followers_count' => count($user->getFollowers()),
                    'reviews' => $user->getReviews()->toArray()
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error updating profile'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/profile/{username}', name: 'api_get_profile', methods: ['GET'])]
    public function getProfile(
        string $username,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'profilePicture' => $user->getProfilePicture()
                    ? '/uploads/profile_pictures/' . $user->getProfilePicture()
                    : null,
                'location' => $user->getLocation(),
                'description' => $user->getDescription(),
                'instagram_profile' => $user->getInstagramProfile(),
                'twitter_profile' => $user->getTwitterProfile(),
                'followers_count' => count($user->getFollowers()),
                'reviews' => $user->getReviews()->toArray()
            ]
        ]);
    }

    #[Route('/api/users', name: 'api_get_users', methods: ['GET'])]
    public function getAllUsers(
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $users = $entityManager->getRepository(User::class)->findAll();
        
        $usersData = array_map(function($user) {
            return [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'profilePicture' => $user->getProfilePicture()
                    ? '/uploads/profile_pictures/' . $user->getProfilePicture()
                    : null
            ];
        }, $users);

        return new JsonResponse([
            'users' => $usersData
        ]);
    }

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
            'success' => true,
            'isFollowing' => $isNowFollowing
        ]);
    }
}
