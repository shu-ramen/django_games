import numpy as np
import random

class OthelloSystem(object):
    EMPTY = -1
    BLACK = 0
    WHITE = 1

    VEC = [
        [-1, -1], [ 0, -1], [ 1, -1],
        [-1,  0],           [ 1,  0],
        [-1,  1], [ 0,  1], [ 1,  1]
    ]

    @staticmethod
    def put(player, squares, put_pos):
        if (squares[put_pos] != OthelloSystem.EMPTY):
            return None, None
        
        # マップを２次元配列に
        squares = np.reshape(squares, (8, 8)).T
        x, y = OthelloSystem.calcXY(put_pos)

        count = 0
        history = [OthelloSystem.calcPos(x, y)]
        for v in OthelloSystem.VEC:
            tx, ty = (x+v[0], y+v[1])
            temp_count = 0
            temp_history = []
            while (tx >= 0 and tx < 8 and ty >= 0 and ty < 8):
                if squares[tx][ty] == OthelloSystem.EMPTY:
                    break
                elif squares[tx][ty] == player:
                    count = count + temp_count
                    if temp_count > 0:
                        for p in temp_history:
                            squares[p[0]][p[1]] = player
                            history.append(OthelloSystem.calcPos(p[0], p[1]))
                    break
                else:
                    temp_count = temp_count + 1
                    temp_history.append([tx, ty])
                tx = tx + v[0]
                ty = ty + v[1]
        
        if count > 0:
            squares[x][y] = player
            squares = map(int, list(squares.T.flatten()))
            squares = list(squares)
            return squares, history
        else:
            return None, None

    @staticmethod
    def calcXY(pos):
        x = pos % 8
        y = int(pos/8)
        return x, y
        
    @staticmethod
    def calcPos(x, y):
        pos = x + y * 8
        return pos

class BitBoard(object):
    VEC = [-9, -8, -7, -1, 1, 7, 8, 9]

    def __init__(self, squares):
        self._blackBits, self._whiteBits = BitBoard.squaresToBits(squares)

    @property
    def blackBits(self):
        return self._blackBits
    
    @property
    def whiteBits(self):
        return self._whiteBits

    @staticmethod
    def squaresToBits(squares):
        blackBits = 0x0000000000000000
        whiteBits = 0x0000000000000000
        mask = 0x8000000000000000
        for i in range(64):
            mask = mask >> 1
            if squares[i] == OthelloSystem.BLACK:
                blackBits = blackBits + mask
            if squares[i] == OthelloSystem.WHITE:
                whiteBits = whiteBits + mask
        return blackBits, whiteBits


class OthelloAI(object):
    METHOD_RANDOM = 0
    METHOD_EVALFUNC = 1

    @staticmethod
    def think(method, player, squares):
        if (method == OthelloAI.METHOD_RANDOM):
            return OthelloAI.random_put(squares, player)
        elif (method == OthelloAI.METHOD_EVALFUNC):
            return OthelloAI.eval_func(squares, player)
        else:
            return None, None
    
    @staticmethod
    def random_put(squares, player):
        new_squares = None
        history = None
        while (new_squares is None and history is None):
            idx = random.randrange(64)
            new_squares, history = OthelloSystem.put(player, squares, idx)
        return new_squares, history
    
    @staticmethod
    def eval_func(squares, player):
        bitBoard = BitBoard(squares)
        print(format(bitBoard.blackBits, "b").zfill(64))
        print(format(bitBoard.whiteBits, "b").zfill(64))
        return None, None