'use strict'


function randomCellForMines(boardSize, minesNum, board) {
    for (var i = 0; i < minesNum; i++) {
        var cellI = getRandomInt(0, boardSize)
        // console.log('cellI:', cellI)

        var cellJ = getRandomInt(0, boardSize)
        // console.log('cellJ:', cellJ)
        board[cellI][cellJ].isMine = true
        // console.log('gBoard[cellI][cellJ]:', board[cellI][cellJ])
    }
}

function setMinesNegsCount(i, j, board) {
    var cell = board[i][j]
    cell.minesAroundCount = countNegs(i, j, board)
    return cell.minesAroundCount
}
