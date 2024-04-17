const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

let score = 0

class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw() {
        ctx.beginPath()
        ctx.drawImage(this.image, this.position.x, this.position.y)
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

class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
    }
}

class PowerUp {
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
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
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', 'T', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', 'U', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', 'U', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', 'L', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'o', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const boundaries = []
const pellets = []
const powerUps = []


const createImage = (symbol) => {
    const image = new Image()
    let src = null
    switch (symbol) {
        case '-': src = '.././images/pipeHorizontal.png'
            break
        case '|': src = '.././images/pipeVertical.png'
            break
        case '1': src = '.././images/pipeCorner1.png'
            break
        case '2': src = '.././images/pipeCorner2.png'
            break
        case '3': src = '.././images/pipeCorner3.png'
            break
        case '4': src = '.././images/pipeCorner4.png'
            break
        case 'b': src = '.././images/block.png'
            break
        case 'U': src = '.././images/capBottom.png'
            break
        case '[': src = '.././images/capLeft.png'
            break
        case ']': src = '.././images/capRight.png'
            break
        case '^': src = '.././images/capTop.png'
            break
        case 'L': src = '.././images/pipeConnectorTop.png'
            break
        case 'T': src = '.././images/pipeConnectorBottom.png'
            break
        case '+': src = '.././images/pipeCross.png'
            break
        case 'J': src = '.././images/pipeConnectorLeft.png'
            break
        case 'C': src = '.././images/pipeConnectorRight.png'
            break
    }
    image.src = src
    return image
}

map.map((row, j) => {
    row.map((symbol, i) => {
        if (symbol === '.') {
            pellets.push(
                new Pellet({
                    position: {
                        x: Boundary.width * i + Boundary.width / 2,
                        y: Boundary.height * j + Boundary.height / 2
                    }
                })
            )
        }
        else if (symbol === 'o') {
            powerUps.push(
                new PowerUp({
                    position: {
                        x: Boundary.width * i + Boundary.width / 2,
                        y: Boundary.height * j + Boundary.height / 2
                    }
                })
            )
        }
        else {
            boundaries.push(
                new Boundary({
                    position: {
                        x: Boundary.width * i,
                        y: Boundary.height * j
                    },
                    image: createImage(symbol)
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

const playerCollidesWithCircle = ({ player, circle }) => {
    return Math.hypot(
        circle.position.x - player.position.x,
        circle.position.y - player.position.y
    ) <
    circle.radius + player.radius
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

    for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i]
        pellet.draw()
        if (playerCollidesWithCircle({player: pacman, circle: pellet})) {
            pellets.splice(i, 1)
            score+=10
            scoreEl.innerHTML = score
        }
    }

    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()
        if (playerCollidesWithCircle({player: pacman, circle: powerUp})) {
            powerUps.splice(i, 1)
        }
    }

    boundaries.map((boundary) => {
        boundary.draw()
        if (playerCollidesWithWall({ player: pacman, wall: boundary })) {
            pacman.velocity.y = 0
            pacman.velocity.x = 0
        }
    })


    pacman.draw()
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