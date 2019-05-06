import React from 'react';
import { SHOGI_PIECES as SP, ShogiPieceComponent } from './shogi_piece.jsx';

// データ定義
const BOARD_SIZE = {
    ROW_LENGTH: 9,
    COL_LENGTH: 9,
}

// 公開クラス
export default class Board extends React.Component {
    getPieceComponents() {
        // 駒を配置する
        let pieceComponents = this.props.pieces.slice().map((row) =>
            <div className="board-row">
                {row.slice().map((col) => this.renderPieceComponent(col))}
            </div>
        ) 
        return (
            <div>
                { pieceComponents }
            </div>
        );
    }

    onClick() {
        alert("not yet");
    }

    renderPieceComponent(piece) {
        return (
            <ShogiPieceComponent
                piece={piece}
                onClick={this.onClick}
            />
        );
    }

    render() {
        const board = this.getPieceComponents();
        return (
            <div>
                {board}
            </div>
        );
    }
}