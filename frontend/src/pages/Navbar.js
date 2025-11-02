import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  // This is a placeholder. You should replace this with your actual auth logic.
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home or login page
    window.location.href = '/login';
  };

  return (
    <nav className="card" style={styles.navbar}>
        
      <Link to="/" style={styles.brandContainer}>
        <span style={styles.brandName}>BlogSpot</span>
      </Link>
      <div style={styles.navLinks}>
        <NavLink to="/" style={styles.navLink}>Home</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/create" style={styles.navLink}>Create Post</NavLink>
            <NavLink to="/profile" style={styles.navLink}>My Profile</NavLink>
            <span style={styles.navLink}>Hi, {user?.name || 'User'}</span>
            <button onClick={handleLogout} style={{...styles.navLink, ...styles.button}}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={styles.navLink}>Login</NavLink>
            <NavLink to="/register" style={styles.navLink}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  brandName: {
    fontFamily: "'Pacifico', cursive", // Use the custom font here
    fontSize: '24px',
    color: '#0f172a',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
  }
};