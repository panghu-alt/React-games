import React from "react";
import style from './Game.css'
import {Button} from "antd";
import "antd/dist/antd.css";

class Square extends React.Component{
  render() {
    return (
      <button className={style.square} onClick={()=>this.props.onClick()}>
        {this.props.value}
      </button>
  );
  }
}

class Board extends React.Component{
  constructor() {
    super();
    this.state={
      items:[[0,1,2],[3,4,5],[6,7,8]]
    }
  }
  render() {
    return (
      <div>
        {
          this.state.items.map((item,index)=>{
            return (<div key={index} className={style.boardRow}>
                {
                  item.map((i,index)=>{
                    return (<Square key={index} value={this.props.squares[i]}
                                    onClick={() => this.props.onClick(i)}/>)
                  })
                }
            </div>
            )
          })
        }
    </div>
  );
  }
}

class Game extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      history:[{
        squares: Array(9).fill(null),
      }],
      isNextX:true,
      stepNumber:0,
    }
  }

  jumpTo(step)
  {
    this.setState({
      stepNumber:step,
      isNextX:(step%2)===0,
    })
  }
  handleClick(i){
    const history=this.state.history.slice(0,this.state.stepNumber+1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    if(squares[i]||calculateWinner(squares))
    {
      return;
    }
    squares[i]= this.state.isNextX ? 'X' : 'O';
    this.setState({
      history:history.concat([{
        squares:squares
      }]),
      isNextX:!this.state.isNextX,
      stepNumber:history.length
    });
  }
  render() {
    const history=this.state.history;
    const current=history[this.state.stepNumber];
    const winner=calculateWinner(current.squares);
    const moves=history.map((step,move)=>{
      const desc=move?'Go to move #'+move:
        'Go to game start';
      return(
        <div>
          <Button onClick={()=>this.jumpTo(move)}>{desc}</Button>
        </div>

    )
    });
    let status='Next player: '+(this.state.isNextX ? 'X':'O');
    if(winner)
    {
      status='Winner: '+winner;
    }
    return (
      <div className={style.game}>
        <div className={style.gameInfo}>
          <div>{status}</div>
          <div>{moves}</div>
        </div>
        <div className={style.board}>
              <Board
              squares={current.squares}
              onClick={(i)=>this.handleClick(i)}/>
        </div>
      </div>
  )
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
