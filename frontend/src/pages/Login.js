// frontend/src/pages/Login.js
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const navigate = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/auth/login',{email,password});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    }catch(err){ alert(err.response?.data?.message || 'Error'); }
  }
  return (
    <div className="card" style={{maxWidth:420,margin:'32px auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button className="btn" type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}
