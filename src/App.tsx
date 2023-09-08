import { Route, Routes } from "react-router-dom";
import Error from "./components/Error";
import Report from "./components/Report";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/Dashboard";
import './App.scss';

const App = () => {
    return (
        <div className="App">
            <Header />
            <div className="container-fluid mt-5">
                <div className="row">
                    <main className="col-md-12 ms-sm-auto col-lg-12 px-md-3">
                        <Routes>
                            <Route path="/home" element={<Dashboard />} />
                            {/* <Route path="/report" element={<Report />} /> */}
                            {/* Error route */}
                            <Route path="*" element={<Dashboard />} />
                        </Routes>
                    </main>
                    {/* <nav id="sidebarMenu" className="col-md-3 col-lg-3 d-md-block sidebar collapse">
                    <Sidebar></Sidebar>
                    </nav> */}
                   
                </div>
            </div>

        </div>

    )
}

export default App
