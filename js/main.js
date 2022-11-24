'use strict'

// var cell ={
//     minesAroundCount: 4, ///כמה מוקשים מסביב
//     isShown: false,   ////האם התא חשוף
//     isMine: false, // האם יש בו מוקש
//     isMarked: true /// האם יש עליו דגל 
// }

var gBoard
const MINE = ' 💣'
const FLAG = '🚩'
var gCell
var inCell
var gTimeInterval
var gFirstMove = 0

var gLevel = {
    size: 4,
    mines: 2,
    lives: 2
}

var gGame = {
    isOn: false, // האם המשחק התחיל
    shownCount: 0,  // כמה תאים נחשפו
    markedCount: 0, // על כמה תאים יש דגל
    secsPassed: 0 /// כמה זמןעבר מתחילת המשחק
}


function onInitGame() {
    clearInterval(gTimeInterval)
    gGame.shownCount = 0
    htmlRestart()

    gBoard = createBoard()
    renderBoard(gBoard)

    gGame.isOn = true
    console.log('gBoard:', gBoard)
}

function htmlRestart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    document.querySelector('.min').innerText = '00'
    document.querySelector('.sec').innerText = '00'

    var elFlag = document.querySelector('.count-flags span')
    elFlag.innerText = gLevel.mines

    var elLives = document.querySelector('.count-lives span')
    elLives.innerText = gLevel.lives

    var elbtn = document.querySelector('.restart')
    elbtn.innerText = '😄'
}

function createBoard() {
    // var size = boardSize
    // console.log('size:', size)

    var board = []
    for (var i = 0; i < gLevel.size; i++) {

        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            gCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = gCell
        }
    }
    randomCellForMines(gLevel.size, gLevel.mines, board)
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
    // if (gFirstMove === 1) {
    //     randomCellForMines(gLevel.size, gLevel.mines, gBoard)
    // }

    gGame.shownCount++
    gFirstMove++
    startTimer()

    //model
    gBoard[i][j].isShown = true

    if (currCell.isMine) {
        //dom
        elCell.innerText = MINE
        elCell.style.backgroundColor = 'black'
        var elLives = document.querySelector('.count-lives span')
        elLives.innerText--
        console.log(' elLives.innerText:', elLives.innerText)

        if (elLives.innerText < 1) isVictory(false)

    } else {
        var countNeg = setMinesNegsCount(i, j, gBoard)
        elCell.style.backgroundColor = '#b1bac3'

        if (countNeg) elCell.innerText = countNeg
        else expandShown(gBoard, elCell, i, j)
    }

    if (gGame.shownCount === (gLevel.size ** 2)) {
        checkGameOver()
        clearInterval(gTimeInterval)
    }
}

function expandShown(mat, elCell, cellI, cellJ,) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (i === cellI && j === cellJ) continue
            if (mat[i][j].isShown) continue
            if (mat[i][j].isMarked) continue
            // Update the model :
            mat[i][j].isShown = true

            // Update the dom :
            var elTd = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elTd.style.backgroundColor = '#b1bac3'
            elTd.innerText = setMinesNegsCount(i, j, gBoard)
            gGame.shownCount++

        }
    }
}

function onRightClick(elCell) {
    if (!gGame.isOn) return
    // console.log('elCell:', elCell)

    const cellI = +elCell.dataset.i
    const cellJ = +elCell.dataset.j
    // console.log('i:', cellI)
    // console.log('j:', cellJ)

    var currCell = gBoard[cellI][cellJ]
    if (currCell.isShown) return
    gFirstMove++
    startTimer()

    var elFlag = document.querySelector('.count-flags span')

    if (!currCell.isMarked) {
        if (gGame.markedCount === gLevel.mines) return
        //modal 
        elCell.classList.add('flag')

        //dom
        elCell.innerText = FLAG
        // console.log('gBoard:', gBoard)
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
    console.log('gGame.shownCount:', gGame.shownCount)

    currCell.isMarked = !currCell.isMarked
}

function checkGameOver() {
    var elTdMine = document.querySelectorAll(`.mine`)
    var elTdFlag = document.querySelectorAll(`.flag`)

    for (var i = 0; i < elTdMine.length; i++) {
        if (elTdFlag[i].dataset.i !== elTdMine[i].dataset.i ||
            elTdFlag[i].dataset.j !== elTdMine[i].dataset.j) {
            // console.log('lose:')
            return isVictory(false)
        }
    }
    // console.log('win:')
    return isVictory(true)

}

function isVictory(msg) {
    gGame.isOn = false
    clearInterval(gTimeInterval)

    var elModal = document.querySelector('.modal')
    var elBtn = document.querySelector('.restart')
    var elSapn = elModal.querySelector('span')
    console.log('elbtn:', elBtn)

    if (msg) {
        elSapn.innerText = 'You won!'
        elBtn.innerText = '🤩'
    } else {
        showAllMines()
        elSapn.innerText = 'You lose...'
        elBtn.innerText = '😵'
    }
    elModal.style.display = 'block'
}

function onClickLevel(boardSize, minesNum, livesNum) {
    gLevel.size = boardSize
    gLevel.mines = minesNum
    gLevel.lives = livesNum

    onInitGame()
}

function startTimer() {

    if (gFirstMove === 1) gTimeInterval = setInterval(timer, 1000)

    var elTimer = document.querySelector('.time')
    gGame.secsPassed = (elTimer.innerText)
}

function showAllMines() {
    var elTdMine = document.querySelectorAll(`.mine`)
    console.log('elTdMine:', elTdMine)

    for (var i = 0; i < elTdMine.length; i++) {
        var elCell = elTdMine[i]

        var cellI = elTdMine[i].dataset.i
        var cellJ = elTdMine[i].dataset.j
        var cellId = gBoard[cellI][cellJ]


        if (cellId.isShown) {
            elCell.style.backgroundColor = 'black'
            elCell.innerText = MINE
        } else {

            //modal
            cellId.isShown = true
            //dom
            elCell.innerText = MINE
            elCell.style.backgroundColor = '#b1bac3'
        }

    }
}







