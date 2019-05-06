import React from 'react';
import { Board } from './board.jsx';
import { SHOGI_PIECES as SP } from './shogi_piece.jsx';

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

        this.state = {
            pieces: pieces,
            selectPhase: true,
            movePhase: false,
            selectedPos: null,
        }
    }

    click_move(x, y) {
        alert("move");
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