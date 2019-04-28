import React from "react";

import Board from './board.jsx';

const H=14;
const W=10;
let complement=new Array(W).fill(0);
let init_board=JSON.parse(JSON.stringify((new Array(H+2)).fill((new Array(W+2)).fill(0))));
for(let i=0;i<=H+1;i++){
  for(let j=0;j<=W+1;j++){
    if((i===0||i===H+1)||(j===0||j===W+1)){
      init_board[i][j]=-1;
    }
  }
}
complement.push(-1);
complement.unshift(-1);
const obj_set={
  s:[[0,1],[1,0],[1,1],[2,0]],
  z:[[0,0],[0,1],[1,1],[1,2]],
  i:[[0,0],[1,0],[2,0],[3,0]],
  o:[[0,1],[1,0],[1,1],[0,0]],
  t:[[1,0],[0,1],[1,1],[1,2]],
  j:[[0,0],[0,1],[1,1],[2,1]],
  l:[[0,0],[0,1],[1,0],[2,0]],
};
const obj_base=["s","z","i","o","t","j","l"];
const init_pos=[1,parseInt(W/2)];

class KeyInput extends React.Component{
  //キーボード入力の処理
  getKey(input_key) {
    //console.log(input_key);
    if(this.props.game_status){
      switch(input_key){
        default:
        break;
        case 39:
        this.props.move(0,1);
        break;
        case 37:
        this.props.move(0,-1);
        break;
        case 38:
        this.props.move(-1,0);
        break;
        case 40:
        this.props.fall();
        break;
        case 32://space key
        this.props.keep();
        break;
        case 13://enter key
        this.props.rotate(1,-1);
        break;
        case 16://shift key
        this.props.rotate(-1,1);
        break;

      }
    }
  }
  render(){
    return(
    <input type="text" onKeyDown={(e)=>this.getKey(e.keyCode)}></input>
    );
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.test=this.test.bind(this);
  }
  test(){
    this.props.game();
  }


  render(){
    
    return(
      <div>
      <button onClick={this.test}></button>
      <KeyInput move={this.props.move} fall={this.props.fall} game_status={this.props.game_status} keep={this.props.keep} rotate={this.props.rotate}/>
      </div>
    );
  }
  

}


export default class App extends React.Component {
  //初期化
  constructor(props) {
    
    //init_board[7][3]=-1;
    
    
    super(props);
    this.state = {
      squares:init_board,
      draw:init_board,
      pos: init_pos,
      now:{form:"", obj:[]},
      next:{form:"", obj:[]},
      keep:{form:"", obj:[]},
      keep_flag:true,
      game_status:true,
      score:0,
      fall_flag:false,
    };
    this.init_game=this.init_game.bind(this);
    this.moveBlock=this.moveBlock.bind(this);
    this.fallBlock=this.fallBlock.bind(this);
    this.keepBlock=this.keepBlock.bind(this);
    this.rotateBlock=this.rotateBlock.bind(this);
    
  }
  componentWillMount(){
    console.log("will mount");
    //this.generateObj();
  }

  //ブロックの生成
  generateObj(){
    const ran=Math.floor(Math.random() * Math.floor(obj_base.length));
    const new_base=obj_base[ran];
    const new_next={form:new_base,obj:obj_set[new_base]}
    let now;
    if(this.state.next.obj.length===0){
      const c=obj_base[Math.floor(Math.random() * Math.floor(obj_base.length))];
      const n={form:c,obj:obj_set[c]};
      now=n;
    }
    else{
      now=this.state.next;
    }
    //this.setState((state)=>{return({next:new_next,keep_flag:true})});
    this.setState({next:new_next,keep_flag:true,fall_flag:false,now:now});
  }


