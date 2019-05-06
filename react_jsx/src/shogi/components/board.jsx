import React from 'react';
import { SHOGI_PIECES as SP, ShogiPieceComponent, SHOGI_PIECE_TYPES as SPT } from './shogi_piece.jsx';

// データ定義
const BOARD_SIZE = {
    ROW_LENGTH: 9,
    COL_LENGTH: 9,
}

// 公開クラス
export class Board extends React.Component {
    calcMove() {
        let pieces = JSON.parse(JSON.stringify(this.props.pieces));
        let x = this.props.selectedPos[0];
        let y = this.props.selectedPos[1];
        let selected = pieces[y][x];
        pieces[y][x].isSelected = true;
        if (selected.pieceType != SP.MY_KNIGHT) {
            let vectors = [
                [-1, -1],
                [ 0, -1],
                [ 1, -1],
                [-1,  0],
                [ 1,  0],
                [-1,  1],
                [ 0,  1],
                [ 1,  1]
            ]
            let ignoreIdxList = [];
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < vectors.length; j++) {
                    // 無視リストにあれば無視
                    if (ignoreIdxList.includes(j) == false) {
                        let vx = 8 + (vectors[j][0] * (i + 1));
                        let vy = 8 + (vectors[j][1] * (i + 1));
                        let isAvailabel = selected.movement[vy][vx];
                        if (isAvailabel) {
                            let tx = x + (vx - 8);
                            let ty = y + (vy - 8);
                            if (tx >= 0 && tx < 9 && ty >= 0 && ty < 9) {
                                if (pieces[ty][tx].isEnemy == true) {
                                    ignoreIdxList.push(j);
                                    pieces[ty][tx].isAvailable = true;
                                }
                                else if (pieces[ty][tx].pieceType == SPT.NONE) {
                                    pieces[ty][tx].isAvailable = true;
                                }
                                else {
                                    ignoreIdxList.push(j);
                                    pieces[ty][tx].isAvailable = false;
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            for (let vy = 0; vy < 17; vy++) {
                for (let vx = 0; vx < 17; vx++) {
                    let isAvailabel = selected.movement[vy][vx];
                    if (isAvailabel) {
                        let tx = x + (vx - 8);
                        let ty = y + (vy - 8);
                        if (tx >= 0 && tx < 9 && ty >= 0 && ty < 9) {
                            if (pieces[ty][tx].isEnemy == true || pieces[ty][tx].pieceType == SPT.EMPTY) {
                                pieces[ty][tx].isAvailable = true;
                            }
                        }
                    }
                }
            }
        }
        return pieces;
    }

    getPieceComponents(pieces) {
        console.dir(pieces);
        // 駒を配置する
        let pieceComponents = pieces.slice().map((row, y) =>
            <div className="board-row">
                {row.slice().map((col, x) => this.renderPieceComponent(col, x, y))}
            </div>
        ) 
        return (
            <div>
                { pieceComponents }
            </div>
        );
    }

    renderPieceComponent(piece, x, y) {
        let click_function = null;
        if (this.isSelected) {
            click_function = this.props.click_select;
        }
        else if (this.isAvailabel) {
            click_function = this.props.click_move;
        }
        else {
            if (piece.isEnemy == false && piece.pieceType != SPT.NONE) {
                click_function = this.props.click_select;
            }
            else {
                click_function = this.props.click_do_nothing;
            }
        }
        return (
            <ShogiPieceComponent
                piece={piece}
                onClick={() => click_function(x, y)}
            />
        );
    }

    render() {
        let board = null;
        if (this.props.selectPhase) {
            if (this.props.selectedPos != null) {
                let pieces = this.calcMove();
                board = this.getPieceComponents(pieces);
            }
            else {
                let pieces = JSON.parse(JSON.stringify(this.props.pieces));
                board = this.getPieceComponents(pieces);
            }
        }
        else if (this.props.movePhase) {
            // 動かすフェーズ
        }
        return (
            <div>
                {board}
            </div>
        );
    }
}