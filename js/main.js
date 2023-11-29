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

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
let lastKey = ''

const map = [
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-']
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

const playerCollidesWithWall = ({
    player,
    wall
}) => {
    return (player.position.y - player.radius + player.velocity.y <= wall.position.y + wall.height && player.position.y + player.radius + player.velocity.y >= wall.position.y && player.position.x - player.radius + player.velocity.x <= wall.position.x + wall.width && player.position.x + player.radius + player.velocity.x >= wall.position.x)
}



const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed === true && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (playerCollidesWithWall({
                player: {
                    ...pacman, velocity: {
                        x: 0,
                        y: -5
                    }
                },
                wall: boundary
            })) {
                pacman.velocity.y = 0
                break
            }
            else {
                pacman.velocity.y = -5
            }
        }
    }
    else if (keys.a.pressed === true && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (playerCollidesWithWall({
                player: {
                    ...pacman, velocity: {
                        x: -5,
                        y: 0
                    }
                },
                wall: boundary
            })) {
                pacman.velocity.x = 0
                break
            }
            else {
                pacman.velocity.x = -5
            }
        }
    }
    else if (keys.s.pressed === true && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (playerCollidesWithWall({
                player: {
                    ...pacman, velocity: {
                        x: 0,
                        y: 5
                    }
                },
                wall: boundary
            })) {
                pacman.velocity.y = 0
                break
            }
            else {
                pacman.velocity.y = 5
            }
        }
    }
    else if (keys.d.pressed === true && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (playerCollidesWithWall({
                player: {
                    ...pacman, velocity: {
                        x: 5,
                        y: 0
                    }
                },
                wall: boundary
            })) {
                pacman.velocity.x = 0
                break
            }
            else {
                pacman.velocity.x = 5
            }
        }
    }

    pacman.draw()
    boundaries.map((boundary) => {
        boundary.draw()
        if (playerCollidesWithWall({ player: pacman, wall: boundary })) {
            pacman.velocity.y = 0
            pacman.velocity.x = 0
        }
    })
    pacman.update()
}
animate()



document.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})
document.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})