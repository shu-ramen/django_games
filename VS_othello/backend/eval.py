from othello.backend.othello import BitBoard

class Evaluator(object):
    K = 1

    SCORES = [
        [
             30, -12,  0, -1, -1,  0, -12,  30,
            -12, -15, -3, -3, -3, -3, -15, -12,
              0,  -3,  0, -1, -1,  0,  -3,   0,
             -1,  -3, -1, -1, -1, -1,  -3,  -1,
             -1,  -3, -1, -1, -1, -1,  -3,  -1,
              0,  -3,  0, -1, -1,  0,  -3,   0,
            -12, -15, -3, -3, -3, -3, -15, -12,
             30, -12,  0, -1, -1,  0, -12,  30
        ]
    ]

    
    @staticmethod
    def evaluate(scoreId, myBoard, enemyBoard):
        boardScore = Evaluator.evaluate_boardScore(scoreId, myBoard, enemyBoard)
        legalScore = Evaluator.evaluate_legalScore(myBoard, enemyBoard)
        return (legalScore + (Evaluator.K * boardScore))
    
    @staticmethod
    def evaluate_boardScore(scoreId, myBoard, enemyBoard):
        myIndices = BitBoard.getIndices(myBoard)
        enemyIndices = BitBoard.getIndices(enemyBoard)
        myScore = 0
        enemyScore = 0
        for idx in myIndices:
            myScore += Evaluator.SCORES[scoreId][idx]
        for idx in enemyIndices:
            enemyScore += Evaluator.SCORES[scoreId][idx]
        return myScore - enemyScore

    @staticmethod
    def evaluate_legalScore(myBoard, enemyBoard):
        myLegalBoard = BitBoard.makeLegalBoard(myBoard, enemyBoard)
        enemyLegalBoard = BitBoard.makeLegalBoard(enemyBoard, enemyBoard)
        return BitBoard.countBoard(myLegalBoard) - BitBoard.countBoard(enemyLegalBoard)