const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.closePath()
    }
}

class Pacman {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const pacman = new Pacman({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const map = [
    ['-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-']
]

const boundaries = []

map.map((row, j) => {
    row.map((col, i) => {
        if (col === '-') {
            boundaries.push(
                new Boundary({
                    position: {
                        x: Boundary.width * i,
                        y: Boundary.height * j
                    }
                })
            )
            
        }
    })
})


const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    boundaries.map((boundary)=>{
        boundary.draw()
    })
    pacman.draw()
    pacman.update()
}
animate()



document.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            pacman.velocity.y = -5
            break
        case 's':
            pacman.velocity.y = 5
            break
        case 'a':
            pacman.velocity.x = -5
            break
        case 'd':
            pacman.velocity.x = 5
            break
    }
})