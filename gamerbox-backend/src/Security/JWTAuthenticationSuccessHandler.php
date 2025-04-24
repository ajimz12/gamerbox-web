<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use App\Entity\User;

class JWTAuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        $user = $token->getUser();
        
        $payload = [
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
        ];
        
        $jwt = $this->jwtManager->createFromPayload($user, $payload);

        $data = [
            'user' => [
                'email' => $user->getUserIdentifier(),
                'username' => $user instanceof User ? $user->getUsername() : null,
                'profilePicture' => $user instanceof User && $user->getProfilePicture() 
                    ? '/uploads/profile_pictures/' . $user->getProfilePicture() 
                    : null,
                'location' => $user instanceof User ? $user->getLocation() : null,
                'instagram_profile' => $user instanceof User ? $user->getInstagramProfile() : null,
                'twitter_profile' => $user instanceof User ? $user->getTwitterProfile() : null,
                'description' => $user instanceof User ? $user->getDescription() : null,
                'followers_count' => $user instanceof User ? count($user->getFollowers()) : 0,
                'reviews' => $user instanceof User ? $user->getReviews()->toArray() : []
            ]
        ];

        return new JWTAuthenticationSuccessResponse($jwt, $data);
    }
}