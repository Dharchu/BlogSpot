import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const navigate = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post(`${API_URL}/api/users/login`,{email,password});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if(res.data.user.role !== 'admin'){ alert('Not admin'); return; }
      navigate('/');
    }catch(err){ alert(err.response?.data?.message || 'Error'); }
  }
  return (
    //form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12,width:400}}
    <div style={{maxWidth:420,margin:'80px auto'}} className="card">
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn">Login</button>
      </form>
    </div>
  )
}
