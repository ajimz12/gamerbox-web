<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 180, nullable: true)]
    #[Groups(['user:read'])]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read'])]
    private ?string $profilePicture = null;

    /**
     * @var Collection<int, Review>
     */
    #[ORM\OneToMany(targetEntity: Review::class, mappedBy: 'author')]
    private Collection $reviews;

    /**
     * @var Collection<int, ListEntity>
     */
    #[ORM\OneToMany(targetEntity: ListEntity::class, mappedBy: 'creator')]
    private Collection $listEntities;

    /**
     * @var Collection<int, UserGame>
     */
    #[ORM\OneToMany(targetEntity: UserGame::class, mappedBy: 'user')]
    private Collection $userGames;

    /**
     * @var Collection<int, Follow>
     */
    #[ORM\OneToMany(targetEntity: Follow::class, mappedBy: 'follower')]
    private Collection $follows;

    /**
     * @var Collection<int, ReviewComment>
     */
    #[ORM\OneToMany(targetEntity: ReviewComment::class, mappedBy: 'author')]
    private Collection $reviewComments;

    public function __construct()
    {
        $this->reviews = new ArrayCollection();
        $this->listEntities = new ArrayCollection();
        $this->userGames = new ArrayCollection();
        $this->follows = new ArrayCollection();
        $this->reviewComments = new ArrayCollection();
        $this->roles = ['ROLE_USER']; // Set default role
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setAuthor($this);
        }

        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getAuthor() === $this) {
                $review->setAuthor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ListEntity>
     */
    public function getListEntities(): Collection
    {
        return $this->listEntities;
    }

    public function addListEntity(ListEntity $listEntity): static
    {
        if (!$this->listEntities->contains($listEntity)) {
            $this->listEntities->add($listEntity);
            $listEntity->setCreator($this);
        }

        return $this;
    }

    public function removeListEntity(ListEntity $listEntity): static
    {
        if ($this->listEntities->removeElement($listEntity)) {
            // set the owning side to null (unless already changed)
            if ($listEntity->getCreator() === $this) {
                $listEntity->setCreator(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserGame>
     */
    public function getUserGames(): Collection
    {
        return $this->userGames;
    }

    public function addUserGame(UserGame $userGame): static
    {
        if (!$this->userGames->contains($userGame)) {
            $this->userGames->add($userGame);
            $userGame->setUser($this);
        }

        return $this;
    }

    public function removeUserGame(UserGame $userGame): static
    {
        if ($this->userGames->removeElement($userGame)) {
            // set the owning side to null (unless already changed)
            if ($userGame->getUser() === $this) {
                $userGame->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Follow>
     */
    public function getFollows(): Collection
    {
        return $this->follows;
    }

    public function addFollow(Follow $follow): static
    {
        if (!$this->follows->contains($follow)) {
            $this->follows->add($follow);
            $follow->setFollower($this);
        }

        return $this;
    }

    public function removeFollow(Follow $follow): static
    {
        if ($this->follows->removeElement($follow)) {
            // set the owning side to null (unless already changed)
            if ($follow->getFollower() === $this) {
                $follow->setFollower(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ReviewComment>
     */
    public function getReviewComments(): Collection
    {
        return $this->reviewComments;
    }

    public function addReviewComment(ReviewComment $reviewComment): static
    {
        if (!$this->reviewComments->contains($reviewComment)) {
            $this->reviewComments->add($reviewComment);
            $reviewComment->setAuthor($this);
        }

        return $this;
    }

    public function removeReviewComment(ReviewComment $reviewComment): static
    {
        if ($this->reviewComments->removeElement($reviewComment)) {
            // set the owning side to null (unless already changed)
            if ($reviewComment->getAuthor() === $this) {
                $reviewComment->setAuthor(null);
            }
        }

        return $this;
    }

    // Add these new getter and setter methods after the existing ones
    public function getUsername(): ?string
    {
        return $this->username ?? $this->email;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;
        return $this;
    }

    public function getProfilePicture(): ?string
    {
        return $this->profilePicture;
    }

    public function setProfilePicture(?string $profilePicture): static
    {
        $this->profilePicture = $profilePicture;
        return $this;
    }
}
