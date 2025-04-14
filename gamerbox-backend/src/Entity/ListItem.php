<?php

namespace App\Entity;

use App\Repository\ListItemRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListItemRepository::class)]
class ListItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'listItems')]
    private ?ListEntity $list = null;

    #[ORM\ManyToOne(inversedBy: 'listItems')]
    private ?GameReference $game = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getList(): ?ListEntity
    {
        return $this->list;
    }

    public function setList(?ListEntity $list): static
    {
        $this->list = $list;

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
}