  keepBlock(){

    if(this.state.keep_flag){
      console.log("keep");
      if(this.state.keep.obj.length===0){
        //this.setState(()=>{return{keep:this.state.now,pos:init_pos}},()=>this.generateObj());
        this.setState({keep:this.state.now});
        this.generateObj();
      }
      else{
        this.setState((state)=>{return{keep:state.now,now:state.keep};});

      }
      this.setState(()=>{return{keep_flag:false,pos:init_pos}},()=>console.log(this.state.keep.form));
    }
    
  }

  rotateBlock(y_rot,x_rot){
    let copy_obj={};
    Object.assign(copy_obj,this.state.now);
    let rotate_tmp=JSON.parse(JSON.stringify(this.state.now.obj));
    let rotate_obj=rotate_tmp.map((each)=>[each[1]*y_rot,each[0]*x_rot]);
    let x_min=0,y_min=0,x_max=W,y_max=H;
    for(let i=0;i<rotate_obj.length;i++){
      x_min=Math.min(x_min,rotate_obj[i][1]);
      y_min=Math.min(y_min,rotate_obj[i][0]);

    }
    console.log(y_max,x_max);
    //rotate_obj=rotate_obj.map((each)=>[each[0]+y_min*(-1)+H-y_max,each[1]+x_min*(-1)+W-x_max]);
    rotate_obj=rotate_obj.map((each)=>[each[0]+y_min*(-1),each[1]+x_min*(-1)]);
    copy_obj.obj=rotate_obj;
    let pos_check=rotate_obj.map((each)=>[each[0]+this.state.pos[0],each[1]+this.state.pos[1]])
    let new_pos=[0,0];
    const tmp_pos=this.state.pos.slice();
    /*改修します
    for(let i=0;i<pos_check.length;i++){
      if(pos_check[i][0]-H>new_pos[0]){
        new_pos[0]=pos_check[i][0]-H;
      }
      if(pos_check[i][1]-W>new_pos[1]){
        new_pos[1]=pos_check[i][1]-W;
      }
    }
    */
    const set_pos=[tmp_pos[0]-new_pos[0],tmp_pos[1]-new_pos[1]];
    this.setState({now:copy_obj,pos:set_pos});

  }




  moveBlock(h,w){
    let new_pos=this.state.pos.slice();
    new_pos[0]+=h;
    new_pos[1]+=w;

    //let copySquare=JSON.parse(JSON.stringify(this.state.squares));
    let block=this.state.now.obj.slice().map((each)=>[each[0]+new_pos[0],each[1]+new_pos[1]]);
    //let block=block_tmp.map((each)=>[each[0]+new_pos[0],each[1]+new_pos[1]]);
    let flag=true;
    for(let i=0;i<block.length;i++){
      if(this.state.squares[block[i][0]][block[i][1]]!==0){
      flag=false;
      break;
      }
    }
    if(flag){
      this.setState({pos:new_pos});
    }
    else{
      this.setState({pos:this.state.pos});
    }

    return flag;
    

  }
  fallBlock(){
    const test=this.moveBlock(1,0);
    if(test===false){
      //clearInterval(this.ID);
      //this.setState(()=>this.setBlock(),()=>{this.game()});
      this.setState(()=>this.setBlock());
    }
  }

  setBlock(){
    let copySquare=JSON.parse(JSON.stringify(this.state.squares));
    let block=this.state.now.obj.slice().map((each)=>[each[0]+this.state.pos[0],each[1]+this.state.pos[1]]);
      for (let i=0;i<block.length;i++){
        copySquare[block[i][0]][block[i][1]]=-1;
      }
      return {squares:copySquare,pos:init_pos,fall_flag:true};
      
      //this.setState({squares:copySquare,pos:init_pos});


  }

