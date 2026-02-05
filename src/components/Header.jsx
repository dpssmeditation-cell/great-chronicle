import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Header.css';

function Header() {
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
                        <div style={{ marginLeft: '1rem' }}>
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
