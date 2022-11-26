'use strict'


function randomCellForMines(boardSize, minesNum, board) {
    var i = 0
    while (i < minesNum) {
        var cellI = getRandomInt(0, boardSize)
        var cellJ = getRandomInt(0, boardSize)
        var cell = board[cellI][cellJ]

        if (!cell.isMine && !cell.isShown) {
            cell.isMine = true
            var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
            elCell.classList.add('mine')
            i++
        }
    }
}

function setMinesNegsCount(i, j, board) {
    var cell = board[i][j]
    cell.minesAroundCount = countNegs(i, j, board)
    return cell.minesAroundCount
}

function showAllMines() {
    var elTdMine = document.querySelectorAll(`.mine`)
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






