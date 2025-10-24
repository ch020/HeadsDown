import { create } from 'zustand'
import { db, Pack } from './db'
import { v4 as uuid } from 'uuid'

const ANIMALS: string[] = [
  "Elephant","Tiger","Penguin","Giraffe","Kangaroo","Panda","Koala","Dolphin","Shark","Octopus",
  "Lion","Cheetah","Zebra","Rhinoceros","Hippopotamus","Crocodile","Eagle","Owl","Parrot","Peacock",
  "Flamingo","Swan","Duck","Goose","Turkey","Chicken","Cow","Sheep","Goat","Pig",
  "Horse","Donkey","Camel","Llama","Alpaca","Bear","Wolf","Fox","Raccoon","Squirrel",
  "Rabbit","Hedgehog","Badger","Otter","Seal","Walrus","Polar Bear","Moose","Deer","Bison",
  "Buffalo","Chimpanzee","Gorilla","Orangutan","Lemur","Meerkat","Prairie Dog","Beaver","Skunk","Armadillo",
  "Iguana","Chameleon","Gecko","Tortoise","Turtle","Frog","Toad","Butterfly","Bee","Wasp",
  "Ant","Spider","Scorpion","Snail","Slug","Crab","Lobster","Shrimp","Starfish","Jellyfish",
  "Manta Ray","Seahorse","Goldfish","Salmon","Trout","Carp","Pufferfish","Herring","Mackerel","Swordfish",
  "Hawk","Falcon","Vulture","Woodpecker","Hummingbird","Crow","Raven","Magpie","Pigeon","Sparrow"
]

type PacksState = {
  list: Pack[]
  load: () => Promise<void>
  add: (p: Pack) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const usePacks = create<PacksState>((set, get) => ({
  list: [],
  load: async () => {
    let all = await db.packs.toArray()
    if (all.length === 0) {
      const seed: Pack = {id: uuid(), name: "Animals", source: 'manual', items: ANIMALS, preview: ANIMALS.slice(0, 3)}
      await db.packs.put(seed)
      all = [seed]
    }
    set({ list: all })
  },
  add: async (p) => {
    await db.packs.put(p)
    const list = [...(get().list.filter(x => x.id !== p.id)), p]
    set({ list })
  },
  remove: async (id) => {
    await db.packs.delete(id)
    set({ list: get().list.filter(x => x.id !== id) })
  }
}))
