import p5 from 'p5'
import image_blank from './tiles/blank.png'
import image_up from './tiles/up.png'
import image_right from './tiles/right.png'
import image_down from './tiles/down.png'
import image_left from './tiles/left.png'
import Tile from './Tile'
import Cell from './Cell'

let tiles: Tile[] = []
const images: p5.Image[] = []
let grid: { collapsed: boolean, options: number[] }[] = []
const DIM = 4

function removeDuplicatedTiles(tiles: Tile[]) {
    const uniqueTilesMap: { [key: string]: Tile } = {}

    for (const tile of tiles) {
        const key = tile.edges.join(',') // ex: "ABB,BCB,BBA,AAA"
        uniqueTilesMap[key] = tile
    }

    return Object.values(uniqueTilesMap)
}

function startOver() {
    // Create cell for each spot on the grid
    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = new Cell(tiles.length)
    }
}

// Check if any element in arr is in valid, e.g.
// VALID: [0, 2]
// ARR: [0, 1, 2, 3, 4]
// result in removing 1, 3, 4
// Could use filter()!
function checkValid(arr: number[], valid: number[]) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let element = arr[i]
        if (!valid.includes(element)) {
            arr.splice(i, 1)
        }
    }
}

const sketch = (p: p5) => {
    p.preload = () => {
        images[0] = p.loadImage(image_blank);
        images[1] = p.loadImage(image_up);
        images[2] = p.loadImage(image_right);
        images[3] = p.loadImage(image_down);
        images[4] = p.loadImage(image_left);
    }

    p.mousePressed = () => {
        p.redraw()
    }

    p.setup = () => {
        p.createCanvas(400, 400)

        tiles[0] = new Tile(p, images[0], ['AAA', 'AAA', 'AAA', 'AAA'], 0) // blank
        tiles[1] = new Tile(p, images[1], ['ABA', 'ABA', 'AAA', 'ABA'], 1) // up
        tiles[2] = new Tile(p, images[2], ['ABA', 'ABA', 'ABA', 'AAA'], 2) // right
        tiles[3] = new Tile(p, images[3], ['AAA', 'ABA', 'ABA', 'ABA'], 3) // down
        tiles[4] = new Tile(p, images[4], ['ABA', 'AAA', 'ABA', 'ABA'], 4) // left

        // Rotate tiles
        // TODO: eliminate redundancy
        for (let i = 2; i < 14; i++) {
            for (let j = 1; j < 4; j++) {
                tiles.push(tiles[i].rotate(j))
            }
        }

        // Generate the adjacency rules based on edges
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i]
            tile.analyze(tiles)
        }

        // Start over
        startOver()
    }

    p.draw = () => {
        p.background(0)

        // Draw the grid
        const w = p.width / DIM
        const h = p.height / DIM
        for (let j = 0; j < DIM; j++) {
            for (let i = 0; i < DIM; i++) {
                let cell = grid[i + j * DIM]
                if (cell.collapsed) {
                    let index = cell.options[0]
                    p.image(tiles[index].img, i * w, j * h, w, h)
                } else {
                    p.fill(0)
                    p.stroke(100)
                    p.rect(i * w, j * h, w, h)
                }
            }
        }

        // Make a copy of grid
        let gridCopy = grid.slice()
        // Remove any collapsed cells
        gridCopy = gridCopy.filter((a) => !a.collapsed)

        // The algorithm has completed if everything is collapsed
        if (grid.length === 0) {
            return
        }
        if (gridCopy.length === 0) {
            return
        }

        // Pick a cell with least entropy
        // Sort by entropy
        gridCopy.sort((a, b) => {
            return a.options.length - b.options.length
        })
        
        // Keep only the lowest entropy cells
        let len = gridCopy[0].options.length
        let stopIndex = 0
        for (let i = 1; i < gridCopy.length; i++) {
            if (gridCopy[i].options.length > len) {
                stopIndex = i
                break
            }
        }
        if (stopIndex > 0) gridCopy.splice(stopIndex)

        // Collapse a cell
        const cell = p.random(gridCopy)
        cell.collapsed = true
        const pick = p.random(cell.options)
        if (pick === undefined) {
            startOver()
            return
        }
        cell.options = [pick]

        // Calculate entropy
        const nextGrid = []
        for (let j = 0; j < DIM; j++) {
            for (let i = 0; i < DIM; i++) {
                let index = i + j * DIM
                if (grid[index].collapsed) {
                    nextGrid[index] = grid[index]
                } else {
                    let options = new Array(tiles.length).fill(0).map((x, i) => i)
                    // Look up
                    if (j > 0) {
                        let up = grid[i + (j - 1) * DIM]
                        let validOptions: number[] = []
                        for (let option of up.options) {
                            let valid = tiles[option].down
                            validOptions = validOptions.concat(valid)
                        }
                        checkValid(options, validOptions)
                    }
                    // Look right
                    if (i < DIM - 1) {
                        let right = grid[i + 1 + j * DIM]
                        let validOptions: number[] = []
                        for (let option of right.options) {
                            let valid = tiles[option].left
                            validOptions = validOptions.concat(valid)
                        }
                        checkValid(options, validOptions)
                    }
                    // Look down
                    if (j < DIM - 1) {
                        let down = grid[i + (j + 1) * DIM]
                        let validOptions: number[] = []
                        for (let option of down.options) {
                            let valid = tiles[option].up
                            validOptions = validOptions.concat(valid)
                        }
                        checkValid(options, validOptions)
                    }
                    // Look left
                    if (i > 0) {
                        let left = grid[i - 1 + j * DIM]
                        let validOptions: number[] = []
                        for (let option of left.options) {
                            let valid = tiles[option].right
                            validOptions = validOptions.concat(valid)
                        }
                        checkValid(options, validOptions)
                    }

                    // I could immediately collapse if only one option left?
                    nextGrid[index] = new Cell(options)
                }
            }
        }

        grid = nextGrid

        p.noLoop()
    }
}

new p5(sketch)
