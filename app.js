const grid = document.querySelector('.grid')
let width = 10
let bombCount = 20
let flags = 0
let squares = []
let isGameOver = false

function createBoard() {
    const bombsArray = Array(bombCount).fill('bomb')
    const emptyArray = Array(width * width - bombCount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
    

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        square.classList.add(shuffledArray[i])
        grid.appendChild(square)
        squares.push(square)

        square.addEventListener('click', e => {
            click(square)
        })

        square.oncontextmenu = (e) => {
            e.preventDefault()
            addFlag(square)
        }
    }

    for (let i = 0; i <squares.length; i++) {
        const isLeftEdge = i % width === 0
        const isRigthEdge = i % width === width -1
        let total = 0

        if (squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
            if (i > 9 && !isRigthEdge && squares[i + 1 - width].classList.contains('bomb')) total++
            if (i > 10 && squares[i - width].classList.contains('bomb')) total++
            if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
            if (i < 98 && !isRigthEdge && squares[i + 1].classList.contains('bomb')) total++
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
            if (i < 88 && !isRigthEdge && squares[i + 1 + width].classList.contains('bomb')) total++
            if (i < 89 && squares[i + width].classList.contains('bomb')) total++
            squares[i].setAttribute('data', total)
        }
    }
}

createBoard()

function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && flags < bombCount) {
        if (!square.classList.contains('flag')){
            square.classList.add('flag')
            square.innerHTML = '🚩'
            flags++
            checkForWin()
        }
        else {
            square.classList.remove('flag')
            square.innerHTML = ''
            flags--
        }
    }
}

function click(square) {

    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return

    if (square.classList.contains('bomb')){
        gameOver(square)
    }
    else {
        let total = square.getAttribute('data')
        if (total != 0) {
            square.classList.add('checked')
            square.innerHTML = total
            return
        }
        checkSquare(square)
    }
    square.classList.add('checked')
}

function checkSquare(square) {
    const isLeftEdge = square.id % width === 0
    const isRightEdge = square.id % width === width -1
    const currentId = parseInt(square.id)

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
          const newId = squares[currentId - 1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = squares[currentId + 1 - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 10) {
          const newId = squares[currentId - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 11 && !isLeftEdge) {
          const newId = squares[currentId - 1 - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 98 && !isRightEdge) {
          const newId = squares[currentId + 1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = squares[currentId - 1 + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 88 && !isRightEdge) {
          const newId = squares[currentId + 1 + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 89) {
          const newId = squares[currentId + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
      }, 10)
}

function gameOver(square) {
    isGameOver = true;

    squares.forEach(square => {
        if (square.classList.contains('bomb'))
            square.innerHTML = '💣'
    })

    setTimeout(() => {
        if (confirm('You lost. Press ok to restart.')){
            window.location = '/minesweeper/'
        }
        return
    }, 100);
}

function checkForWin() {
    let matches = 0

    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++
        }

        if (matches === bombCount) {
            isGameOver = true
            if (confirm('You won. Press ok to restart.')){
                window.location = '/minesweeper/'
            }
            return
        }
    }
}
