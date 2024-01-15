import Tile from './Tile'

class Cell {
    x: number
    y: number
    possibleTiles: Tile[] = []
    tile?: Tile
    collapsed: boolean = false

    constructor(x: number, y: number, tiles: Tile[]) {
        this.x = x
        this.y = y
        this.possibleTiles = tiles
    }

    collapse(tile: Tile) {
        this.tile = tile
        this.collapsed = true
        this.possibleTiles = [this.tile]
    }
}

export default Cell
