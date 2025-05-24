<?php

namespace App\Controller;

use ApiPlatform\OpenApi\Model\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    private $client;
    private $rawgApiKey;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
        $this->rawgApiKey = $_ENV['RAWG_API_KEY'];
    }

    #[Route('/api/games', name: 'api_games')]
    public function index(Request $request): JsonResponse
    {
        $page = $request->query->get('page', 1);
        $pageSize = $request->query->get('page_size', 20);
        $search = $request->query->get('search');
        $genres = $request->query->get('genres');
        $platforms = $request->query->get('parent_platforms');
        $dates = $request->query->get('dates');
        $ordering = $request->query->get('ordering', '-metacritic');

        $query = [
            'key' => $this->rawgApiKey,
            'page' => $page,
            'page_size' => $pageSize,
            'ordering' => $ordering
        ];

        if ($search) {
            $query['search'] = $search;
        }

        if ($genres) {
            $query['genres'] = $genres;
        }

        if ($platforms) {
            $query['parent_platforms'] = $platforms;
        }

        if ($dates) {
            $query['dates'] = $dates;
        }

        $response = $this->client->request('GET', 'https://api.rawg.io/api/games', [
            'query' => $query,
        ]);

        $data = $response->toArray(); // $data aquí contendrá el campo "count"
        return $this->json($data); // Se devuelve la respuesta completa, incluyendo "count"
    }

    #[Route('/api/games/{id}', name: 'api_game_details')]
    public function getGameDetails(string $id): JsonResponse
    {
        $response = $this->client->request('GET', "https://api.rawg.io/api/games/{$id}", [
            'query' => [
                'key' => $this->rawgApiKey,
            ],
        ]);

        $data = $response->toArray();
        return $this->json($data);
    }

    #[Route('/api/games/{id}/screenshots', name: 'api_game_screenshots')]
    public function getGameScreenshots(string $id): JsonResponse
    {
        $response = $this->client->request('GET', "https://api.rawg.io/api/games/{$id}/screenshots", [
            'query' => [
                'key' => $this->rawgApiKey,
            ],
        ]);

        $data = $response->toArray();
        return $this->json($data);
    }

    #[Route('/api/genres', name: 'api_genres')]
    public function getGenres(): JsonResponse
    {
        $response = $this->client->request('GET', 'https://api.rawg.io/api/genres', [
            'query' => [
                'key' => $this->rawgApiKey,
            ],
        ]);

        $data = $response->toArray();
        return $this->json($data);
    }

    #[Route('/api/platforms', name: 'api_platforms')]
    public function getPlatforms(): JsonResponse
    {
        $response = $this->client->request('GET', 'https://api.rawg.io/api/platforms/lists/parents', [
            'query' => [
                'key' => $this->rawgApiKey,
            ],
        ]);

        $data = $response->toArray();
        return $this->json($data);
    }

    public function searchGames(Request $request): JsonResponse
    {
        $search = $request->query->get('search', '');
        $platforms = $request->query->get('platforms');
        $genres = $request->query->get('genres');
        $dates = $request->query->get('dates');
        $ordering = $request->query->get('ordering', '-rating');
        $page = $request->query->get('page', 1);
        $page_size = $request->query->get('page_size', 20);

        $query = [
            'key' => $this->rawgApiKey,
            'page_size' => $page_size,
            'page' => $page,
            'ordering' => $ordering
        ];

        if ($search) {
            $query['search'] = trim($search);
            $query['search_precise'] = true;
        }

        if ($genres) {
            $query['genres'] = $genres;
        }

        if ($platforms) {
            $query['parent_platforms'] = $platforms;
        }

        if ($dates) {
            $query['dates'] = $dates;
        }

        try {
            $response = $this->client->request('GET', 'https://api.rawg.io/api/games', [
                'query' => $query,
            ]);

            $data = $response->toArray();
            
            // Añadir caché para resultados frecuentes
            $cacheKey = md5(json_encode($query));
            $cache = new FilesystemAdapter();
            
            if (!$cache->getItem($cacheKey)->isHit()) {
                $cacheItem = $cache->getItem($cacheKey);
                $cacheItem->set($data);
                $cacheItem->expiresAfter(3600); // Cache for 1 hour
                $cache->save($cacheItem);
            }

            return $this->json($data);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al buscar juegos'], 500);
        }
    }
}