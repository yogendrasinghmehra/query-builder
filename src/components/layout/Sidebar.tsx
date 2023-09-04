
import { Link } from "react-router-dom"

const Sidebar = () => {
    return (

        <div className="position-sticky pt-3">
            <ul className="nav flex-column">
            <li className="nav-item">
                    <Link className="nav-link active" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/report">Report</Link>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="/">
                        <span data-feather="layers"></span>
                        Client
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="/">
                        <span data-feather="layers"></span>
                        Member
                    </a>
                </li>
            </ul>
        </div>

    )
}

export default Sidebar
