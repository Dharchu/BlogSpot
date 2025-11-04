// admin-dashboard/src/App.js
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Posts from './pages/Posts';

function RequireAuth({children}){
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if(!user || user.role !== 'admin') return <Login />;
  return children;
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/*" element={<RequireAuth><Layout/></RequireAuth>} />
    </Routes>
  );
}

function Layout(){
  const navigate = useNavigate();
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
  return (
    <div>
      <header className="header"><div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><strong>Admin Dashboard</strong></div><div><button onClick={logout} className="btn">Logout</button></div></div></header>
      <div className="container" style={{display:'flex',gap:16,marginTop:16}}>
        <aside style={{width:220}} className="card" id="admin-sidebar">
          <Link to="/">Overview</Link>
          <Link to="/users">Users</Link>
          <Link to="/posts">Posts</Link>
        </aside>
        <main style={{flex:1}}>
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/posts" element={<Posts/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
