import Tile from './Tile'

class Cell {
    x: number
    y: number
    possibleTiles: Tile[] = []
    tile?: Tile
    collapsed: boolean = false

    lastState: { possibleTiles: Tile[]; tile?: Tile; collapsed: boolean }

    constructor(x: number, y: number, tiles: Tile[]) {
        this.x = x
        this.y = y
        this.possibleTiles = tiles

        this.lastState = { possibleTiles: this.possibleTiles, tile: this.tile, collapsed: this.collapsed }
    }

    save() {
        this.lastState = { possibleTiles: this.possibleTiles, tile: this.tile, collapsed: this.collapsed }
    }

    reset() {
        this.possibleTiles = this.lastState.possibleTiles
        this.tile = this.lastState.tile
        this.collapsed = this.lastState.collapsed
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
