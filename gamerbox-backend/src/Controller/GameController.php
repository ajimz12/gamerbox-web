<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
    public function index(): JsonResponse
    {
        $response = $this->client->request('GET', 'https://api.rawg.io/api/games', [
            'query' => [
                'key' => $this->rawgApiKey,
            ],
        ]);

        $data = $response->toArray();

        return $this->json($data);
    }
}
