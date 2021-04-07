import React from "react";
import style from "./Tetris.css"
import {Button} from "antd";
import "antd/dist/antd.css";
//canvas实现方法
class backCanvas extends React.Component{
    constructor(props) {
      super(props);
      this.state={
        c:null,
        cxt:null,
        speed:3,
        color:'#FF0000',
        wcolor:'#000000',
        canvasw:16,
        canvash:20,
        lineWidth:1,
        //当前累积到第几行
        level:0,
        colornum:0,
        currentBlock:null,
        fallTimer:null,
        colors:[
           '#CDB5CD',
           '#8DB6CD',
           '#CD8C95',
           '#CDCDC1',
           '#CD6839'
        ],
        blocks:
          [
            [[1,1],[0,0],[1,0],[1,2]],
            [[1,1],[2,0],[1,0],[1,2]],
            [[1,1],[0,0],[1,0],[2,1]],
            [[1,1],[2,0],[1,0],[0,1]],
            [[1,1],[0,0],[1,0],[0,1]],
            [[1,1],[1,0],[0,1],[2,1]],
            [[0,0],[1,0],[2,0],[3,0]]
          ],
        arrCanvas:[]
      }
    }
    //组件挂载完成时候触发的生命周期函数
    componentDidMount(){
      let arr=[];
      for(let i = 0;i < this.state.canvash; i++){
        arr[i] = [];
        for(let j = 0;j < this.state.canvasw; j++)
        {
          arr[i][j]=0;
        }
      }
      this.setState({
        cxt:document.getElementById("myCanvas").getContext("2d"),
        arrCanvas:arr
      });
      let that=this;
      document.onkeydown=function (event) {
        let e = event;
        if (e && e.key === 'ArrowDown') {//下键
          if(that.state.fallTimer) clearInterval(that.state.fallTimer);
          that.setState({
            speed:10
          });
          that.setState({
            fallTimer:setInterval(()=>that.fall(),(1.0/that.state.speed)*1000)
          });
        }
        else if (e && e.key === 'ArrowRight') {//右键
          that.move(1);
        }
        else if (e && e.key === 'ArrowLeft') {//左键
          that.move(-1);
        }
        else if(e && e.key === " ")
        {
          that.rotate();
        }
      };
    }
    //组件即将不挂载的生命周期函数
    componentWillUnmount() {
      document.onkeydown=null;
    }
    rotate()
    {
       if(this.state.chosenBlock===4) return;
          let lastP=this.state.currentBlock;
          let x=lastP[0][0];
          let y=lastP[0][1];

          let nextP=[];
          let v=[];
          nextP[0]=[x,y];

          //计算向量之后偏移 这样就省去了很多片段
          for(let i=0;i<3;i++)
          {
            debugger;
            v[i]=[];
            v[i][0]=[lastP[i+1][0]-x];v[i][1]=[lastP[i+1][1]-y];
            debugger;
            let ang=Math.PI*0.5;
            let l=Math.sqrt(v[i][0]*v[i][0]+v[i][1]*v[i][1]);
            if(v[i][1]>=0)
              {
                 ang=Math.acos(v[i][0]*1.0/l)+ang;
              }
            else
              {
                ang =(Math.PI*2- Math.acos(v[i][0] * 1.0 / l)) + ang;
              }
            nextP[i+1]=[x+Math.round(l*Math.cos(ang)),y+Math.round(l*Math.sin(ang))];


          }

          if(this.collideNow(nextP)) return;
          //清除上一个位置
          for(let i=0;i<lastP.length;i++)
          {
            this.state.cxt.clearRect(lastP[i][0]*20,lastP[i][1]*20,20,20);
          }
          //绘制下一个位置
          for(let i=0;i<nextP.length;i++)
          {
            this.paintSingle(nextP[i][0]*20,nextP[i][1]*20,20,20,this.state.color);
          }
          this.setState({
            currentBlock:nextP
          })
    }
    welcome()
    {
      //点击开始按钮，首先弹出游戏开始的提示，之后正式进入游戏
      let cxt=this.state.cxt;
      cxt.lineWidth=this.state.lineWidth;
      cxt.fillStyle="#FFFFFF";
      cxt.fillRect(0,0,this.state.canvasw*20,this.state.canvash*20);
      cxt.font="30px Arial";
      cxt.fillStyle="#000000";
      cxt.fillText("Game Start",this.state.canvasw*5,this.state.canvash*10);
      if(this.state.fallTimer)
        clearInterval(this.state.fallTimer);
      this.setState({
        fallTimer:null
      });
      setTimeout(()=>this.startGame(),3000)
    }
    startGame()
    {
      let arr=[];
      for(let i = 0;i < this.state.canvash; i++){
        arr[i] = [];
        for(let j = 0;j < this.state.canvasw; j++)
        {
          arr[i][j]=0;
        }
      }
      this.setState({
        arrCanvas:arr,
        currentBlock:null
      });
      //首先随机生成7种形状的方块，用一个二维数组表示其位置，每隔一秒向下下落一个单位，每次下落之后，检查碰撞条件
      //清空画布
      this.state.cxt.fillStyle="#FFFFFF";
      this.state.cxt.fillRect(0,0,500,800);
      //随机生成其中某种方块
      this.generateBox();
    }
    generateBox()
    {
      let chosen=parseInt((Math.random()*7).toString(),10);
      let colornum=parseInt((Math.random()*5).toString(),10)+1;
      let chosenBlock=[];
      for(let i=0;i<this.state.blocks[chosen].length;i++)
      {
        chosenBlock[i]=[...this.state.blocks[chosen][i]];
      }
      this.setState({
        currentBlock:chosenBlock,
        color:this.state.colors[colornum-1],
        colornum:colornum,
        chosenBlock:chosen
      });
      //如果刚生成已经碰撞则结束游戏
      if(this.collide(0,0))
      {
        this.gameFail();
        return;
      }
      let cxt=this.state.cxt;
      cxt.fillStyle=this.state.color;
      for(let i=0;i<this.state.currentBlock.length;i++)
      {
        this.paintSingle(this.state.currentBlock[i][0]*20,this.state.currentBlock[i][1]*20,20,20,this.state.colornum);
      }
      //控制方块下落
      this.setState({
        fallTimer:setInterval(()=>this.fall(),(1.0/this.state.speed)*1000)
      })
    }
    gameFail() {
      //清空画布
      let cxt=this.state.cxt;
      cxt.fillStyle="#FFFFFF";
      cxt.fillRect(0,0,500,800);
      //停止循环函数
      if(this.state.fallTimer)
        clearInterval(this.state.fallTimer);
      this.setState({
        fallTimer:null
      })
    }
    fall()
    {
      //判断当前位置是否到底,或者触碰到别的方块
      if(this.collide(0,1))
      {
        //当前方块位置不再可能移动,填充背景为颜色号,还原速度
        let toplevel=this.state.canvash;
        //计算当前方块堆积到第几层了 只需要更新画布矩阵的最后这几层，而不需要全部重绘
        for(let i=0;i<this.state.currentBlock.length;i++)
        {
          if(this.state.currentBlock[i][1]<toplevel) toplevel=this.state.currentBlock[i][1];
        }
        let tlevel=this.state.level;
        tlevel=tlevel<(this.state.canvash-toplevel)?(this.state.canvash-toplevel):tlevel;
        let arr=this.state.arrCanvas;
        for(let i=0;i<this.state.currentBlock.length;i++)
        {
          arr[this.state.currentBlock[i][1]][this.state.currentBlock[i][0]]=this.state.colornum;
        }
        this.setState({
          level:tlevel,
          arrCanvas:arr,
          speed:3
        });
        //终止下落循环，产生新的方块
        clearInterval(this.state.fallTimer);
        this.generateBox();
        this.clearLine();
        return;
      }
      this.repaint(0,1);
    }
    paintSingle(x,y,w,h,colornum)
    {
        let cxt=this.state.cxt;
        cxt.strokeStyle=this.state.wcolor;
        cxt.fillStyle=this.state.color;
        let width=this.state.lineWidth*0.8;
        cxt.fillStyle=this.state.colors[colornum-1];
        cxt.fillRect(x+width,y+width,w-width*2,h-width*2);
    }
    move(step)
    {
       if(!this.state.currentBlock) return;
       if(this.collide(step,0)) return;
       this.repaint(step,0);
    }
    collide(x,y) {
      let mark=0;
      let currentBlock=this.state.currentBlock;
      let arrCanvas=this.state.arrCanvas;
      for(let i=0;i<currentBlock.length;i++)
      {
        if(currentBlock[i][0]+x<0||currentBlock[i][0]+x>this.state.canvasw-1||currentBlock[i][1]+y<0||currentBlock[i][1]+y>this.state.canvash-1) return true;
        mark+=arrCanvas[currentBlock[i][1]+y][currentBlock[i][0]+x];
      }
      return mark > 0;
    }
    collideNow(currentP) {
      let mark=0;
      let currentBlock=currentP;
      let arrCanvas=this.state.arrCanvas;
      for(let i=0;i<currentBlock.length;i++)
      {
        if(currentBlock[i][0]<0||currentBlock[i][0]>this.state.canvasw-1||currentBlock[i][1]<0||currentBlock[i][1]>this.state.canvash-1) return true;
        mark+=arrCanvas[currentBlock[i][1]][currentBlock[i][0]];
      }
      return mark > 0;
    }
    clearLine() {
      let mark=0;
      let arrCanvas=this.state.arrCanvas;
      for(let i=0;i<this.state.level;i++)
      {
        mark=0;
        for(let j=0;j<this.state.canvasw;j++)
        {
          mark+=(arrCanvas[this.state.canvash-1-i][j]>0);
        }
        if(mark===this.state.canvasw)
        {
          for(let row=this.state.canvash-1-i;row>0;row--)
          {
            arrCanvas[row]=arrCanvas[row-1];
          }
          arrCanvas[0]=[...arrCanvas[0]];//可
          this.repaintAll(this.state.canvash-1,this.state.canvash-this.state.level);
          let level=this.state.level-1;
          this.setState({
            arrCanvas:arrCanvas,
            level:level
          })
        }
      }
    }
    repaint(x,y) {
      let cxt=this.state.cxt;
      cxt.fillStyle="#FFFFFF";
      //清除上一个位置
      for(let i=0;i<this.state.currentBlock.length;i++)
      {
        cxt.clearRect(this.state.currentBlock[i][0]*20,this.state.currentBlock[i][1]*20,20,20);
      }
      //绘制下一个位置
      let currentBlock=this.state.currentBlock;
      for(let i=0;i<currentBlock.length;i++)
      {
        currentBlock[i][1]+=y;
        currentBlock[i][0]+=x;
        this.paintSingle(currentBlock[i][0]*20,currentBlock[i][1]*20,20,20);
      }
      // this.setState({
      //   currentBlock:currentBlock
      // })
    }
    repaintAll(lowBound,highBound) {
      //清空画布
      let cxt=this.state.cxt;
      cxt.fillStyle="#FFFFFF";
      cxt.fillRect(0,0,500,800);
      for(let i=lowBound;i>=highBound;i--)
      {
        for(let j=0;j<this.state.canvasw;j++)
        {
          if(this.state.arrCanvas[i][j]>0)
            this.paintSingle(j*20,i*20,20,20,this.state.arrCanvas[i][j]);
        }
      }
    }
     render() {
       return (
         <div className={style.Back}>
           <div>
             <canvas id="myCanvas" width={this.state.canvasw*20} height={this.state.canvash*20} style={{border:'1px solid #c3c3c3'}}/>
           </div>
           <div className={style.controlBoard}>
             <Button onClick={()=>this.welcome()}>Begin</Button>
           </div>
         </div>

         )
     }
}
export default backCanvas;
