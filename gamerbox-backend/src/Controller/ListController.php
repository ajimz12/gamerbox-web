<?php

namespace App\Controller;

use App\Entity\ListEntity;
use App\Entity\ListItem;
use App\Entity\GameReference;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\SecurityBundle\Security;

class ListController extends AbstractController
{
    #[Route('/api/lists', name: 'api_create_list', methods: ['POST'])]
    public function createList(
        Request $request,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        try {
            $user = $security->getUser();
            if (!$user) {
                return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
            }

            $data = json_decode($request->getContent(), true);
            if (!isset($data['title']) || empty(trim($data['title']))) {
                return new JsonResponse(['error' => 'El título es requerido'], Response::HTTP_BAD_REQUEST);
            }
            
            $list = new ListEntity();
            $list->setTitle($data['title']);
            $list->setDescription($data['description'] ?? null);
            $list->setCreator($user);
            $list->setIsPublic($data['isPublic'] ?? true);
            $list->setCreatedAt(new \DateTimeImmutable());

            $entityManager->persist($list);
            
            if (isset($data['games']) && is_array($data['games'])) {
                foreach ($data['games'] as $gameData) {
                    $game = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $gameData['id']]);
                    
                    if (!$game) {
                        $game = new GameReference();
                        $game->setRawgId($gameData['id']);
                        $game->setName($gameData['name']);
                        $game->setBackgroundImage($gameData['background_image']);
                        $game->setSlug($gameData['slug']);
                        $entityManager->persist($game);
                    }
                    
                    $listItem = new ListItem();
                    $listItem->setList($list);
                    $listItem->setGame($game);
                    $entityManager->persist($listItem);
                }
            }
            
            $entityManager->flush();

            return new JsonResponse([
                'id' => $list->getId(),
                'title' => $list->getTitle(),
                'description' => $list->getDescription(),
                'isPublic' => $list->isPublic(),
                'createdAt' => $list->getCreatedAt()->format('c')
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al crear la lista: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/lists/{id}/games/{gameId}', name: 'api_add_game_to_list', methods: ['POST'])]
    public function addGameToList(
        int $id,
        string $gameId,
        Request $request,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $list = $entityManager->getRepository(ListEntity::class)->find($id);
        if (!$list || $list->getCreator() !== $user) {
            return new JsonResponse(['error' => 'Lista no encontrada o sin permisos'], Response::HTTP_NOT_FOUND);
        }

        $game = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $gameId]);
        
        if (!$game) {
            $data = json_decode($request->getContent(), true);
            $game = new GameReference();
            $game->setRawgId($gameId);
            $game->setName($data['name']);
            $game->setBackgroundImage($data['background_image']);
            $game->setSlug($data['slug']);
            $entityManager->persist($game);
        }

        $existingItem = $entityManager->getRepository(ListItem::class)->findOneBy([
            'list' => $list,
            'game' => $game
        ]);

        if (!$existingItem) {
            $listItem = new ListItem();
            $listItem->setList($list);
            $listItem->setGame($game);
            $entityManager->persist($listItem);
            $entityManager->flush();
        }

        return new JsonResponse(['message' => 'Juego añadido a la lista']);
    }

