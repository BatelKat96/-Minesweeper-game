'use strict'

var gBoard
const MINE = ' 💣'
const FLAG = '🚩'
var gCell
var gTimeInterval
var gCountMoves
var nextId = 101
var gIsDarkMood = false
var totalSeconds


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    size: 4,
    mines: 2,
    lives: 2,
    bestScore: null
}

function onInitGame() {
    clearInterval(gTimeInterval)
    totalSeconds = 0
    gGame.shownCount = 0
    gCountMoves = 0
    htmlRestart()

    gBoard = createBoard()
    renderBoard(gBoard)
    gGame.isOn = true
}

function htmlRestart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    document.querySelector('#minutes').innerText = '00'
    document.querySelector('#seconds').innerText = '00'

    var elFlag = document.querySelector('.count-flags span')
    elFlag.innerText = gLevel.mines

    var elLives = document.querySelector('.count-lives span')
    elLives.innerText = gLevel.lives

    var elbtn = document.querySelector('.restart')
    elbtn.innerText = '😄'

    var elBestScore = document.querySelector('.best-score span')
    elBestScore.innerText = localStorage.getItem('gLevel.bestScore')
}

function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {

        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            gCell = {
                id: nextId++,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = gCell
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var inCell = (currCell.isMine && currCell.isShown) ? MINE : ''
            var nameClass = (currCell.isMine) ? 'mine' : ''
            strHTML += `<td class="${nameClass}" data-i="${i}" data-j="${j}" 
            onclick="onCellClicked(this, ${i},${j})"  
            oncontextmenu="javascript:onRightClick(this, ${i},${j});return false;">${inCell}
            </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.isOn) return
    if (currCell.isShown) return
    if (currCell.isMarked) return

    // if (gCountMoves === 1) {
    //     randomCellForMines(gLevel.size, gLevel.mines, gBoard)
    // }
    gGame.shownCount++
    gCountMoves++
    startTimer()

    //model
    gBoard[i][j].isShown = true

    if (currCell.isMine) {
        //dom
        elCell.innerText = MINE
        elCell.style.backgroundColor = 'black'
        var elLives = document.querySelector('.count-lives span')
        elLives.innerText--

        if (elLives.innerText < 1) isVictory(false)

    } else {
        var countNeg = setMinesNegsCount(i, j, gBoard)
        elCell.style.backgroundColor = '#b1bac3'

        if (countNeg) elCell.innerText = countNeg
        else expandShown(gBoard, elCell, i, j)
    }

    if (gGame.shownCount === (gLevel.size ** 2)) {
        checkGameOver()
    }
}

function expandShown(mat, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (i === cellI && j === cellJ) continue
            if (mat[i][j].isShown) continue
            if (mat[i][j].isMarked) continue
            if (mat[i][j].isMine) continue

            // Update the model :
            mat[i][j].isShown = true

            // Update the dom :
            var elTd = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elTd.style.backgroundColor = '#b1bac3'
            elTd.innerText = setMinesNegsCount(i, j, gBoard)
            gGame.shownCount++

            if (gCountMoves === 1) {
                randomCellForMines(gLevel.size, gLevel.mines, gBoard)
                gCountMoves++
            }

            var countNeg = setMinesNegsCount(i, j, gBoard)
            if (gCountMoves > 1 && !countNeg) {
                expandShown(mat, elCell, i, j)
            }

        }
    }
}


function onRightClick(elCell) {
    if (!gGame.isOn) return

    const cellI = +elCell.dataset.i
    const cellJ = +elCell.dataset.j

    var currCell = gBoard[cellI][cellJ]
    if (currCell.isShown) return
    gCountMoves++
    startTimer()

    var elFlag = document.querySelector('.count-flags span')

    if (!currCell.isMarked) {
        if (gGame.markedCount === gLevel.mines) return
        //modal 
        elCell.classList.add('flag')

        //dom
        elCell.innerText = FLAG
        elFlag.innerText--
        gGame.markedCount++
        gGame.shownCount++
    } else {
        //modal 
        elCell.classList.remove('flag')

        //dom
        elCell.innerText = ''
        elFlag.innerText++
        gGame.markedCount--
        gGame.shownCount--

    }
    currCell.isMarked = !currCell.isMarked
}

function checkGameOver() {
    var elTdMine = document.querySelectorAll(`.mine`)
    var elTdFlag = document.querySelectorAll(`.flag`)

    for (var i = 0; i < elTdMine.length; i++) {
        if (elTdFlag[i].dataset.i !== elTdMine[i].dataset.i ||
            elTdFlag[i].dataset.j !== elTdMine[i].dataset.j) {
            return isVictory(false)
        }
    }
    return isVictory(true)
}

function isVictory(msg) {
    gGame.isOn = false
    clearInterval(gTimeInterval)

    var elModal = document.querySelector('.modal')
    var elBtn = document.querySelector('.restart')
    var elSapn = elModal.querySelector('span')

    if (msg) {
        bestScoreForLevel()
        elSapn.innerText = 'You won!'
        elBtn.innerText = '🤩'
    } else {
        showAllMines()
        elSapn.innerText = 'You lose...'
        elBtn.innerText = '😵'
    }
    elModal.style.display = 'block'
}

function onClickLevel(boardSize, minesNum, livesNum, bestScores) {
    gLevel.size = boardSize
    gLevel.mines = minesNum
    gLevel.lives = livesNum
    gLevel.bestScore = bestScores

    onInitGame()
}

function startTimer() {
    if (gCountMoves === 1) gTimeInterval = setInterval(timer, 1000)
    var elTimer = document.querySelector('.time')
    gGame.secsPassed = (elTimer.innerText)
}


function darkMood() {
    gIsDarkMood = !gIsDarkMood
    var elBody = document.querySelector('body')
    var elContiner = elBody.querySelector('.continer')
    var elLevel = elContiner.querySelectorAll('.level')

    if (gIsDarkMood) {
        elBody.style.backgroundColor = '#434546'
        elContiner.style.backgroundColor = '#b6b8ba'
        for (var i = 0; i < elLevel.length; i++) {
            elLevel[i].style.backgroundColor = '#5a6063'
        }
    } else {
        elBody.style.backgroundColor = '#c8e3ff'
        elContiner.style.backgroundColor = '#5caefa9d'
        for (var i = 0; i < elLevel.length; i++) {
            elLevel[i].style.backgroundColor = 'rgb(0, 119, 255)'
        }
    }

}


function drawNum(array) {
    var idx = getRandomInt(0, array.length)
    var num = array[idx]
    array.splice(idx, 1)
    return num
}


function boardCells(board) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            cells.push(currCell)
        }
    }
    return cells
}


function bestScoreForLevel() {
    if (gLevel.bestScore === null || gLevel.bestScore > gGame.secsPassed) {
        gLevel.bestScore = gGame.secsPassed
        localStorage.setItem('gLevel.bestScore', gGame.secsPassed)

        // dom
        var elBestScore = document.querySelector('.best-score span')
        var elTimer = document.querySelector('.time')
        elBestScore.innerText = (elTimer.innerText)
    }
}