  //列が揃っていたら消す
  clearBlock(){
    let copySquare=JSON.parse(JSON.stringify(this.state.squares));
    let hoge=[];
    for(let i=1;i<this.state.squares.length-1;i++){
      if(this.state.squares[i].slice(1,W+1).reduce((total, data) => {return total + data})<=W*(-1)){
        hoge.push(i);
      }
    }
    for(let i of hoge){
      copySquare.splice(i,1);
      copySquare.splice(1,0,complement);
    }
    return(copySquare);
    

  }
  endCheck(){
    const check=this.moveBlock(0,0);
    if(!(check)){
      //this.setState(()=>{return{game_status:false,draw:this.state.squares};},alert("game over"));
      this.setState(()=>{return{game_status:false,draw:this.state.squares};},alert("game over"));
      //this.setBlock();
      clearInterval(this.ID);
    }

  }

  init_game(){
    this.setState(()=>({now:{obj:[],form:""},next:{obj:[],form:""},keep:{obj:[],form:""},pos:init_pos,game_status:true}),()=>this.generateObj());
    //this.generateObj();
    this.setState(()=>{return{squares:init_board};});
    if(typeof(this.ID)!== 'undefined'){
      console.log("stop");
      clearInterval(this.ID);
      delete this.ID;
    }
    else{
    console.log("start");
    this.ID=setInterval(()=>this.game(),1000);
    }
  }



  game(){
    if(this.state.fall_flag){
    this.generateObj();
    //列が揃っていたら消す
    //ゲームの終了判定
    //新しく生成されたブロックが重なったら終了
    this.setState(()=>{return{squares:this.clearBlock()};},()=>{this.endCheck()});
    }
    this.fallBlock();
  }



  getKey(input_key) {
    //console.log(input_key);
    if(this.state.game_status){
      switch(input_key){
        default:
        break;
        case 39:
        this.moveBlock(0,1);
        break;
        case 37:
        this.moveBlock(0,-1);
        break;
        case 38:
        this.moveBlock(-1,0);
        break;
        case 40:
        this.fallBlock();
        break;
        case 32://space key
        this.keepBlock();
        break;
        case 13://enter key
        this.rotateBlock(1,-1);
        break;
        case 16://shift key
        this.rotateBlock(-1,1);
        break;

      }
    }
  }
  render(){
    /*
  return (
    <div className="App">
      <div><Announce/></div>
      <Now now={this.state.now} next={this.state.next} keep={this.state.keep}/>
      <div id="in">
      <input type="text" onKeyDown={(e)=>this.getKey(e.keyCode)}></input>
      
      <KeyInput move={this.moveBlock} fall={this.fallBlock} game_status={this.state.game_status} keep={this.keepBlock} rotate={this.rotateBlock}/>
      </div>
      <div id="game"><Game game={this.init_game}/></div>
      
      <Board squares={this.state.squares} pos={this.state.pos} block={this.state.now.obj} H={H} W={W}/>
    </div>
  );
  */
 return (
  <div className="App">
    <div><Announce/></div>
    <Now now={this.state.now} next={this.state.next} keep={this.state.keep}/>
    <div id="game"><Game game={this.init_game} move={this.moveBlock} fall={this.fallBlock} game_status={this.state.game_status} keep={this.keepBlock} rotate={this.rotateBlock}/></div>
    
    <Board squares={this.state.squares} pos={this.state.pos} block={this.state.now.obj} H={H} W={W}/>
  </div>
);
  }
}
/*
export function Keep(props){
  return( 
  <div className="App">
  Keep Item... {props.keep.form}
  </div>
  );
}
*/
function Now_w(props){
  console.log(props);
  return(
    <h2>Now .... {props.now.form}</h2>
  );
}
class Now extends React.Component{
  

  render(){return(

    <table>
      <thead>
      <tr>
        <td>now</td>
        <td>next</td>
        <td/>
        <td>keep</td>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{this.props.now.form}</td>
        <td>{this.props.next.form}</td>
        <td/>
        <td>{this.props.keep.form}</td>
      </tr>
      </tbody>
      
      </table>

  );}
}

function Announce(){
  return(
    <h1>TETRIS</h1>
    
  );
}

//export default App;
