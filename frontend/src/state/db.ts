import Dexie, {Table} from "dexie";

export interface Player { id: string; name: string }
export interface Pack { id: string; name: string; source: 'manual'|'ai'; items: string[]; preview: string[] }
export interface ItemResult { word: string; status: 'correct'|'skipped' }
export interface Round { playerId: string; packId: string; itemsShown: ItemResult[]; score: number; durationMs: number }
export interface Game { id: string; players: Player[]; rounds: Round[]; settings: { roundMs: number; roundsPerPlayer: number } }

export class DB extends Dexie {
    packs!: Table<Pack, string>
    games!: Table<Game, string>
    constructor() {
        super('heads-down-db')
        this.version(1).stores({
            packs: 'id,name',
            games: 'id'
        })
    }
}
export const db = new DB()