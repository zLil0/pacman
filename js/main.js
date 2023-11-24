const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }
    draw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}



const map = [
    ['-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-']
]

map.map((row, j)=>{
    row.map((col, i)=>{
        if(col==='-'){
            const boundary = new Boundary({
                position: {
                    x:40*j, 
                    y: 40*i
                }
            })
            boundary.draw()
        }
    })
})



