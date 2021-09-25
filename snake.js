const canvasContainer = document.getElementById('snake')
const canvasInfo = canvasContainer.getBoundingClientRect()

// c stands for Canvas
const sc = document.getElementById('snake_canvas')
// t stands for conText
const st = sc.getContext('2d')

const tile = 20

const tile_width = Math.ceil(canvasInfo.width / tile)
const tile_height = Math.ceil(canvasInfo.height / tile)

const colliders = document.getElementsByClassName('collider')

const rules = document.getElementsByClassName('rules')[0]
const rules_button = document.getElementsByClassName('rules_button')[0]

// rules_button.addEventListener('click', () => {
//     rules.style.opacity = 1
//     rules.style.pointerEvents = 'all'
// })

// rules.addEventListener('click', () => {
//     rules.style.opacity = 0
//     rules.style.pointerEvents = 'none'
// })

sc.width = tile_width * tile
sc.height = tile_height * tile

let previous_frame = Date.now()
let previous_logic = Date.now()

let prevSnake
let snake
let apples

let paused = true

let movement = [[0, 1]]

// sets the amount of frames per logic
let increment

let checkMove = false

let score
let high_score

function initGame() {
    // snake segment format == [x-tile, y-tile]
    // snake head == snake[0]
    snake = [
        [3, parseInt(Math.ceil(window.innerHeight / tile) / 2), 1, 0],
        [2, parseInt(Math.ceil(window.innerHeight / tile) / 2), 1, 0],
        [1, parseInt(Math.ceil(window.innerHeight / tile) / 2), 1, 0],
    ]

    apples = [
        [-10, -10],
        [-10, -10],
        [-10, -10],
        [-10, -10],
        [-10, -10],
    ]

    score = 0

    for (let i = 0; i < apples.length; i++) {
        newApple(i)
    }

    movement = [[0, 1]]
}

initGame()

let snakeSpeed = 150 - snake.length / 5 + snake.length / 10 % 120
// let snakeSpeed = 1000 / 2
let frameRate = 1000 / 40

function main() {

    if (Date.now() > previous_frame + frameRate) {
        // console.time('draw')
        draw()
        // console.timeEnd('draw')
        previous_frame = Date.now()
    }

    if (Date.now() > previous_logic + snakeSpeed) {
        // console.time('logic')
        logic()
        // console.timeEnd('logic')
        previous_logic = Date.now()
    }

    if (paused == false) {
        window.requestAnimationFrame(main)
    }

}

main()

function logic() {

    let prev_snake_last = snake[snake.length - 1].slice()

    if (checkMove == true && movement.length > 1) {
        movement.pop()
        checkMove = false
    }

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = snake[i - 1].slice()
    }

    snake[0][movement[movement.length - 1][0]] += movement[movement.length - 1][1]

    if (movement[movement.length - 1][0] == 0) {
        snake[0][2] = movement[movement.length - 1][1]
        snake[0][3] = 0
    }
    else {
        snake[0][3] = movement[movement.length - 1][1]
        snake[0][2] = 0
    }

    if (snake[0][0] < 0 && snake[0][2] == -1) {
        snake[0][0] = tile_width - 1
    }
    else if (snake[0][0] > tile_width -1 && snake[0][2] == 1) {
        snake[0][0] = 0
    }
    else if (snake[0][1] < 0 && snake[0][3] == -1) {
        snake[0][1] = tile_height - 1
    }
    else if (snake[0][1] > tile_height -1 && snake[0][3] == 1) {
        snake[0][1] = 0
    }

    // check for apples
    for (let i = 0; i < apples.length; i++) {
        if (snake[0][0] == apples[i][0] && snake[0][1] == apples[i][1]) {
            newApple(i)
            score++
            snake.push(prev_snake_last)
        }
    }

    //check for snake collisions with self
    for (let i = 1; i < snake.length; i++) {
        if (snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1]) {
            killSnake()
        }
    }

    if (movement.length > 1) {
        movement.pop()
    }
    else {
        checkMove = true
    }

    snakeSpeed = 150 - snake.length / 5 + snake.length / 10 % 120
    increment = tile - (tile / (snakeSpeed / frameRate))
}

