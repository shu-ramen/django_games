import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'

function addHeader(request) {
    var csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    return request
        .set('X-CSRFToken', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest');
}

function Square(props) {
    var stone = ((props.value == empty) ? "" : ((props.value == black) ? "??" : "??"));
    return (
        <button className="square" onClick={() => props.onClick()}>
            {stone}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const squares = this.props.squares;
        return <Square value={squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                    {this.renderSquare(10)}
                    {this.renderSquare(11)}
                    {this.renderSquare(12)}
                    {this.renderSquare(13)}
                    {this.renderSquare(14)}
                    {this.renderSquare(15)}
                </div>
                <div className="board-row">
                    {this.renderSquare(16)}
                    {this.renderSquare(17)}
                    {this.renderSquare(18)}
                    {this.renderSquare(19)}
                    {this.renderSquare(20)}
                    {this.renderSquare(21)}
                    {this.renderSquare(22)}
                    {this.renderSquare(23)}
                </div>
                <div className="board-row">
                    {this.renderSquare(24)}
                    {this.renderSquare(25)}
                    {this.renderSquare(26)}
                    {this.renderSquare(27)}
                    {this.renderSquare(28)}
                    {this.renderSquare(29)}
                    {this.renderSquare(30)}
                    {this.renderSquare(31)}
                </div>
                <div className="board-row">
                    {this.renderSquare(32)}
                    {this.renderSquare(33)}
                    {this.renderSquare(34)}
                    {this.renderSquare(35)}
                    {this.renderSquare(36)}
                    {this.renderSquare(37)}
                    {this.renderSquare(38)}
                    {this.renderSquare(39)}
                </div>
                <div className="board-row">
                    {this.renderSquare(40)}
                    {this.renderSquare(41)}
                    {this.renderSquare(42)}
                    {this.renderSquare(43)}
                    {this.renderSquare(44)}
                    {this.renderSquare(45)}
                    {this.renderSquare(46)}
                    {this.renderSquare(47)} 
                </div>
                <div className="board-row">
                    {this.renderSquare(48)}
                    {this.renderSquare(49)}
                    {this.renderSquare(50)}
                    {this.renderSquare(51)}
                    {this.renderSquare(52)}
                    {this.renderSquare(53)}
                    {this.renderSquare(54)}
                    {this.renderSquare(55)}
                </div>
                <div className="board-row">
                    {this.renderSquare(56)}
                    {this.renderSquare(57)}
                    {this.renderSquare(58)}
                    {this.renderSquare(59)}
                    {this.renderSquare(60)}
                    {this.renderSquare(61)}
                    {this.renderSquare(62)}
                    {this.renderSquare(63)}
                </div>
            </div>
        );
    }
}

const empty = -1;
const black = 0;
const white = 1;

class Game extends React.Component {
    constructor() {
        super();
        
        // Create map
        var map = Array(64).fill(empty);
        map[this.calcPos(4, 4)] = black;
        map[this.calcPos(5, 4)] = white;
        map[this.calcPos(4, 5)] = white;
        map[this.calcPos(5, 5)] = black;

        this.state = {
            map: map,
            stepNumber: 0,
            player: black,
        };
    }

    // 1 <= x, y <= 8
    calcPos(x, y) {
        return ((x-1) + (y-1)*8)
    }

    calcXY(pos) {
        x = (pos % 8) + 1
        y = int(pos / 8) + 1
        return x, y
    }

    handleClick(i) {
        var url = 'put_stone'
        addHeader(request.post(url))
            .send({
                player: this.state.player,
                map: this.state.map,
                put_pos: i,
            })
            .end(function (err, res) {
                if (err) {
                    alert(res.text);
                }
                
                if (res.body['success']) {
                    this.setState({
                        map: res.body['map'],
                        stepNumber: (this.state.stepNumber + 1),
                        player: (1 - this.state.player),
                    });
                }
                else {
                    alert('You cannot put there!!')
                }
            }.bind(this));
    }
    
    render() {
        var status = 'Next plyer is ' + (this.state.player == black ? "??" : "??");

        return (
            <div className="game">
                <div>
                <Board
                    squares={this.state.map}
                    onClick={(i) => this.handleClick(i)}
                />
                </div>
                <div>
                    <div className="game-info">
                        <div>{status}</div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('container')
);