import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Dashboard</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <RouteNavItem href="/settings">Settings</RouteNavItem >
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes />
      </div>
      
    );
  }
}

export default App;
