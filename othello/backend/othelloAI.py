import random

from abc import ABCMeta, abstractmethod
from othello.backend.othello import OthelloSystem, BitBoard

class OthelloAI(metaclass=ABCMeta):
    def __init__(self, player, squares):
        self._player = player
        self._squares = squares

    @property
    def player(self):
        return self._player
    
    @property
    def squares(self):
        return self._squares
    
    @abstractmethod
    def think(self):
        raise NotImplementedError()
    
    @classmethod
    def evaluate(board, k):
        pass

class RandomAI(OthelloAI):
    def __init__(self, player, squares):
        super().__init__(player, squares)

    def think(self):
        squares = None
        history = None
        # 置く場所があるか判断．なければパスをする．
        for i in range(64):
            temp_squares, temp_history = OthelloSystem.put(self._player, self._squares, i)
            if temp_squares is not None:
                break
            if i == 63:
                return None, None
        # ランダムに置いて最初にヒットしたところを選ぶ
        while (squares is None and history is None):
            idx = random.randrange(64)
            squares, history = OthelloSystem.put(self._player, self._squares, idx)
        return squares, history

class SimpleEvalAI(OthelloAI):
    def __init__(self, player, squares):
        super().__init__(player, squares)
    
    def think(self):
        playerBoard, cpuBoard = BitBoard.squaresToBits(self._squares)
        BitBoard.makeLegalBoard(blackBits, whiteBits)
        return None, None