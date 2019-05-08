import React from 'react';
import { SHOGI_PIECES as SP, ShogiPieceComponent, SHOGI_PIECE_TYPES as SPT } from './shogi_piece.jsx';

// データ定義
const VECTORS = [
    [-1, -1],
    [ 0, -1],
    [ 1, -1],
    [-1,  0],
    [ 1,  0],
    [-1,  1],
    [ 0,  1],
    [ 1,  1]
]

// 公開クラス
export class Board extends React.Component {
    calcMove() {
        // 盤面を取得
        let pieces = JSON.parse(JSON.stringify(this.props.pieces));
        // 選択個所を取得
        let x = this.props.selectedPos[0];
        let y = this.props.selectedPos[1];
        let selected = pieces[y][x];
        // 選択された駒を選択された状態にする
        pieces[y][x].isSelected = true;
        // 移動できる場所を検索
        let ignoreIdxList = [];
        for (let i = 0; i < 8; i++) {
            // 無視リストが埋まったら抜ける
            if (ignoreIdxList.length == VECTORS.length) {
                break;
            } 
            for (let j = 0; j < VECTORS.length; j++) {
                // 無視リストにあれば無視
                if (ignoreIdxList.includes(j) == false) {
                    let vx = 8 + (VECTORS[j][0] * (i + 1));
                    let vy = 8 + (VECTORS[j][1] * (i + 1));
                    this.checkAvailability(pieces, selected, ignoreIdxList, x, y, vx, vy, j);
                }
            }
        }
        return pieces;
    }

    checkAvailability(pieces, selected, ignoreIdxList, x, y, vx, vy, coef) {
        let tx = x + (vx - 8);
        let ty = y + (vy - 8);
        let isAvailable = selected.movement[vy][vx];
        if (isAvailable) {
            if (tx >= 0 && tx < 9 && ty >= 0 && ty < 9) {
                if (pieces[ty][tx].isEnemy == true) {
                    // 敵コマなら
                    ignoreIdxList.push(coef);
                    pieces[ty][tx].isAvailable = true;
                }
                else if (pieces[ty][tx].pieceType == SPT.NONE) {
                    // 空きマスなら
                    pieces[ty][tx].isAvailable = true;
                }
                else {
                    // 自コマなら
                    ignoreIdxList.push(coef);
                    pieces[ty][tx].isAvailable = false;
                }
            }
        }
        else {
            // 置けない場所なら
            if (tx >= 0 && tx < 9 && ty >= 0 && ty < 9) {
                if (selected.pieceType != SPT.KNIGHT && coef < 2) {
                    // 桂馬じゃなければ
                    ignoreIdxList.push(coef);
                    pieces[ty][tx].isAvailable = false;
                }
            }
        }
    }

    getPieceComponents(pieces) {
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
        if (piece.isSelected) {
            click_function = this.props.click_select;
        }
        else if (piece.isAvailable) {
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