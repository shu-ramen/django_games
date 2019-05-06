import random

from abc import ABCMeta, abstractmethod
from othello.backend.othello import OthelloSystem, BitBoard
from othello.backend.eval import Evaluator

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
        playerBoard, cpuBoard = BitBoard.squaresToBoard(self._squares)
        legalBoard = BitBoard.makeLegalBoard(cpuBoard, playerBoard)
        legalIndices = BitBoard.getIndices(legalBoard)
        maxScore = -999
        putPos = -1
        for idx in legalIndices:
            temp_cpuBoard, temp_playerBoard, reverseBoard = BitBoard.reverse(cpuBoard, playerBoard, idx)
            temp_score = Evaluator.evaluate(0, temp_cpuBoard, temp_playerBoard)
            print(temp_score)
            if temp_score > maxScore:
                maxScore = temp_score
                putPos = idx
        return OthelloSystem.put(self._player, self._squares, putPos)

class DeepEvalAI(OthelloAI):
    DEPTH = 4

    def __init__(self, player, squares):
        super().__init__(player, squares)
    
    def think(self):
        playerBoard, cpuBoard = BitBoard.squaresToBoard(self._squares)
        putPos = DeepEvalAI.deepThink(DeepEvalAI.DEPTH, playerBoard, cpuBoard, True)
        return OthelloSystem.put(self._player, self._squares, putPos)
    
    @staticmethod
    def deepThink(depth, playerBoard, cpuBoard, isMe):
        if isMe:
            legalBoard = BitBoard.makeLegalBoard(cpuBoard, playerBoard)
        else:
            legalBoard = BitBoard.makeLegalBoard(playerBoard, cpuBoard)
        legalIndices = BitBoard.getIndices(legalBoard)
        scores = []
        for i, idx in enumerate(legalIndices):
            if isMe:
                temp_cpuBoard, temp_playerBoard, reverseBoard = BitBoard.reverse(cpuBoard, playerBoard, idx)
            else:
                temp_playerBoard, temp_cpuBoard, reverseBoard = BitBoard.reverse(playerBoard, cpuBoard, idx)
            temp_score = Evaluator.evaluate(0, temp_cpuBoard, temp_playerBoard)
            if depth == 0:
                scores.append(temp_score)
            else:
                scores.append(temp_score + DeepEvalAI.deepThink(depth-1, temp_playerBoard, temp_cpuBoard, not(isMe)))
        if len(scores) > 0:
            if isMe:
                maxScore = -999
                putPos = -999
                for score, idx in zip(scores, legalIndices):
                    if score > maxScore:
                        maxScore = score
                        putPos = idx
                if depth == DeepEvalAI.DEPTH:
                    return putPos
                else:
                    return maxScore # 利益を最大化する
            else:
                return min(scores)  # 相手はリスクを最小化してくると想定
        else:
            return 0