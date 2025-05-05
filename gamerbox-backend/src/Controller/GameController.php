<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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

        $query = [
            'key' => $this->rawgApiKey,
            'page' => $page,
            'page_size' => $pageSize
        ];

        if ($search) {
            $query['search'] = $search;
        }

        if ($genres) {
            $query['genres'] = $genres;
        }

        $response = $this->client->request('GET', 'https://api.rawg.io/api/games', [
            'query' => $query,
        ]);

        $data = $response->toArray();
        return $this->json($data);
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
}