function draw() {
    st.clearRect(0, 0, sc.width, sc.height)

    // st.fillStyle = 'rgb(250, 189, 75)'
    // st.strokeStyle = 'rgb(250, 189, 75)'
    st.fillStyle = 'yellowgreen'
    st.strokeStyle = 'yellowgreen'
    st.lineCap = 'round'
    st.lineWidth = tile * .8

    st.beginPath()
    st.arc(((snake[0][0] * tile) + (tile * .5)) - (increment * snake[0][2]), ((snake[0][1] * tile) + (tile * .5)) - (increment * snake[0][3]), (tile * .8) * .5, 0, 360)
    st.fill()

    st.beginPath()
    st.moveTo(((snake[0][0] * tile) + (tile * .5)) - (increment * snake[0][2]), ((snake[0][1] * tile) + (tile * .5)) - (increment * snake[0][3]))
    for (let i = 1; i < snake.length; i++) {
        if (Math.abs(snake[i][0] - snake[i -1][0]) > 5 || Math.abs(snake[i][1] - snake[i -1][1]) > 5) {
            st.bezierCurveTo(
                ((snake[i - 1][0] - (snake[i - 1][2] * 2)) * tile) + (tile * .5),
                ((snake[i - 1][1] - (snake[i - 1][3] * 2)) * tile) + (tile * .5),
                ((snake[i - 1][0] - (snake[i - 1][2] * 2)) * tile) + (tile * .5),
                ((snake[i - 1][1] - (snake[i - 1][3] * 2)) * tile) + (tile * .5),
                (((snake[i - 1][0] - (snake[i - 1][2] * 2)) * tile) + (tile * .5)),
                (((snake[i - 1][1] - (snake[i - 1][3] * 2)) * tile) + (tile * .5)),
            )
            
            st.moveTo(
                (((snake[i][0] + (snake[i - 1][2] * 2)) * tile) + (tile * .5)),
                (((snake[i][1] + (snake[i - 1][3] * 2)) * tile) + (tile * .5)),
            )
            
            st.bezierCurveTo(
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                ((snake[i][0] * tile) + (tile * .5)) - (1 * snake[i][2]),
                ((snake[i][1] * tile) + (tile * .5)) - (1 * snake[i][3]),
            )

            st.bezierCurveTo(
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                ((snake[i][0] * tile) + (tile * .5)) - (increment * snake[i][2]),
                ((snake[i][1] * tile) + (tile * .5)) - (increment * snake[i][3]),
            )
        }
        else {
            st.bezierCurveTo(
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                ((snake[i][0] * tile) + (tile * .5)) - (1 * snake[i][2]),
                ((snake[i][1] * tile) + (tile * .5)) - (1 * snake[i][3]),
            )
            
            st.bezierCurveTo(
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                (snake[i][0] * tile) + (tile * .5),
                (snake[i][1] * tile) + (tile * .5),
                ((snake[i][0] * tile) + (tile * .5)) - (increment * snake[i][2]),
                ((snake[i][1] * tile) + (tile * .5)) - (increment * snake[i][3]),
            )
        }
    }
    st.stroke()

    st.fillStyle = 'red'

    for (let i = 0; i < apples.length; i++) {
        st.beginPath()
        st.arc((apples[i][0] * tile) + (tile * .5), (apples[i][1] * tile) + (tile * .5), (tile * .8) * .5, 0, 360)
        st.fill()
    }

    increment -= tile / (snakeSpeed / frameRate)
    if (increment < 0) {
        increment = 1
    }
}

// draw()

function killSnake() {
    increment = tile - (tile * .2)
    draw()
    paused = true
    initGame()
    canvasContainer.style.backgroundColor = 'transparent'
    st.clearRect(0, 0, sc.width, sc.height)
}

function newApple(i) {
    apples[i] = [
        Math.floor(Math.random() * tile_width),
        Math.floor(Math.random() * tile_height)
    ]

    for (let f = 0; f < snake.length; f++) {
        if (snake[f][0] == apples[i][0] && snake[f][1] == apples[i][1]) {
            newApple(i)
            return
        }
    }

    for (let f = 0; f < colliders.length; f++) {
        if (checkCollision(apples[i][0] * tile, apples[i][1] * tile, tile, colliders[f]) == true) {
            newApple(i)
            return
        }
    }
}

function checkCollision(x, y, width, element) {
    let bound = element.getBoundingClientRect()
    let el_x = (bound.left / tile) * tile
    let el_y = (bound.top / tile) * tile
    let el_width = (bound.width / tile) * tile
    let el_height = (bound.height / tile) * tile

    if ((el_x < x && x < el_x + el_width) && (el_y < y && y < el_y + el_height)) {
        return true
    }
    else if ((el_x < x + width && x + width < el_x + el_width) && (el_y < y && y < el_y + el_height)) {
        return true
    }
    else if ((el_x < x + width && x + width < el_x + el_width) && (el_y < y + width && y + width < el_y + el_height)) {
        return true
    }
    else if ((el_x < x && x < el_x + el_width) && (el_y < y + width &&  y + width < el_y + el_height)) {
        return true
    }
    else {
        return false
    }
}

window.addEventListener('keydown', (e) => {
    let key = e.key

    if (key == 'Enter') {
        canvasContainer.style.backgroundColor = 'rgba(240,240,240,.8)'
        paused = false
        main()
    }
    else if (key == 'Escape') {
        canvasContainer.style.backgroundColor = 'transparent'
        paused = true
    }

    if (key == 'ArrowUp' && paused == false) {
        e.preventDefault()

        if (movement[0][0] !== 1) {
            movement.unshift([1, -1])
        }
    }
    else if (key == 'ArrowDown' && paused == false) {
        e.preventDefault()

        if (movement[0][0] !== 1) {
            movement.unshift([1, 1])
        }
    }
    else if (key == 'ArrowLeft' && paused == false) {
        e.preventDefault()

        if (movement[0][0] !== 0) {
            movement.unshift([0, -1])
        }
    }
    else if (key == 'ArrowRight' && paused == false) {
        e.preventDefault()

        if (movement[0][0] !== 0) {
            movement.unshift([0, 1])
        }
    }
})