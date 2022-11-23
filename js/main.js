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
            strHTML += `<td data-i="${i}" data-j="${j}" 
            onclick="onCellClicked(this, ${i},${j})"  
            oncontextmenu="javascript:onRightClick(this, ${i},${j});return false;"></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]

    gGame.shownCount++
    // console.log(' gGame.shownCount:', gGame.shownCount)

    startTimer()
    // console.log('gGame:', gGame)

    if (currCell.isShown) return
    else {
        //model
        gBoard[i][j].isShown = true
        // dom
        var countNeg = setMinesNegsCount(i, j, gBoard)

        var inCell = (currCell.isMine) ? MINE : countNeg
        elCell.style.backgroundColor = '#b1bac3'
        elCell.innerText = inCell

        if (gGame.shownCount === 16) clearInterval(gTimeInterval)
        // console.log('gGame.secsPassed:', gGame.secsPassed)
        // console.log('gGame:', gGame)
    }
}

function onClickLevel(boardSize, minesNum) {
    gLevel.size = boardSize
    gLevel.mines = minesNum

    onInitGame()
}



function onRightClick(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]

    startTimer()
    // console.log('gGame:', gGame)

    if (!currCell.isMarked) {
        if (gGame.markedCount === gLevel.mines) return
        //modal 
        // currCell.isMarked = true

        //dom
        elCell.innerText = FLAG
        // console.log('gBoard:', gBoard)
        gGame.markedCount++
    } else {
        //modal 
        // currCell.isMarked = false

        //dom
        elCell.innerText = ''
        gGame.markedCount--

    }
    currCell.isMarked = !currCell.isMarked
}


function startTimer() {
    if (gGame.shownCount === 1) gTimeInterval = setInterval(timer, 1000)

    var elTimer = document.querySelector('.time')
    gGame.secsPassed = (elTimer.innerText)
}