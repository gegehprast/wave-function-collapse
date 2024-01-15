function reverseString(str: string) {
    return str.split('').reverse().join('')
}

class Tile {
    name: string
    img: any

    n: string
    e: string
    s: string
    w: string

    constructor(name: string, img: any, n: string, e: string, s: string, w: string) {
        this.name = name
        this.img = img
        this.n = n
        this.e = e
        this.s = s
        this.w = w
    }

    isCompatibleWith(tile: Tile, direction: string) {
        if (direction === 'n') {
            return tile.n === reverseString(this.s)
        } else if (direction === 'e') {
            return tile.e === reverseString(this.w)
        } else if (direction === 's') {
            return tile.s === reverseString(this.n)
        } else if (direction === 'w') {
            return tile.w === reverseString(this.e)
        }

        return false
    }
}

export default Tile
