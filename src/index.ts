import p5 from 'p5'
import proto_rails from './proto_rails.json'
import Tile from './Tile'
import WFC from './WFC'

const DIMENSION = 5
const DIMENSION2 = 5
const TILES: Tile[] = []
const IMAGES: any[] = []
let wfc: WFC

function rotateImage(p: p5, img: any, angle: number) {
    const w = img.width
    const h = img.height
    const newImg = p.createGraphics(w, h)
    newImg.imageMode(p.CENTER)
    newImg.translate(w / 2, h / 2)
    newImg.rotate(p.HALF_PI * angle)
    newImg.image(img, 0, 0)

    return newImg
}

const sketch = (p: p5) => {
    p.preload = () => {
        // Load images
        for (let i = 0; i < proto_rails.length; i++) {
            let proto_rail = proto_rails[i]
            const image = require(`./tiles/${proto_rail.img}`)
            IMAGES.push(p.loadImage(image))
        }
    }

    p.setup = () => {
        p.createCanvas(800, 800)

        // Create tiles
        for (let i = 0; i < proto_rails.length; i++) {
            let proto_rail = proto_rails[i]
            TILES.push(new Tile(proto_rail.name, IMAGES[i], proto_rail.n, proto_rail.e, proto_rail.s, proto_rail.w))

            // image and edge rotations
            if (proto_rail.orientations > 1) {
                const img90 = rotateImage(p, IMAGES[i], 1)

                TILES.push(new Tile(proto_rail.name + '-img90', img90, proto_rail.w, proto_rail.n, proto_rail.e, proto_rail.s))
            }
            
            if (proto_rail.orientations > 2) {
                const img180 = rotateImage(p, IMAGES[i], 2)

                TILES.push(new Tile(proto_rail.name + '-img180', img180, proto_rail.s, proto_rail.w, proto_rail.n, proto_rail.e))
            }

            if (proto_rail.orientations > 3) {
                const img270 = rotateImage(p, IMAGES[i], 3)

                TILES.push(new Tile(proto_rail.name + '-img270', img270, proto_rail.e, proto_rail.s, proto_rail.w, proto_rail.n))
            }
        }

        // Create WFC
        wfc = new WFC(p, DIMENSION, TILES)
    }

    p.draw = () => {
        p.background(0)

        if (!wfc.isDone()) {
            wfc.iterate()
        }

        const width = p.width / DIMENSION
        const height = p.height / DIMENSION

        // Draw tiles
        for (let i = 0; i < wfc.cells.length; i++) {
            let cell = wfc.cells[i]

            // draw the images with border
            if (cell.collapsed && cell.tile) {
                p.image(cell.tile.img, cell.x * width, cell.y * height, width, height)

                // Set the color and weight of the border
                p.stroke(0) // White color

                // Draw the border
                p.noFill() // Ensure that the rectangle is not filled
                p.rect(cell.x * width, cell.y * height, width, height)
            } else {
                // draw all possible tiles
                const iWidth = width / DIMENSION2
                const iHeight = height / DIMENSION2
                
                for (let j = 0; j < cell.possibleTiles.length; j++) {
                    let tile = cell.possibleTiles[j]

                    if (!tile) {
                        continue
                    }

                    p.image(
                        tile.img,
                        cell.x * width + iWidth * (j % DIMENSION2),
                        cell.y * height + iHeight * Math.floor(j / DIMENSION2),
                        iWidth,
                        iHeight
                    )

                    // Set the color and weight of the border
                    p.stroke('#f00000') // White color

                    // Draw the border
                    p.noFill() // Ensure that the rectangle is not filled
                    p.rect(cell.x * width + iWidth * (j % DIMENSION2), cell.y * height + iHeight * Math.floor(j / DIMENSION2), iWidth, iHeight)
                }

                // draw the number of possible tiles
                // in the middle of the cell
                p.textSize(16)
                p.fill(255)
                p.textAlign(p.CENTER, p.CENTER)
                p.text(cell.possibleTiles.length, cell.x * width + width / 2, cell.y * height + height / 2)
            }
        }

        let resetButton = p.createButton('Last state')
        resetButton.position(19, 19)
        resetButton.mousePressed(() => {
            console.log('Last')
            // Reset the cells
            for (let cell of wfc.cells) {
                cell.reset()
            }

            p.redraw()
        })

        let redrawButton = p.createButton('Continue')
        redrawButton.position(19, 49)
        redrawButton.mousePressed(() => {
            p.redraw()
        })

        p.noLoop()
    }
}

new p5(sketch)
