const X = 0; // だめ
const O = 1; // いい

const LT = [7, 7];  // 左上
const T  = [7, 8];  // 上
const RT = [8, 9];  // 右上
const L  = [8, 7];  // 左
const R  = [8, 9];  // 右
const LB = [9, 7];  // 左下
const B  = [9, 8];  // 下
const RB = [9, 9];  // 右下

// 空
const EMPTY_MOVE = (new Array(17)).fill((new Array(17)).fill(X));

export default class Movement {
    array_copy(array) {
        return JSON.parse(JSON.stringify(array));
    }

    make_it_move(move, positions) {
        for (let p of positions) {
            move[p[0]][p[1]] = O;
        }
    }

    king() {
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [LT, T, RT, L, R, LB, B, RB];
        this.make_it_move(move, positions);
        return move;
    }

    rook() {
        let move = this.array_copy(EMPTY_MOVE);
        let positions = []
        for (let i = 0; i < 8; i++) {
            positions.push([8, i]);
            positions.push([i, 8]);
            positions.push([i+8+1, 8]);
            positions.push([8, i+8+1]);
        }
        this.make_it_move(move, positions);
        return move;
    }

    rook_p() {
        let move = this.rook();
        let positions = [LT, RT, LB, RB];
        this.make_it_move(move, positions);
        return move;
    }
}