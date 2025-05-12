<?php

namespace App\Entity;

use App\Repository\ReviewRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReviewRepository::class)]
#[ORM\UniqueConstraint(
    name: "unique_user_game_review",
    columns: ["author_id", "game_id"]
)]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'reviews')]
    private ?User $author = null;

    #[ORM\ManyToOne(inversedBy: 'reviews')]
    private ?GameReference $game = null;

    #[ORM\Column]
    private ?int $rating = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $text = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: "boolean", options: ["default" => false])]
    private bool $playedBefore = false;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    private ?\DateTimeImmutable $playedAt = null;

    /**
     * @var Collection<int, ReviewComment>
     */
    #[ORM\OneToMany(targetEntity: ReviewComment::class, mappedBy: 'review')]
    private Collection $reviewComments;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: 'review_likes')]
    private Collection $likes;

    public function __construct()
    {
        $this->reviewComments = new ArrayCollection();
        $this->likes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function getGame(): ?GameReference
    {
        return $this->game;
    }

    public function setGame(?GameReference $game): static
    {
        $this->game = $game;

        return $this;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(int $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function isPlayedBefore(): bool
    {
        return $this->playedBefore;
    }

    public function setPlayedBefore(bool $playedBefore): static
    {
        $this->playedBefore = $playedBefore;
        return $this;
    }

    public function getPlayedAt(): ?\DateTimeImmutable
    {
        return $this->playedAt;
    }

    public function setPlayedAt(?\DateTimeImmutable $playedAt): static
    {
        $this->playedAt = $playedAt;
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
            $reviewComment->setReview($this);
        }

        return $this;
    }

    public function removeReviewComment(ReviewComment $reviewComment): static
    {
        if ($this->reviewComments->removeElement($reviewComment)) {
            // set the owning side to null (unless already changed)
            if ($reviewComment->getReview() === $this) {
                $reviewComment->setReview(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(User $user): static
    {
        if (!$this->likes->contains($user)) {
            $this->likes->add($user);
        }

        return $this;
    }

    public function removeLike(User $user): static
    {
        $this->likes->removeElement($user);

        return $this;
    }

    public function hasLiked(User $user): bool
    {
        return $this->likes->contains($user);
    }
}
