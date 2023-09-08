import React from "react";
import AppModal from "../AppModal";
import ClientFilter from "../ClientFilter";
import { Link } from "react-router-dom";
import { Nav, NavDropdown, Navbar } from "react-bootstrap";


const Header = () => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
       <Navbar fixed="top"  expand="lg" bg="primary" data-bs-theme="dark">
        <Navbar.Brand> <Link to="/home" className="navbar-brand col-md-3 col-lg-2 me-0 px-3">IntelliQuest</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link active" to="/home">Home</Link>
            <Link className="nav-link" to="/home">Report</Link>
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
    </Navbar>
      <AppModal
        showModal={modalShow}
        onHide={() => setModalShow(false)}
        childComponent={ClientFilter}
      />
    </>
  )
}

export default Header
