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

        if ($user instanceof User && $user->isBanned()) {
            throw new \Symfony\Component\Security\Core\Exception\AuthenticationException('Tu cuenta ha sido suspendida.');
        }

        $payload = [
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
        ];

        $jwt = $this->jwtManager->createFromPayload($user, $payload);

        $data = [
            'token' => $jwt,
            'user' => [
                'id' => $user instanceof User ? $user->getId() : null,
                'email' => $user->getUserIdentifier(),
                'username' => $user instanceof User ? $user->getUsername() : null,
                'profilePicture' => $user instanceof User && $user->getProfilePicture()
                    ? '/uploads/profile_pictures/' . $user->getProfilePicture()
                    : null,
                'location' => $user instanceof User ? $user->getLocation() : null,
                'instagram_profile' => $user instanceof User ? $user->getInstagramProfile() : null,
                'twitter_profile' => $user instanceof User ? $user->getTwitterProfile() : null,
                'description' => $user instanceof User ? $user->getDescription() : null,
                "followers" => $user instanceof User ? $user->getFollowers()->toArray() : [],
                "following" => $user instanceof User ? $user->getFollowing()->toArray() : [],
                'reviews' => $user instanceof User ? $user->getReviews()->toArray() : [],
                'roles' => $user->getRoles(),
                'banned' => $user instanceof User ? $user->isBanned() : false
            ]
        ];

        return new JWTAuthenticationSuccessResponse($jwt, $data);
    }
}
