import React from 'react';
import { Movement } from './movement.jsx'

// データ定義
const SHOGI_PIECE_TYPES = {
    NONE:  -1,    // なし
    KING:   0,    // 王将
    ROOK:   1,    // 飛車
    BISHOP: 2,    // 角行
    GOLD:   3,    // 金将
    SILVER: 4,    // 銀将
    KNIGHT: 5,    // 桂馬
    LANCE:  6,    // 香車
    PAWN:   7,    // 歩兵
}

export const SHOGI_PIECES = {
    // EMPTY
    EMPTY:       new ShogiPiece(SHOGI_PIECE_TYPES.NONE,   false, false),
    // MY
    MY_KING:     new ShogiPiece(SHOGI_PIECE_TYPES.KING,   false, false),
    MY_ROOK:     new ShogiPiece(SHOGI_PIECE_TYPES.ROOK,   false, false),
    MY_ROOK_P:   new ShogiPiece(SHOGI_PIECE_TYPES.ROOK,    true, false),
    MY_BISHOP:   new ShogiPiece(SHOGI_PIECE_TYPES.BISHOP, false, false),
    MY_BISHOP_P: new ShogiPiece(SHOGI_PIECE_TYPES.BISHOP,  true, false),
    MY_GOLD:     new ShogiPiece(SHOGI_PIECE_TYPES.GOLD,   false, false),
    MY_SILVER:   new ShogiPiece(SHOGI_PIECE_TYPES.SILVER, false, false),
    MY_SILVER_P: new ShogiPiece(SHOGI_PIECE_TYPES.SILVER,  true, false),
    MY_KNIGHT:   new ShogiPiece(SHOGI_PIECE_TYPES.KNIGHT, false, false),
    MY_KNIGHT_P: new ShogiPiece(SHOGI_PIECE_TYPES.KNIGHT,  true, false),
    MY_LANCE:    new ShogiPiece(SHOGI_PIECE_TYPES.LANCE,  false, false),
    MY_LANCE_P:  new ShogiPiece(SHOGI_PIECE_TYPES.LANCE,   true, false),
    MY_PAWN:     new ShogiPiece(SHOGI_PIECE_TYPES.PAWN,   false, false),
    MY_PAWN_P:   new ShogiPiece(SHOGI_PIECE_TYPES.PAWN,    true, false),
    // ENEMY
    EN_KING:     new ShogiPiece(SHOGI_PIECE_TYPES.KING,   false,  true),
    EN_ROOK:     new ShogiPiece(SHOGI_PIECE_TYPES.ROOK,   false,  true),
    EN_ROOK_P:   new ShogiPiece(SHOGI_PIECE_TYPES.ROOK,    true,  true),
    EN_BISHOP:   new ShogiPiece(SHOGI_PIECE_TYPES.BISHOP, false,  true),
    EN_BISHOP_P: new ShogiPiece(SHOGI_PIECE_TYPES.BISHOP,  true,  true),
    EN_GOLD:     new ShogiPiece(SHOGI_PIECE_TYPES.GOLD,   false,  true),
    EN_SILVER:   new ShogiPiece(SHOGI_PIECE_TYPES.SILVER, false,  true),
    EN_SILVER_P: new ShogiPiece(SHOGI_PIECE_TYPES.SILVER,  true,  true),
    EN_KNIGHT:   new ShogiPiece(SHOGI_PIECE_TYPES.KNIGHT, false,  true),
    EN_KNIGHT_P: new ShogiPiece(SHOGI_PIECE_TYPES.KNIGHT,  true,  true),
    EN_LANCE:    new ShogiPiece(SHOGI_PIECE_TYPES.LANCE,  false,  true),
    EN_LANCE_P:  new ShogiPiece(SHOGI_PIECE_TYPES.LANCE,   true,  true),
    EN_PAWN:     new ShogiPiece(SHOGI_PIECE_TYPES.PAWN,   false,  true),
    EN_PAWN_P:   new ShogiPiece(SHOGI_PIECE_TYPES.PAWN,    true,  true),
}

function ShogiPiece(pieceType, isPromoted, isEnemy) {
    this.pieceType = pieceType;
    this.isPromoted = isPromoted;
    this.isEnemy = isEnemy;
    this.movement = movement;
}

// 駒コンポーネントクラス
export class ShogiPieceComponent extends React.Component {
    createPiece() {
        let value    = ""; // とりあえず用，いつか消す
        let className = "piece ";
        let style = {};
        // 駒設定
        switch (this.props.piece.pieceType) {
            case SHOGI_PIECE_TYPES.NONE:
                value = "";
                className += "";
                break;
            case SHOGI_PIECE_TYPES.KING:
                value = "王";
                className += "king ";
                break;
            case SHOGI_PIECE_TYPES.ROOK:
                value = "飛";
                className += "rook ";
                break;
            case SHOGI_PIECE_TYPES.BISHOP:
                value = "角";
                className += "bishop ";
                break;
            case SHOGI_PIECE_TYPES.GOLD:
                value = "金";
                className += "gold ";
                break;
            case SHOGI_PIECE_TYPES.SILVER:
                value = "銀";
                className += "silver ";
                break;
            case SHOGI_PIECE_TYPES.KNIGHT:
                value = "桂";
                className += "knight ";
                break;
            case SHOGI_PIECE_TYPES.LANCE:
                value = "香";
                className += "lance ";
                break;
            case SHOGI_PIECE_TYPES.PAWN:
                value = "歩";
                className += "pawn ";
                break;
            default:
                break;
        }

        if (this.props.piece.isPromoted) {
            className += "promoted";
        }
        
        if (this.props.piece.isEnemy) {
            style = { transform: "rotate(180deg)" };
        }

        return { value, className, style }
    }


    render() {
        let { value, className, style } = this.createPiece();

        return (
            <button className={className} style={style} onClick={() => this.props.onClick()}>
                {value}
            </button>
        );
    }
}