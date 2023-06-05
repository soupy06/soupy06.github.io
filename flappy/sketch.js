let BACKGROUND_SCROLL_SPEED = .5
let BACKGROUND_LOOPING_PT = 413
let GROUND_SCROLL_SPEED = 1
let GROUND_LOOPING_SPEED = 438
let SPACE = 32

let bgScroll = 0
let groundScroll = 0
let spawnTimer = 0
let points = 0
let pipes = []
let blues = []
let gameState = "title" // title, countdown, play, done'
let count = 3
let timer = 0
let level = 1

let bgImage, nightImage, groundImage, birdImage, bird, pipeImage, pipe, lastY, blueImage, blue
let flappyFont, gameFont, explosion, jump, score, hurt, music

function preload() {
    bgImage = loadImage('graphics/background.png')
    nightImage = loadImage('graphics/night.png')
    groundImage = loadImage('graphics/ground.png')
    birdImage = loadImage('graphics/bird.png')
    pipeImage = loadImage('graphics/pipe.png')
    blueImage = loadImage('graphics/blue.png')

    flappyFont = loadFont('fonts/flappy.ttf')
    gameFont = loadFont('fonts/font.ttf')

    jump = loadSound('sounds/jump.wav')
    score = loadSound('sounds/score.wav')
    explosion = loadSound('sounds/explosion.wav')
    hurt = loadSound('sounds/hurt.wav')
    music = loadSound('sounds/marios_way.mp3')
}

function setup() {
    createCanvas(800, 500)
    bird = new Bird(birdImage, width / (2 * 1.74) - birdImage.width / 2, height / (2 * 1.74) - birdImage.height / 2)
    lastY = random(150, 200)
    music.loop()
}

function title() {
    fill(255)
    textSize(28)
    textAlign(CENTER)
    textFont(flappyFont)
    text("Fifty Bird", width / (2 * 1.74), 100)
    textSize(14)
    text("Press Enter", width / (2 * 1.74), 130)
}

function draw() {
    scale(1.74)
    noSmooth()

    image(bgImage, -bgScroll, 0)
    bgScroll = (bgScroll + BACKGROUND_SCROLL_SPEED) % BACKGROUND_LOOPING_PT

    image(groundImage, -groundScroll, height / 1.74 - 16)
    groundScroll = (groundScroll + GROUND_SCROLL_SPEED) % GROUND_LOOPING_SPEED

    if (gameState == "title") {
        title()
    }
    else if (gameState == "countdown"){
        countdown()
    }
    else if (gameState == "countdowntwo"){
        countdowntwo()
    }
    else if (gameState == "play") {
        play()
    }
    else if (gameState == "nextLevel") {
        nextLevel()
    }
    else if (gameState == "done") {
        done()
    }
}

function done() {
    fill(255)
    textSize(28)
    textAlign(CENTER)
    textFont(flappyFont)

    if (level == 1) {
        if (points > 0) {
            text("To the next level!", width / (2 * 1.74), 50)
            countdowntwo()
        }
        else {
            text("Oops! You Lost!", width / (2 * 1.74), 100)
            text("Score: " + points, width / (2 * 1.74), 150)
            text("Press Enter to Play Again", width / (2 * 1.74), 200)
        }
    }
    if (level == 2) {
        image(nightImage, -bgScroll, 0)
        bgScroll = (bgScroll + BACKGROUND_SCROLL_SPEED) % BACKGROUND_LOOPING_PT

        image(groundImage, -groundScroll, height / 1.74 - 16)
        groundScroll = (groundScroll + GROUND_SCROLL_SPEED) % GROUND_LOOPING_SPEED
        if (points > 0) {
            text("Good job!", width / (2 * 1.74), 100)
            text("Score: " + points, width / (2 * 1.74), 150)
        }
        else {
            text("Oops! You Lost!", width / (2 * 1.74), 100)
            text("Score: " + points, width / (2 * 1.74), 150)
        }
    }
    textSize(14)
}

function countdown() {
    fill(255)
    textSize(56)
    text(CENTER, CENTER)
    textFont(flappyFont)
    text(count, width / (2 * 1.74), height / (2 * 1.74))

    if (frameCount % 60 == 0) {
        count--
    }

    if (count == 0) {
        pipes = []
        blues = []
        count = 3
        gameState = "play"
    }

}

function countdowntwo() {
    fill(255)
    textSize(56)
    text(CENTER, CENTER)
    textFont(flappyFont)
    text(count, width / (2 * 1.74), height  / (2 * 1.74))


    if (frameCount % 60 == 0) {
        count--
    }

    if (count == 0) {
        blues = []
        pipes = []
        count = 3
        points = 0
        gameState = "nextLevel"
        bird.reset(height / (2 * 1.74) - bird.height / 2)
    }
}

function nextLevel() {

    image(nightImage, -bgScroll, 0)
    bgScroll = (bgScroll + BACKGROUND_SCROLL_SPEED) % BACKGROUND_LOOPING_PT

    image(groundImage, -groundScroll, height / 1.74 - 16)
    groundScroll = (groundScroll + GROUND_SCROLL_SPEED) % GROUND_LOOPING_SPEED

    bird.display()
    bird.update()

    spawnTimer += 1/60

    if(spawnTimer > 2) {
        blue = new Pipe(blueImage)
        blue.y = constrain(lastY + random(-20, 20), 100, 220)
        lastY = blue.y
        blues.push(blue)
        spawnTimer = 0
     }
     for(let blue of blues) {
        blue.display()
        blue.update()

        if (bird.collides(blue)) {
            explosion.play()
            hurt.play()
            level = 2
            gameState = "done"
        }

        if (!blue.scored){
            if (blue.x + blue.width / 2 < bird.x) {
                points++
                blue.scored = true
                score.play()
            }
        }

        for (let i = blue.length - 1; i >= 0; i--) {
            let blue = blues[i]
        }

        if (blue.x + blue.width < 0){
            blues.shift()
        }
     }

     displayPoints()
}

function displayPoints() {
    fill(255)
    textSize(28)
    textFont(flappyFont)
    textAlign(LEFT)
    text("Score: " + points, 10, 30)
}

function play() {
    bird.display()
    bird.update()

    spawnTimer += 1/60

    if(spawnTimer > 2) {
        pipe = new Pipe(pipeImage)
        pipe.y = constrain(lastY + random(-20, 20), 100, 220)
        lastY = pipe.y
        pipes.push(pipe)
        spawnTimer = 0
     }
     for(let pipe of pipes) {
        pipe.display()
        pipe.update()

        if (bird.collides(pipe)) {
            explosion.play()
            hurt.play()
            gameState = "done"
        }

        if (!pipe.scored){
            if (pipe.x + pipe.width / 2 < bird.x) {
                points++
                pipe.scored = true
                score.play()
            }
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            let pipe = pipes[i]
        }

        if (pipe.x + pipe.width < 0){
            pipes.shift()
        }
     }
     displayPoints()
}

function keyPressed() {
    if (gameState == "play" && keyCode == SPACE) {
        bird.jump()
        jump.play()
    }
    if (gameState == "nextLevel" && keyCode == SPACE) {
        bird.jump()
        jump.play()
    }

    if (keyCode == ENTER || keyCode == RETURN) {
        if (gameState == "title" || gameState == "done") {
            bird.reset(height / (2 * 1.74) - bird.height / 2)
            points = 0
            gameState = "countdown"
        }
        if (gameState == "title" || gameState == "nextLevel") {
            bird.reset(height / (2 * 1.74) - bird.height / 2)
            points = 0
            gameState = "countdowntwo"
        }
    }
}




