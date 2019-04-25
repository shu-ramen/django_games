import numpy as np

class Othello(object):
    EMPTY = -1
    BLACK = 0
    WHITE = 1

    VEC = [
        [-1, -1],
        [ 0, -1],
        [ 1, -1],
        [-1,  0],
        [ 1,  0],
        [-1,  1],
        [ 0,  1],
        [ 1,  1]
    ]

    @staticmethod
    def put(player, squares, put_pos):
        if (squares[put_pos] != Othello.EMPTY):
            return None
        
        # マップを２次元配列に
        squares = np.reshape(squares, (8, 8)).T
        x, y = Othello.calcXY(put_pos)

        count = 0
        for v in Othello.VEC:
            tx, ty = (x, y)
            temp_count = 0
            history = []
            while (tx > 0 and tx < 8 and ty > 0 and ty < 8):
                tx = tx + v[0]
                ty = ty + v[1]
                if squares[tx][ty] == Othello.EMPTY:
                    break
                elif squares[tx][ty] == player:
                    count = count + temp_count
                    if temp_count > 0:
                        for p in history:
                            squares[p[0]][p[1]] = player
                    break
                else:
                    temp_count = temp_count + 1
                    history.append([tx, ty])
        
        if count > 0:
            squares[x][y] = player
            squares = map(int, list(squares.T.flatten()))
            squares = list(squares)
            return squares
        else:
            return None

    @staticmethod
    def calcXY(pos):
        x = pos % 8
        y = int(pos/8)
        return x, y