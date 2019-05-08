import React from 'react';
import { Announce } from './announce.jsx';
import { Captured } from './captured.jsx';
import { Board } from './board.jsx';
import { Log } from './log.jsx';
import { SHOGI_PIECES as SP, SHOGI_PIECE_TYPES as SPT } from './shogi_piece.jsx';

export default class App extends React.Component {
    constructor() {
        super();

        let pieces = [
            [SP.EN_LANCE, SP.EN_KNIGHT, SP.EN_SILVER, SP.EN_GOLD, SP.EN_KING, SP.EN_GOLD, SP.EN_SILVER, SP.EN_KNIGHT, SP.EN_LANCE],
            [SP.EMPTY, SP.EN_ROOK, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EN_BISHOP, SP.EMPTY],
            [SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN],
            [SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY],
            [SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY],
            [SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY],
            [SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN],
            [SP.EMPTY, SP.MY_BISHOP, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.EMPTY, SP.MY_ROOK, SP.EMPTY],
            [SP.MY_LANCE, SP.MY_KNIGHT, SP.MY_SILVER, SP.MY_GOLD, SP.MY_KING, SP.MY_GOLD, SP.MY_SILVER, SP.MY_KNIGHT, SP.MY_LANCE]
        ];

        let my_captured = [];
        let en_captured = [];

        this.state = {
            pieces: pieces,
            selectPhase: true,
            movePhase: false,
            selectedPos: null,
            my_captured: my_captured,
            en_captured: en_captured,
        }
    }

    click_move(x, y) {
        let pieces = JSON.parse(JSON.stringify(this.state.pieces));
        if (pieces[y][x].pieceType == SPT.NONE) {
            pieces[y][x] = pieces[this.state.selectedPos[1]][this.state.selectedPos[0]]
            pieces[this.state.selectedPos[1]][this.state.selectedPos[0]] = SP.EMPTY;
        }
        this.setState({
            pieces: pieces,
            selectPhase: true,
            movePhase: false,
            selectedPos: null,
        });
    }

    click_select(x, y) {
        this.setState({
            selectPhase: true,
            movePhase: false,
            selectedPos: [x, y],
        })
    }

    click_do_nothing(x, y) {
        this.setState({
            selectPhase: true,
            movePhase: false,
            selectedPos: null,
        })
    }

    click_put(i) {
        return;
    }

    render() {
        return (
            <div className="game">
                <Board
                    pieces={this.state.pieces}
                    selectPhase={this.state.selectPhase}
                    movePhase={this.state.movePhase}
                    selectedPos={this.state.selectedPos}
                    click_move={(x,y) => this.click_move(x,y)}
                    click_select={(x,y) => this.click_select(x,y)}
                    click_do_nothing={(x,y) => this.click_do_nothing(x,y)}
                />
            </div>
        )
    }
}