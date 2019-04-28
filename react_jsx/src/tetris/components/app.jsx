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
  s:[[0,1],[1,0],[1,1],[0,2]],
  z:[[0,0],[0,1],[1,1],[1,2]],
  i:[[0,0],[1,0],[2,0],[3,0]],
  o:[[0,1],[1,0],[1,1],[0,0]],
  t:[[1,0],[0,1],[1,1],[1,2]],
  l:[[0,0],[0,1],[1,1],[2,1]],
  j:[[0,0],[0,1],[1,0],[2,0]],
};
const obj_base=["s","z","i","o","t","j","l"];
const init_pos=[1,parseInt(W/2)];


function KeyInput(props){
  //キーボード入力の処理
  const getKey=(input_key)=> {
    if(props.game_status){
      switch(input_key){
        default:
        break;
        case 39:
        props.move(0,1);
        break;
        case 37:
        props.move(0,-1);
        break;
        case 38:
        props.move(-1,0);
        break;
        case 40:
        props.fall();
        break;
        case 32://space key
        props.keep();
        break;
        case 13://enter key
        props.rotate(1,-1);
        break;
        case 16://shift key
        props.rotate(-1,1);
        break;

      }
    }
  };
    return(
    <input type="text" onKeyDown={(e)=>getKey(e.keyCode)}></input>
    );
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.test=this.test.bind(this);
  }
  test(){
    this.props.game();
  }

  
  render(){return(<button onClick={this.test}></button>);}
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
    //Game コンポーネントに受け渡し
    this.init_game=this.init_game.bind(this);

    //Key Inputコンポーネントに受け渡し
    this.moveBlock=this.moveBlock.bind(this);
    this.fallBlock=this.fallBlock.bind(this);
    this.keepBlock=this.keepBlock.bind(this);
    this.rotateBlock=this.rotateBlock.bind(this);

    //Boardコンポーネントに受け渡し
    this.generateObj=this.generateObj.bind(this);
    this.endCheck=this.endCheck.bind(this);
    this.clearBlock=this.clearBlock.bind(this);
    
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
      console.log("keep:"+this.state.now.form);
      if(this.state.keep.obj.length===0){
        this.setState({keep:this.state.now});
        this.generateObj();
      }
      else{
        this.setState((state)=>{return{keep:state.now,now:state.keep};});

      }
      this.setState({keep_flag:false,pos:init_pos});
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



//OK
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
  //OK
  fallBlock(){
    const test=this.moveBlock(1,0);
    if(test===false){
      //clearInterval(this.ID);
      //this.setState(()=>this.setBlock(),()=>{this.game()});
      this.setState(()=>{return(this.setBlock());});
    }
  }
  //OK
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
    const score_sheet=[0,40,100,300,1200];
    let copySquare=JSON.parse(JSON.stringify(this.state.squares));
    let hoge=[];
    for(let i=1;i<this.state.squares.length-1;i++){
      if(this.state.squares[i].slice(1,W+1).reduce((total, data) => {return total + data})<=W*(-1)){
        hoge.push(i);
      }
    }
    //この辺でエフェクトが入れられると思う
    for(let i of hoge){
      copySquare.splice(i,1);
      copySquare.splice(1,0,complement);
    }
    this.setState({squares:copySquare,score:this.state.score+score_sheet[hoge.length]});
    

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
    this.setState(()=>{return{squares:init_board};});
    if(typeof(this.ID)!== 'undefined'){
      console.log("stop");
      clearInterval(this.ID);
      delete this.ID;
    }
    else{
    console.log("start");
    this.ID=setInterval(()=>this.fallBlock(),1000);
    }
  }



  game(){
    if(this.state.fall_flag){
    //this.generateObj();
    //列が揃っていたら消す
    //ゲームの終了判定
    //新しく生成されたブロックが重なったら終了
    //this.endCheck();
    //this.setState(()=>{return{squares:this.clearBlock()};},()=>{this.endCheck()});
    }
    this.fallBlock();
  }



  render(){
    
  return (
    <div className="App">
      <Announce/>
      <Now now={this.state.now} next={this.state.next} keep={this.state.keep}/>
      <KeyInput move={this.moveBlock} fall={this.fallBlock} game_status={this.state.game_status} keep={this.keepBlock} rotate={this.rotateBlock}/>
      <div>
      <button onClick={this.init_game}></button>
      </div>

      <Board squares={this.state.squares} pos={this.state.pos} block={this.state.now.obj} clear={this.clearBlock} generate={this.generateObj} endCheck={this.endCheck}fall_flag={this.state.fall_flag} H={H} W={W}/>
      <Score score={this.state.score}/>

    </div>
  );

  }
}

function Score (props){
  return(
    <div> score : {props.score}</div>
  );
}

function Now (props){
  return(
    <table>
      <thead><tr>
        <td>now</td>
        <td>next</td>
        <td/>
        <td>keep</td>
      </tr></thead>
      <tbody><tr>
        <td>{props.now.form}</td>
        <td>{props.next.form}</td>
        <td/>
        <td>{props.keep.form}</td>
      </tr></tbody>
    </table>
  );
}

function Announce(){
  return(
    <h1>TETRIS</h1>
  );
}

//export default App;
