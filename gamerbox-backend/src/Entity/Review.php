<?php

namespace App\Entity;

use App\Repository\ReviewRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReviewRepository::class)]
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

    /**
     * @var Collection<int, ReviewComment>
     */
    #[ORM\OneToMany(targetEntity: ReviewComment::class, mappedBy: 'review')]
    private Collection $reviewComments;

    public function __construct()
    {
        $this->reviewComments = new ArrayCollection();
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
}
