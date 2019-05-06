const NOT_AVAILABLE = 0; // だめ
const AVAILABLE = 1; // いい

const LT = [7, 7];  // 左上
const T  = [7, 8];  // 上
const RT = [8, 9];  // 右上
const L  = [8, 7];  // 左
const R  = [8, 9];  // 右
const LB = [9, 7];  // 左下
const B  = [9, 8];  // 下
const RB = [9, 9];  // 右下

// 空
const EMPTY_MOVE = (new Array(17)).fill((new Array(17)).fill(NOT_AVAILABLE));

export default class Movement {
    array_copy(array) {
        return JSON.parse(JSON.stringify(array));
    }
    make_it_move(move, positions) {
        for (let p of positions) {
            move[p[0]][p[1]] = AVAILABLE;
        }
        return move;
    }
    empty(){
        return EMPTY_MOVE;
    }
    //王
    king() {
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [LT, T, RT, L, R, LB, B, RB];
        return this.make_it_move(move, positions);
    }
    //飛車
    rook() {
        let move = this.array_copy(EMPTY_MOVE);
        let positions = []
        for (let i = 0; i < 8; i++) {
            positions.push([8, i]);
            positions.push([i, 8]);
            positions.push([i+8+1, 8]);
            positions.push([8, i+8+1]);
        }
        return this.make_it_move(move, positions);
    }
    //成飛車
    rook_p() {
        let move = this.array_copy(this.rook());
        let positions = [LT, RT, LB, RB];
        return this.make_it_move(move, positions);
    }
    //角
    bishop(){
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [];
        for (let i = 0; i < 8; i++) {
            positions.push([i, i]);
            positions.push([i+8+1, i+8+1]);
            positions.push([i+8+1, i]);
            positions.push([i, i+8+1]);
        }
        return this.make_it_move(move, positions);
    }
    //成角
    bishop_p(){
        let move = this.array_copy(this.bishop());
        let positions = [LT, T, RT, L, R, LB, B, RB];
        return this.make_it_move(move, positions);
    }
    //金
    gold(){
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [LT, T, RT, L, R, B];
        return this.make_it_move(move, positions);
    }
    //銀
    silver(){
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [LT, T, RT, LB, B, RB];
        return this.make_it_move(move, positions);
    }
    //桂馬
    knight(){
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [[6,7],[6,9]];
        return this.make_it_move(move, positions);
    }
    //香車
    lance(){
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [];
        for (let i = 0; i < 8; i++) {
            positions.push([i, 8]);
        }
        return this.make_it_move(move, positions);
    }
    //歩
    pown(){
        let move = this.array_copy(EMPTY_MOVE);
        let positions = [T];
        return this.make_it_move(move, positions);
    }
    

}