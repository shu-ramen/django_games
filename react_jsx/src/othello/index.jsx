import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'

const empty = -1;
const black = 0;
const white = 1;
const cpuUrl = 'cpu2';

function getStoneTag(stone) {
    if (stone == black) {
        return (
            <img src="/static/images/dog.png" width="30" height="30"></img>
        )
    }
    else if (stone == white) {
        return (
            <img src="/static/images/cat.png" width="30" height="30"></img>
        )
    }
    else {
        return ""
    }
}

function addHeader(request) {
    let csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    return request
        .set('X-CSRFToken', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest');
}

function Square(props) {
    let stoneTag = getStoneTag(props.value);
    return (
        <button className="square" onClick={() => props.onClick()}>
            {stoneTag}
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

class Game extends React.Component {
    constructor() {
        super();
        // Create squares
        let squares = Array(64).fill(empty);
        squares[this.calcPos(4, 4)] = black;
        squares[this.calcPos(5, 4)] = white;
        squares[this.calcPos(4, 5)] = white;
        squares[this.calcPos(5, 5)] = black;

        this.state = {
            squares: squares,
            stepNumber: 0,
            player: black,
            isEnd: false,
        };
    }

    // 1 <= x, y <= 8
    calcPos(x, y) {
        return ((x-1) + (y-1)*8)
    }

    countStone(stone) {
        let count = 0;
        for (var idx in this.state.squares) {
            if (this.state.squares[idx] == stone) {
                count = count + 1;
            }
        }
        return count;
    }

    tick(player, squares, history, idx, isEnd, me) {
        let pos = history[idx];
        squares[pos] = player;
        idx = idx + 1;
        me.setState({
            squares: squares,
        });
        let timer = setTimeout(me.tick, 200, player, squares, history, idx, isEnd, me);
        if (idx >= history.length) {
            let nextPlayer = 1 - player;
            me.setState({
                stepNumber: me.state.stepNumber + 1,
                player: nextPlayer,
                isEnd: isEnd,
            });
            if (nextPlayer == white && !isEnd) {
                setTimeout(me.cpu, 100, nextPlayer, squares, me);
            }
            clearTimeout(timer);
        }
    }

    handleClick(i) {
        if (this.state.player == white) {
            alert("It is not your turn!");
        }

        const url = 'put_stone';

        addHeader(request.post(url))
            .send({
                player: this.state.player,
                squares: this.state.squares,
                put_pos: i,
            })
            .end(function (err, res) {
                if (err) {
                    alert(res.text);
                }
                console.dir(res);
                
                if (res.body['success']) {
                    this.tick(this.state.player, this.state.squares, res.body['history'], 0, res.body['isEnd'], this);
                }
                else {
                    alert('You cannot put there!!')
                }
            }.bind(this));
    }

    cpu(player, squares, me) {
        addHeader(request.post(cpuUrl))
        .send({
            player: player,
            squares: squares,
        })
        .end(function (err, res) {
            if (err) {
                alert(res.text);
            }
            console.dir(res);
            
            if (res.body['success']) {
                me.tick(player, squares, res.body['history'], 0, res.body['isEnd'], me);
            }
            else {
                me.cpuPass();
            }
        }.bind(this));
    }

    pass() {
        if (this.state.player == black) {
            this.setState({
                player : white,
            });
            this.cpu(white, this.state.squares, this);
        }
    }

    cpuPass() {
        alert('CPU passed its turn.');
        this.setState({
            player : black,
        });
    }
    
    render() {
        let blackCount = this.countStone(black);
        let whiteCount = this.countStone(white);
        
        let infoText = "";
        let infoTag = "";
        if (this.state.isEnd) {
            if (blackCount > whiteCount) {
                infoText = "Winner : ";
                infoTag = getStoneTag(black);
            }
            else if(whiteCount > blackCount) {
                infoText = "Winner : ";
                infoTag = getStoneTag(white);
            }
            else {
                infoText = "Draw";
                infoTag = ""
            }
        }
        else {
            infoText = "Next Player : ";
            infoTag = getStoneTag(this.state.player);
        }

        return (
            <div className="game">
                <div>
                <Board
                    squares={this.state.squares}
                    onClick={(i) => this.handleClick(i)}
                />
                </div>
                <div>
                    <div className="game-info">
                        <div>
                            <h1> {infoText} {infoTag} </h1>
                        </div>
                        <div>
                            <h1> {getStoneTag(black)} (YOU) : {blackCount} </h1>
                        </div>
                        <div>
                            <h1> {getStoneTag(white)} (CPU) : {whiteCount} </h1>
                        </div>
                        <div>
                            <button onClick={() => this.pass()}>PASS</button>
                        </div>
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