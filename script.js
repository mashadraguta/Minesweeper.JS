//display/UI of the game
//1.populate the board with tiles/mines
// 2.left click on tiles
//2.1 reveal tiles
// 3.right click on tiles
//3.1 mark tiles
// 4. check for win/lose

import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose
} from './minesweeper.js'


const BOARD_SIZE = 10
const NR_MINES = 5


const board = createBoard(BOARD_SIZE, NR_MINES)
const boardEl = document.querySelector('.board')
const minesLeft = document.querySelector('.subtext-mines-left')
const messageText = document.querySelector('.subtext')

board.forEach(row => {
    row.forEach(tile => {
        boardEl.append(tile.el)
        tile.el.addEventListener('click', () => {                     //leftClick
            revealTile(board, tile)
            checkGameEnd()
        })
        tile.el.addEventListener('contextmenu', (e) => {               //rightClick
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})

boardEl.style.setProperty('--size', BOARD_SIZE)


minesLeft.innerHTML = NR_MINES

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter((tile => tile.status === TILE_STATUSES.MARKED)).length
    }, 0)
    minesLeft.innerHTML = NR_MINES - markedTilesCount
}


function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)
    if (win || lose) {
        boardEl.addEventListener("click", stopProp, { capture: true })
        boardEl.addEventListener("contextmenu", stopProp, { capture: true })
    }
    if (win) {
        messageText.innerHTML = "You won!"
    }
    if (lose) {
        messageText.innerHTML = "You lose"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}


function stopProp(e) {
    e.stopImmediatePropagation()
}