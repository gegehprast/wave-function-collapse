import p5 from "p5";

function reverseString(s: string) {
    let arr = s.split('')
    arr = arr.reverse()
    return arr.join('')
}

function compareEdge(a: string, b: string) {
    return a == reverseString(b)
}

class Tile {
    p: p5
    img: p5.Image | p5.Graphics

    edges: string[]

    index: number

    up: number[]
    right: number[]
    down: number[]
    left: number[]

    constructor(p: p5, img: p5.Image | p5.Graphics, edges: string[], i: number) {
        this.p = p
        this.img = img
        this.edges = edges
        this.up = []
        this.right = []
        this.down = []
        this.left = []
        this.index = i
    }

    analyze(tiles: Tile[]) {
        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i]

            // UP
            if (compareEdge(tile.edges[2], this.edges[0])) {
                this.up.push(i)
            }
            // RIGHT
            if (compareEdge(tile.edges[3], this.edges[1])) {
                this.right.push(i)
            }
            // DOWN
            if (compareEdge(tile.edges[0], this.edges[2])) {
                this.down.push(i)
            }
            // LEFT
            if (compareEdge(tile.edges[1], this.edges[3])) {
                this.left.push(i)
            }
        }
    }

    rotate(num: number) {
        const w = this.img.width
        const h = this.img.height

        const newImg = this.p.createGraphics(w, h)
        newImg.imageMode(this.p.CENTER)
        newImg.translate(w / 2, h / 2)
        newImg.rotate(this.p.HALF_PI * num)
        newImg.image(this.img, 0, 0)

        const newEdges = []
        const len = this.edges.length
        for (let i = 0; i < len; i++) {
            newEdges[i] = this.edges[(i - num + len) % len]
        }
        return new Tile(this.p, newImg, newEdges, this.index)
    }
}

export default Tile;
