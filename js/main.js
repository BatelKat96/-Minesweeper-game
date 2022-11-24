'use strict'

// var shownCount = 0
// var cell ={
//     minesAroundCount: 4, ///כמה מוקשים מסביב
//     isShown: false,   ////האם התא חשוף
//     isMine: false, // האם יש בו מוקש
//     isMarked: true /// האם יש עליו דגל 
// }


var gBoard
// var gSize = 4
const MINE = '💣'
const FLAG = '🚩'
var gCell
var inCell
var gTimeInterval
var gFirstMove = 0

var gLevel = {
    size: 4,
    mines: 2
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

    gBoard = createBoard(gLevel.size, gLevel.mines)
    renderBoard(gBoard)

    gGame.isOn = true
    console.log('gBoard:', gBoard)
    // console.log('gLevel.size:', gLevel.size)
    // console.log('gLevel.mines:', gLevel.mines)
}

function htmlRestart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    document.querySelector('.min').innerText = '00'
    document.querySelector('.sec').innerText = '00'
}


function createBoard(boardSize, minesNum) {
    var size = boardSize
    // console.log('size:', size)

    var board = []
    for (var i = 0; i < size; i++) {

        board.push([])
        for (var j = 0; j < size; j++) {
            gCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = gCell
        }
    }
    randomCellForMines(boardSize, minesNum, board)
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
    if (!gGame.isOn) return
    var currCell = gBoard[i][j]

    gGame.shownCount++
    gFirstMove++
    startTimer()

    if (currCell.isShown) return
    //model
    gBoard[i][j].isShown = true

    if (currCell.isMine) {
        //dom
        elCell.innerText = MINE
        elCell.style.backgroundColor = 'black'
        gameOver(true)
        console.log('gameover')
    } else {
        var countNeg = setMinesNegsCount(i, j, gBoard)
        elCell.style.backgroundColor = '#b1bac3'
        if (countNeg) {
            elCell.innerText = countNeg
        } else {
            showNegs(i, j, gBoard)
        }
        if (gGame.shownCount === 16) clearInterval(gTimeInterval)
        console.log('gGame.secsPassed:', gGame.secsPassed)
        console.log('gGame:', gGame)
    }

    if (gGame.shownCount === gLevel.size ** 2) clearInterval(gTimeInterval)
    // console.log('gGame.secsPassed:', gGame.secsPassed)
    // console.log('gGame:', gGame)

}

function onClickLevel(boardSize, minesNum) {
    gLevel.size = boardSize
    gLevel.mines = minesNum

    var elFlag = document.querySelector('.flags span')
    elFlag.innerText = minesNum
    console.log('elFlag:', elFlag)

    onInitGame()
}

function onRightClick(elCell) {
    if (!gGame.isOn) return
    console.log('elCell:', elCell)

    const cellI = +elCell.dataset.i
    const cellJ = +elCell.dataset.j
    console.log('i:', cellI)
    console.log('j:', cellJ)

    var currCell = gBoard[cellI][cellJ]
    if (currCell.isShown) return
    gFirstMove++
    startTimer()
    // console.log('gGame:', gGame)

    // if(gGame.markedCount=0) elFlag.innerText= gLevel.mines
    // if(gGame.markedCount=0) elFlag.innerText= gLevel.mines

    var elFlag = document.querySelector('.flags span')

    if (!currCell.isMarked) {
        if (gGame.markedCount === gLevel.mines) return
        //modal 
        // currCell.isMarked = true

        //dom
        elCell.innerText = FLAG
        // console.log('gBoard:', gBoard)
        elFlag.innerText--
        gGame.markedCount++
    } else {
        //modal 
        // currCell.isMarked = false

        //dom
        elCell.innerText = ''
        elFlag.innerText++
        gGame.markedCount--

    }
    currCell.isMarked = !currCell.isMarked
}


function checkGameOver() {
    /// lose


}

function gameOver(msg) {
    gGame.isOn = false
    clearInterval(gTimeInterval)

    var elModal = document.querySelector('.modal')
    var elMsg = elModal.querySelector('.msg')
    if (msg) {
        elMsg.innerText = 'You lose!'
    } else {
        elMsg.innerText = 'You won!'
    }
    elModal.style.display = 'block'
}

function startTimer() {

    if (gFirstMove === 1) gTimeInterval = setInterval(timer, 1000)

    var elTimer = document.querySelector('.time')
    gGame.secsPassed = (elTimer.innerText)
}


function showNegs(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (i === cellI && j === cellJ) continue
            // console.log('mat[i][j]', mat[i][j])

            // Update the model :
            mat[i][j].isShown = true

            // Update the dom :
            var elTd = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elTd.style.backgroundColor = '#b1bac3'
            elTd.innerText = setMinesNegsCount(i, j, gBoard)

        }
    }
}




