import styles from './index.css';
import Nav from '../components/Nav'
import React from "react";
function BasicLayout(props) {
  return (
    <div>
      <Nav/>
      {props.children}
    </div>
  );
}

export default BasicLayout;
