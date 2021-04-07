import React from "react";
import style from './GreedySnake.css'
class Square extends React.Component{
  render() {
    return (
      <div className={this.props.styleClass}/>
    );
  }
}

class Board extends React.Component{
  constructor() {
    super();
    this.state={
      squares:[],
      direction:[0,1],
      width:30,
      height:18,
      snakes:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]
    }
  }
  componentDidMount() {
    let arr=[];
    for(let i=0;i<this.state.height;i++)
    {
      arr[i]=[];
      for(let j=0;j<this.state.width;j++)
      {
          arr[i][j]='blank';
      }
    }

    setTimeout(()=>this.Start(),3000);
    let that=this;
    document.onkeydown=function (event) {
          let e=event;
          let dir=[0,1];
          if(e&&e.key==='ArrowUp')
          {
             dir[0]=-1;dir[1]=0;
          }
          else if(e&&e.key==='ArrowDown')
          {
            dir[0]=1;dir[1]=0;
          }
          else if(e&&e.key==='ArrowLeft')
          {
            dir[0]=0;dir[1]=-1;
          }
          else if(e&&e.key==='ArrowRight')
          {
            dir[0]=0;dir[1]=1;
          }
          that.setState({
            direction:dir
          })

    };
    this.setState({
      squares:arr
    });
  }
  Start()
  {
    let arr=this.state.squares;
    let snakes=this.state.snakes;
    for(let i=0;i<snakes.length;i++)
    {
      arr[snakes[i][0]][snakes[i][1]]='snake'
    }
    //修改state触发重绘
    this.setState({
      squares:arr
    });
    this.generate(10);
    setInterval(()=>this.crawling(),300);
  }
  generate(money)
  {
      let hei=this.state.height;
      let wid=this.state.width;
      let arr=this.state.squares;
      let num=0;
      while(num<money)
      {
        let r=parseInt((Math.random()*hei).toString(),10);
        let c=parseInt((Math.random()*wid).toString(),10);
        if(arr[r][c]==='blank')
        {
          arr[r][c]='money';
          num++;
        }
      }
      this.setState({
        squares:arr
      })
  }
  crawling()
  {
    let dir=this.state.direction;
    let ss=this.state.snakes;
    let arr=this.state.squares;
    //判断是否触碰到石头或者墙壁或者蛇，或者吃到了金币
    if(ss[ss.length-1][0]+dir[0]<0||ss[ss.length-1][0]+dir[0]>=this.state.height||ss[ss.length-1][1]+dir[1]<0||ss[ss.length-1][1]+dir[1]>=this.state.width) return;
    let next=arr[ss[ss.length-1][0]+dir[0]][ss[ss.length-1][1]+dir[1]];
    if(next==='blank')
    {
      arr[ss[0][0]][ss[0][1]]='blank';
      //如果碰到blank就前进,每次只挪移一格
      for(let i=0;i<ss.length-1;i++)
      {
         ss[i]=ss[i+1];
      }
      ss[ss.length-1]=[ss[ss.length-1][0]+dir[0],ss[ss.length-1][1]+dir[1]];
      arr[ss[ss.length-1][0]][ss[ss.length-1][1]]='snake';
    }
    else if(next==='money')
    {
      ss[ss.length]=[ss[ss.length-1][0]+dir[0],ss[ss.length-1][1]+dir[1]];
      arr[ss[ss.length-1][0]][ss[ss.length-1][1]]='snake';
    }
    this.setState({
      snakes:ss,
      squares:arr
    })
  }
  render() {
    return (
      <div className={style.bk}>
          {
            this.state.squares.map((item,index)=>{
              return (<div key={index}>
                  {
                    item.map((i,index)=>{
                      if(i==='snake') return (<Square key={index} styleClass={style.squareSnake}/>);
                      else if(i==='blank') return (<Square key={index} styleClass={style.squareBlank}/>);
                      else if(i==='money') return (<Square key={index} styleClass={style.squareMoney}/>);
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
export default Board;
