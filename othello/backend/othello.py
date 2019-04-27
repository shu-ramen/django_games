import numpy as np

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
    def put(player, squares, putPos):
        if (squares[putPos] != OthelloSystem.EMPTY):
            return None, None
        
        # マップを２次元配列に
        squares = np.reshape(squares, (8, 8)).T
        x, y = OthelloSystem.calcXY(putPos)

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
    def isEnd(squares):
        blackBoard, whiteBoard = BitBoard.squaresToBoard(squares)
        blackLegalBoard = BitBoard.makeLegalBoard(blackBoard, whiteBoard)
        whiteLegalBoard = BitBoard.makeLegalBoard(whiteBoard, blackBoard)
        if blackLegalBoard == 0 and whiteLegalBoard == 0:
            return True
        else:
            return False

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

    @staticmethod
    def squaresToBoard(squares):
        blackBoard = 0x0000000000000000
        whiteBoard = 0x0000000000000000
        mask       = 0x8000000000000000
        for i in range(64):
            if squares[i] == OthelloSystem.BLACK:
                blackBoard = blackBoard + mask
            if squares[i] == OthelloSystem.WHITE:
                whiteBoard = whiteBoard + mask
            mask = mask >> 1
        return blackBoard, whiteBoard
    
    @staticmethod
    def countBoard(board):
        count = 0
        mask = 0x8000000000000000
        for i in range(64):
            if mask & board:
                count = count + 1
            mask = mask >> 1
        return count

    @staticmethod
    def getIndices(board):
        indices = []
        mask = 0x8000000000000000
        for i in range(64):
            if mask & board:
                indices.append(i)
            mask = mask >> 1
        return indices
    
    @staticmethod
    def boardToSquares(blackBoard, whiteBoard):
        squares =[]
        mask = 0x8000000000000000
        for i in range(64):
            if blackBoard & mask:
                squares.append(OthelloSystem.BLACK)
            elif whiteBoard & mask:
                squares.append(OthelloSystem.WHITE)
            else:
                squares.append(OthelloSystem.EMPTY)
            mask = mask >> 1
        return squares
    
    # 合法手を作成する関数
    @staticmethod
    def makeLegalBoard(myBoard, enemyBoard):
        boardMask           =              0xffffffffffffffff     # 盤面を8x8に収めるマスク
        temp                =              0x0000000000000000     # 隣に相手の色があるかを一時保存
        legalBoard          =              0x0000000000000000     # 合法手ボード
        horizontalWatchMask = enemyBoard & 0x7e7e7e7e7e7e7e7e     # 敵コマを考慮した左右端の番人のマスク（左右の走査に使う）
        verticalWatchMask   = enemyBoard & 0x00ffffffffffff00     # 敵コマを考慮した上下端の番人のマスク（上下の走査に使う）
        allSideWatchMask    = enemyBoard & 0x007e7e7e7e7e7e00     # 敵コマを考慮した全辺の番人のマスク　（斜めの走査に使う）
        blankBoard          = ~(myBoard | enemyBoard) & boardMask # 空白を示すボード．空きは1．64bit（8x8）に収めている，

        # 左上                                     # 一つだけ解説を加えておく．
        temp = allSideWatchMask & (myBoard << 9)   # 自分の盤を左上にずらして敵駒がある限り追従する．はみ出したコマは消す．
        for i in range(5):                         # この操作を５回繰り返す．
            temp |= allSideWatchMask & (temp << 9) # ずらし操作
        legalBoard |= blankBoard & (temp << 9)     # もう一度ずらし操作を行い，敵駒を追跡した先が空いていれば置けるので，これは合法手となる．

        # 上
        temp = verticalWatchMask & (myBoard << 8)
        for i in range(5):
            temp |= verticalWatchMask & (temp << 8)
        legalBoard |= blankBoard & (temp << 8)

        # 右上
        temp = allSideWatchMask & (myBoard << 7)
        for i in range(5):
            temp |= allSideWatchMask & (temp << 7)
        legalBoard |= blankBoard & (temp << 7)

        # 左
        temp = horizontalWatchMask & (myBoard << 1)
        for i in range(5):
            temp |= horizontalWatchMask & (temp << 1)
        legalBoard |= blankBoard & (temp << 1)

        # 右
        temp = horizontalWatchMask & (myBoard >> 1)
        for i in range(5):
            temp |= horizontalWatchMask & (temp >> 1)
        legalBoard |= blankBoard & (temp >> 1)

        # 左下
        temp = allSideWatchMask & (myBoard >> 7)
        for i in range(5):
            temp |= allSideWatchMask & (temp >> 7)
        legalBoard |= blankBoard & (temp >> 7)

        # 下
        temp = verticalWatchMask & (myBoard >> 8)
        for i in range(5):
            temp |= verticalWatchMask & (temp >> 8)
        legalBoard |= blankBoard & (temp >> 8)

        # 右下
        temp = allSideWatchMask & (myBoard >> 9)
        for i in range(5):
            temp |= allSideWatchMask & (temp >> 9)
        legalBoard |= blankBoard & (temp >> 9)

        return legalBoard

    # 反転させる関数
    # putPosは置く場所1ビット分だけ1になっている64ビット
    @staticmethod
    def reverse(myBoard, enemyBoard, putPos):
        reverseBoard = 0x0000000000000000
        for vec in BitBoard.VEC:
            tempBoard = 0x0000000000000000
            mask = BitBoard.transfer(putPos, vec) # posからvec方向に進む
            while ((mask != 0) and ((mask & enemyBoard) != 0)):
                # 範囲内にあり，捜査線上に敵コマが存在する限り繰り返す
                tempBoard |= mask
                mask = BitBoard.transfer(mask, vec) # どんどんvec方向に進む
            if ((mask & myBoard) != 0):
                # 進んだ先に自コマがあればひっくり返す
                reverseBoard |= tempBoard
        myBoard    ^= putPos | reverseBoard # 置いた駒と反転したコマの位置でXOR
        enemyBoard ^= reverseBoard          # 反転したコマの位置でXOR
        return myBoard, enemyBoard, reverseBoard
    
    # vec方向にposを移動させる関数
    def transfer(putPos, vec):
        if (vec == -9): # 左上
            return (putPos << 9) & 0xfefefefefefefe00
        if (vec == -8): # 上
            return (putPos << 8) & 0xffffffffffffff00
        if (vec == -7): # 右上
            return (putPos << 7) & 0x7f7f7f7f7f7f7f00
        if (vec == -1): # 左
            return (putPos << 1) & 0xfefefefefefefefe
        if (vec == 1): # 右
            return (putPos >> 1) & 0x7f7f7f7f7f7f7f7f
        if (vec == 7): # 左下
            return (putPos >> 7) & 0x00fefefefefefefe
        if (vec == 8): # 下
            return (putPos >> 8) & 0x00ffffffffffffff
        if (vec == 9): # 右下
            return (putPos >> 9) & 0x007f7f7f7f7f7f7f
        return 0x0000000000000000
    
    @staticmethod
    def canPut(myBoard, enemyBoard):
        myLegalBoard = BitBoard.makeLegalBoard(myBoard, enemyBoard)
        if myLegalBoard != 0:
            return True
        else:
            return False