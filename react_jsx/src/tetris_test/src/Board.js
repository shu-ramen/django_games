import React from "react";
//const H=9;
//const W=6;
function Square(props) {
    let name="square ";
    switch(props.value){
      default:
      case 0:
      name+="empty";
      break;
      case 1:
      name+="now";
      break;
      case -1:
      name+="fill";
      break;
    }
    return (
      <button className={name}>
      </button>
    );
  }
  
  export default class Board extends React.Component {

    draw(){
        //console.log(this.props);
        let copySquare=JSON.parse(JSON.stringify(this.props.squares));
        //if(this.props.pos[0]>1){
        const draw_block=this.props.block.slice().map((each)=>[each[0]+this.props.pos[0],each[1]+this.props.pos[1]]);
        for (let i=0;i<draw_block.length;i++){
            copySquare[draw_block[i][0]][draw_block[i][1]]=1;
          }
        //}
          return copySquare;
    }
    renderSquare(i) {
      return (
        <Square
          value={i}
        />
      );
    }
    render() {
      const board=this.draw().slice(2,(this.props.H)+1).map((i)=>
        <div className="board-row">
        {i.slice(1,(this.props.W)+1).map((j)=>this.renderSquare(j))}
        </div>
      );
      return (
        <div>
          {board}
        </div>
      );
    }
  }