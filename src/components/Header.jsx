import { Link } from 'react-router-dom';
<<<<<<< HEAD
=======
import { useAuth } from '../context/AuthContext'; // [NEW]
import Translator from './Translator';
>>>>>>> 541ddacc7b4115228ea1d3f7d80c80fd2293374e
import ThemeToggle from './ThemeToggle';
import './Header.css';

function Header() {
<<<<<<< HEAD
=======
    const { currentUser } = useAuth(); // [NEW]

>>>>>>> 541ddacc7b4115228ea1d3f7d80c80fd2293374e
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <h1 className="logo-text">The Great Chronicle of Buddhas</h1>
                    </Link>
                    <nav className="nav">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/browse" className="nav-link">Browse</Link>
                        <Link to="/search" className="nav-link">Search</Link>
<<<<<<< HEAD
                        <div style={{ marginLeft: '1rem' }}>
=======
                        {currentUser ? (
                            <Link to="/member" className="nav-link">Member</Link>
                        ) : (
                            <Link to="/login" className="nav-link">Sign In</Link>
                        )}
                        <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Translator />
>>>>>>> 541ddacc7b4115228ea1d3f7d80c80fd2293374e
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
