import Tile from './Tile'

class Cell {
    x: number
    y: number
    possibleTiles: Tile[] = []
    tile?: Tile
    collapsed: boolean = false

    history: { possibleTiles: Tile[]; tile?: Tile; collapsed: boolean }[] = []

    constructor(x: number, y: number, tiles: Tile[]) {
        this.x = x
        this.y = y
        this.possibleTiles = tiles

        this.history.push({ possibleTiles: this.possibleTiles, tile: this.tile, collapsed: this.collapsed })
    }

    save() {
        this.history.push({ possibleTiles: this.possibleTiles, tile: this.tile, collapsed: this.collapsed })
    }

    reset(lastNum?: number) {
        if (!lastNum) {
            const last = this.history.pop()

            if (last) {
                this.possibleTiles = last.possibleTiles
                this.tile = last.tile
                this.collapsed = last.collapsed
            }

            return
        }

        const index = this.history.length - lastNum - 1
        
        if (index < 0) {
            return
        }

        const last = this.history[index]

        if (last) {
            this.possibleTiles = last.possibleTiles
            this.tile = last.tile
            this.collapsed = last.collapsed
        }

        this.history = this.history.slice(0, index + 1)
    }

    collapse(tile: Tile) {
        this.save()

        this.tile = tile
        this.collapsed = true
        this.possibleTiles = [this.tile]
    }

    setPossibleTiles(tiles: Tile[]) {
        this.save()

        this.possibleTiles = tiles
    }
}

export default Cell
