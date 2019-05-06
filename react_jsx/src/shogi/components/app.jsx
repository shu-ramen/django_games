import React from 'react';
import { Announce } from './announce.jsx';
import { Captured } from './captured.jsx';
import { Board } from './board.jsx';
import { SHOGI_PIECES as SP } from './board.jsx';

export default class App extends React.Component {
    constructor() {
        super();

        let pieces = [
            [SP.EN_LANCE, SP.EN_KNIGHT, SP.EN_SILVER, SP.EN_GOLD, SP.EN_KING, SP.EN_GOLD, SP.EN_SILVER, SP.EN_KNIGHT, SP.EN_LANCE],
            [SP.EMPTY,    SP.EN_ROOK,   SP.EMPTY,     SP.EMPTY,   SP.EMPTY,   SP.EMPTY,   SP.EMPTY,     SP.EN_BISHOP, SP.EMPTY   ],
            [SP.EN_PAWN,  SP.EN_PAWN,   SP.EN_PAWN,   SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN, SP.EN_PAWN,   SP.EN_PAWN,   SP.EN_PAWN ],
            [SP.EMPTY,    SP.EMPTY,     SP.EMPTY,     SP.EMPTY,   SP.EMPTY,   SP.EMPTY,   SP.EMPTY,     SP.EMPTY,     SP.EMPTY   ],
            [SP.EMPTY,    SP.EMPTY,     SP.EMPTY,     SP.EMPTY,   SP.EMPTY,   SP.EMPTY,   SP.EMPTY,     SP.EMPTY,     SP.EMPTY   ],
            [SP.EMPTY,    SP.EMPTY,     SP.EMPTY,     SP.EMPTY,   SP.EMPTY,   SP.EMPTY,   SP.EMPTY,     SP.EMPTY,     SP.EMPTY   ],
            [SP.MY_PAWN,  SP.MY_PAWN,   SP.MY_PAWN,   SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN, SP.MY_PAWN,   SP.MY_PAWN,   SP.MY_PAWN ],
            [SP.EMPTY,    SP.MY_BISHOP, SP.EMPTY,     SP.EMPTY,   SP.EMPTY,   SP.EMPTY,   SP.EMPTY,     SP.MY_ROOK,   SP.EMPTY   ],
            [SP.MY_LANCE, SP.MY_KNIGHT, SP.MY_SILVER, SP.MY_GOLD, SP.MY_KING, SP.MY_GOLD, SP.MY_SILVER, SP.MY_KNIGHT, SP.MY_LANCE]
        ];

        this.state = {
            pieces: pieces,
        }
    }

    render() {
        return (
            <div className="game">
                <Board
                    pieces={this.state.pieces}
                />
            </div>
        )
    }
}