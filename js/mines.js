'use strict'

function randomCellForMines(boardSize, minesNum, board) {
    for (var i = 0; i < minesNum; i++) {
        var cellI = getRandomInt(0, boardSize)
        var cellJ = getRandomInt(0, boardSize)
        board[cellI][cellJ].isMine = true
    }
}

function setMinesNegsCount(i, j, board) {
    var cell = board[i][j]
    cell.minesAroundCount = countNegs(i, j, board)
    return cell.minesAroundCount
}