    #[Route('/api/lists/{id}/games/{gameId}', name: 'api_remove_game_from_list', methods: ['DELETE'])]
    public function removeGameFromList(
        int $id,
        string $gameId,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $list = $entityManager->getRepository(ListEntity::class)->find($id);
        if (!$list || $list->getCreator() !== $user) {
            return new JsonResponse(['error' => 'Lista no encontrada o sin permisos'], Response::HTTP_NOT_FOUND);
        }

        $game = $entityManager->getRepository(GameReference::class)->findOneBy(['rawgId' => $gameId]);
        if (!$game) {
            return new JsonResponse(['error' => 'Juego no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $listItem = $entityManager->getRepository(ListItem::class)->findOneBy([
            'list' => $list,
            'game' => $game
        ]);

        if ($listItem) {
            $entityManager->remove($listItem);
            $entityManager->flush();
        }

        return new JsonResponse(['message' => 'Juego eliminado de la lista']);
    }

    #[Route('/api/lists/{id}', name: 'api_delete_list', methods: ['DELETE'])]
    public function deleteList(
        int $id,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $list = $entityManager->getRepository(ListEntity::class)->find($id);
        if (!$list || $list->getCreator() !== $user) {
            return new JsonResponse(['error' => 'Lista no encontrada o sin permisos'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($list);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Lista eliminada']);
    }

    #[Route('/api/users/{username}/lists', name: 'api_get_user_lists', methods: ['GET'])]
    public function getUserLists(
        string $username,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);
            
            if (!$user) {
                return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
            }

            $lists = $entityManager->getRepository(ListEntity::class)->findBy(['creator' => $user]);

            $listsData = array_map(function (ListEntity $list) {
                $gamesData = array_map(function (ListItem $item) {
                    $game = $item->getGame();
                    return [
                        'id' => $game->getId(),
                        'rawgId' => $game->getRawgId(),
                        'name' => $game->getName(),
                        'backgroundImage' => $game->getBackgroundImage(),
                        'slug' => $game->getSlug()
                    ];
                }, $list->getListItems()->toArray());

                return [
                    'id' => $list->getId(),
                    'title' => $list->getTitle(),
                    'description' => $list->getDescription(),
                    'isPublic' => $list->isPublic(),
                    'createdAt' => $list->getCreatedAt()->format('c'),
                    'creator' => [
                        'id' => $list->getCreator()->getId(),
                        'username' => $list->getCreator()->getUsername(),
                        'profilePicture' => $list->getCreator()->getProfilePicture()
                    ],
                    'games' => $gamesData
                ];
            }, $lists);

            return new JsonResponse(['lists' => $listsData]);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al obtener las listas: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/lists', name: 'api_get_lists', methods: ['GET'])]
    public function getLists(
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $lists = $entityManager->getRepository(ListEntity::class)->findBy(['isPublic' => true]);

            $listsData = array_map(function (ListEntity $list) {
                $gamesData = array_map(function (ListItem $item) {
                    $game = $item->getGame();
                    return [
                        'id' => $game->getId(),
                        'rawgId' => $game->getRawgId(),
                        'name' => $game->getName(),
                        'backgroundImage' => $game->getBackgroundImage(),
                        'slug' => $game->getSlug()
                    ];
                }, $list->getListItems()->toArray());

                return [
                    'id' => $list->getId(),
                    'title' => $list->getTitle(),
                    'description' => $list->getDescription(),
                    'isPublic' => $list->isPublic(),
                    'createdAt' => $list->getCreatedAt()->format('c'),
                    'creator' => [
                        'id' => $list->getCreator()->getId(),
                        'username' => $list->getCreator()->getUsername(),
                        'profilePicture' => $list->getCreator()->getProfilePicture()
                    ],
                    'games' => $gamesData
                ];
            }, $lists);

            return new JsonResponse(['lists' => $listsData]);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error al obtener las listas: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/api/lists/{id}', name: 'api_get_list_details', methods: ['GET'])]
    public function getListDetails(
        int $id,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        $list = $entityManager->getRepository(ListEntity::class)->find($id);
        if (!$list) {
            return new JsonResponse(['error' => 'Lista no encontrada'], Response::HTTP_NOT_FOUND);
        }

        if (!$list->isPublic() && $list->getCreator() !== $security->getUser()) {
            return new JsonResponse(['error' => 'No tienes permiso para ver esta lista'], Response::HTTP_FORBIDDEN);
        }

        $gamesData = array_map(function (ListItem $item) {
            $game = $item->getGame();
            return [
                'id' => $game->getId(),
                'rawgId' => $game->getRawgId(),
                'name' => $game->getName(),
                'backgroundImage' => $game->getBackgroundImage()
            ];
        }, $list->getListItems()->toArray());

        return new JsonResponse([
            'id' => $list->getId(),
            'title' => $list->getTitle(),
            'description' => $list->getDescription(),
            'isPublic' => $list->isPublic(),
            'createdAt' => $list->getCreatedAt()->format('c'),
            'creator' => [
                'id' => $list->getCreator()->getId(),
                'username' => $list->getCreator()->getUsername()
            ],
            'games' => $gamesData
        ]);
    }

    #[Route('/api/lists/{id}', name: 'api_update_list', methods: ['PUT'])]
    public function updateList(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse {
        try {
            $user = $security->getUser();
            if (!$user) {
                return new JsonResponse(['error' => 'Usuario no autenticado'], Response::HTTP_UNAUTHORIZED);
            }

            $list = $entityManager->getRepository(ListEntity::class)->find($id);
            if (!$list || $list->getCreator() !== $user) {
                return new JsonResponse(['error' => 'Lista no encontrada o sin permisos'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            if (!isset($data['title']) || empty(trim($data['title']))) {
                return new JsonResponse(['error' => 'El título es requerido'], Response::HTTP_BAD_REQUEST);
            }

            $list->setTitle($data['title']);
            $list->setDescription($data['description'] ?? $list->getDescription());
            $list->setIsPublic($data['isPublic'] ?? $list->isPublic());

            $entityManager->flush();

            return new JsonResponse([
                'id' => $list->getId(),
                'title' => $list->getTitle(),
                'description' => $list->getDescription(),
                'isPublic' => $list->isPublic(),
                'createdAt' => $list->getCreatedAt()->format('c'),
                'creator' => [
                    'id' => $list->getCreator()->getId(),
                    'username' => $list->getCreator()->getUsername()
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error al actualizar la lista: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}