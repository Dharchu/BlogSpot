// frontend/src/App.js
import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';

function Header(){
  const [open,setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  useEffect(()=>{ const onClick = ()=>setOpen(false); window.addEventListener('click', onClick); return ()=>window.removeEventListener('click', onClick); },[]);
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }

  return (
    <div className="header container" role="navigation">
      <div className="brand">
        {/* Use a small SVG logo or letter mark */}
        <div className="logo" aria-hidden>BS</div>
        <div>
          <div style={{fontWeight:700, fontSize:18}}>BlogSpot</div>
          {/* removed subtitle as requested */}
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <nav className="navlinks" aria-label="main">
          <Link to="/" className="navlink">Home</Link>
          <Link to="/create" className="navlink">Create Post</Link>
        </nav>

        {!user ? (
          <div style={{display:'flex',gap:8}}>
            <Link to="/login" className="navlink">Login</Link>
            <Link to="/register" className="navlink">Register</Link>
          </div>
        ) : (
          <div style={{position:'relative'}} onClick={e=>{ e.stopPropagation(); setOpen(o=>!o); }}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{fontSize:14,fontWeight:600}}>Hi {user.name}</div>
              <div className="profile-icon" title={user.name}>{user.name[0]?.toUpperCase()}</div>
            </div>
            {open && (
              <div className="dropdown" onClick={e=>e.stopPropagation()}>
                <Link to="/profile">My Profile</Link>
                <a href="#" onClick={(e)=>{ e.preventDefault(); logout(); }}>Logout</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// This is a Layout Route component. It renders the Header and an <Outlet>.
// The <Outlet> will be replaced by the matched child route component (e.g., Home, Login).
function MainAppLayout() {
  return (
    <>
      <Header />
      <div className="container" style={{paddingTop:16}}>
        <Outlet />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={null} /> {/* This route explicitly does nothing for /admin paths. */}
        <Route element={<MainAppLayout />}> {/* All child routes will be rendered inside the MainAppLayout's <Outlet>. */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
