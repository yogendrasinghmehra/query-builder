import React from "react";
import AppModal from "../AppModal";
import ClientFilter from "../ClientFilter";
import { Link } from "react-router-dom";


const Header = () => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">       
        <Link to="/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3">Query Builder</Link>
        <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-nav m-2">
          <div className="nav-item">
            <input
              type="button"
              className="btn btn-sm btn-primary px-3"
              value="Get Reports"
              onClick={() => setModalShow(true)}></input>
          </div>
        </div>
      </header>
      <AppModal
        showModal={modalShow}
        onHide={() => setModalShow(false)}
        childComponent={ClientFilter}
      />
    </>
  )
}

export default Header
