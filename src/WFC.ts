import p5 from 'p5'
import Cell from './Cell'
import Tile from './Tile'

class WFC {
    p: p5

    cells: Cell[] = []

    constructor(p: p5, dimension: number, tiles: Tile[]) {
        this.p = p

        this.p.randomSeed(1)

        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                let cell = new Cell(i, j, tiles)
                this.cells.push(cell)
            }
        }
    }

    iterate() {
        const cell = this.getCellWithMinimumTiles()
        // choose center cell
        // const cell = this.cells[Math.floor(this.cells.length / 2)]

        if (cell) {
            const tile = cell.possibleTiles[Math.floor(this.p.random(cell.possibleTiles.length))]
            cell.collapse(tile)
            this.propagate(cell)
        }
    }

    propagate(cell: Cell) {
        const neighborCells = this.getNeighborCells(cell)

        // console.log(neighborCells)

        for (const neighborCell of neighborCells) {
            if (neighborCell.cell.collapsed) {
                continue
            }

            const finalPossibleTiles: Tile[] = []
            
            for (const tile of cell.possibleTiles) {
                if (!tile) {
                    console.log(cell)
                }
                for (const possibleTile of neighborCell.cell.possibleTiles) {
                    if (possibleTile.isCompatibleWith(tile, neighborCell.direction)) {
                        finalPossibleTiles.push(possibleTile)
                    }
                }
            }
            
            neighborCell.cell.possibleTiles = finalPossibleTiles
        }
    }

    getNeighborCells(cell: Cell) {
        let neighbors: { cell: Cell; direction: string }[] = []

        // North
        if (cell.y > 0) {
            let neighbor = this.cells.find((c) => c.x === cell.x && c.y === cell.y - 1)
            if (neighbor) {
                neighbors.push({ cell: neighbor, direction: 'n' })
            }
        }

        // East
        if (cell.x < this.p.width - 1) {
            let neighbor = this.cells.find((c) => c.x === cell.x + 1 && c.y === cell.y)
            if (neighbor) {
                neighbors.push({ cell: neighbor, direction: 'e' })
            }
        }

        // South
        if (cell.y < this.p.height - 1) {
            let neighbor = this.cells.find((c) => c.x === cell.x && c.y === cell.y + 1)
            if (neighbor) {
                neighbors.push({ cell: neighbor, direction: 's' })
            }
        }

        // West
        if (cell.x > 0) {
            let neighbor = this.cells.find((c) => c.x === cell.x - 1 && c.y === cell.y)
            if (neighbor) {
                neighbors.push({ cell: neighbor, direction: 'w' })
            }
        }

        return neighbors
    }

    getCellWithMinimumTiles() {
        let min = 9999
        let minCell: Cell | null = null

        // copy and reorder the cell array randomly, use p5 random
        let cells = this.cells.slice()
        cells.sort(() => this.p.random(-1, 1))

        // Find the cell with the minimum number of tiles
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i]

            // if not collapsed and less than min
            if (!cell.collapsed && cell.possibleTiles.length < min) {
                min = cell.possibleTiles.length
                minCell = cell
            }
        }

        return minCell
    }

    isDone() {
        return this.cells.every((cell) => cell.collapsed)
    }
}

export default WFC
