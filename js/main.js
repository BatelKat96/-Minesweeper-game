'use strict'

var gBoard
// var gSize = 4
const MINE = '💣'
const flag = '🚩'
var gCell
var inCell
var gTimeInterval

var gLevel = {
    size: 4,
    mines: 2
}

// var shownCount = 0
// var cell ={
//     minesAroundCount: 4, ///כמה מוקשים מסביב
//     isShown: false,   ////האם התא חשוף
//     isMine: false, // האם יש בו מוקש
//     isMarked: true /// האם יש עליו דגל 
// }

var gGame = {
    isOn: false, // האם המשחק התחיל
    shownCount: 0,  // כמה תאים נחשפו
    markedCount: 0, // על כמה תאים יש דגל
    secsPassed: 0 /// כמה זמןעבר מתחילת המשחק
}


function onInitGame() {
    gBoard = createBoard()
    console.log('gBoard:', gBoard)
    renderBoard(gBoard)


}

function createBoard() {
    var size = gLevel.size
    console.log('size:', size)

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
            board[i][j].isMine = (Math.random() < 0.15) ? true : false
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            // var currCell = board[i][j]

            strHTML += `<td data-i="${i}" data-j="${j}" 
            onclick="onCellClicked(this, ${i},${j})" ></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML += strHTML
}

function onCellClicked(elCell, i, j) {

    var currCell = gBoard[i][j]

    if (currCell.isShown) return

    else {
        gGame.shownCount++
        console.log(' gGame.shownCount:', gGame.shownCount)
        console.log('gGame:', gGame)
        if (gGame.shownCount === 1) gTimeInterval = setInterval(timer, 1000)
        //model
        gBoard[i][j].isShown = true
        // dom
        var countNeg = setMinesNegsCount(i, j, gBoard)
        var inCell = (currCell.isMine) ? MINE : countNeg
        elCell.style.backgroundColor = '#b1bac3'
        elCell.innerText = inCell

        if (gGame.shownCount === 16) clearInterval(gTimeInterval)
    }
}

function setMinesNegsCount(i, j, board) {
    var cell = board[i][j]
    cell.minesAroundCount = countNegs(i, j, board)
    return cell.minesAroundCount
}


function randomCellForMines(boardSize, minesNum) {
    for (var i = 0; i < minesNum; i++) {
        var cellI = getRandomInt(0, boardSize)
        console.log('cellI:', cellI)

        var cellJ = getRandomInt(0, boardSize)
        console.log('cellJ:', cellJ)
        gBoard[cellI][cellJ].isMine = true
        console.log('gBoard[cellI][cellJ]:', gBoard[cellI][cellJ])

    }


}