import numpy as np

class Othello(object):
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
    def put(player, map, put_pos):
        if (map[put_pos] != -1):
            return False
        
        # マップを２次元配列に
        map = np.reshape(map, (8, 8))
        x, y = calcXY(put_pos)

        for v in Othello.VEC:
            pass
        
        return map

    @staticmethod
    def calcXY(pos):
        x = pos % 8
        y = int(pos/8)
        return x, y