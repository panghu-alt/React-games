import React from "react";
import {Link} from 'umi'
import {Menu} from "antd";
import "antd/dist/antd.css";

class Nav extends React.Component{
  render() {
    return (
      <Menu mode="horizontal">
        <Menu.Item key="home">
        <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="chess">
        <Link to="/users/Game">Chess</Link>
        </Menu.Item>
        <Menu.Item key="Tetris">
          <Link to="/users/Tetris">Tetris</Link>
        </Menu.Item>
        <Menu.Item key="GreedySnake">
          <Link to="/users/GreedySnake">GreedySnake</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
export default Nav;
