// frontend/src/pages/CreatePost.js
import React, {useState, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreatePost(){
  const [title,setTitle]=useState(''); const [content,setContent]=useState(''); const [image,setImage]=useState(null); const [category,setCategory]=useState('Tech');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get('edit');

  useEffect(()=>{ if(editId){ axios.get('http://localhost:5000/api/posts/'+editId).then(r=>{ setTitle(r.data.title); setContent(r.data.content); setCategory(r.data.category||'Tech'); }); } },[editId]);

  async function submit(e){
    e.preventDefault();
    try{
      let imageBase64 = null;
      if(image){
        const reader = new FileReader();
        reader.readAsDataURL(image);
        await new Promise(res=> reader.onload = ()=> res());
        imageBase64 = reader.result;
      }
      const token = localStorage.getItem('token');
      if(editId){
        await axios.put('http://localhost:5000/api/posts/'+editId, { title, content, imageBase64, category }, { headers: { Authorization: 'Bearer ' + token } });
        alert('Post updated'); navigate('/');
      } else {
        await axios.post('http://localhost:5000/api/posts', { title, content, imageBase64, category }, { headers: { Authorization: 'Bearer ' + token } });
        alert('Post created'); navigate('/');
      }
    }catch(err){ console.error(err); alert('Error'); }
  }
  return (
    <div className="card" style={{maxWidth:900,margin:'24px auto'}}>
      <h2>{editId? 'Edit Post':'Create Post'}</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <ReactQuill value={content} onChange={setContent} />
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="input" style={{width:200}}>
            <option>Tech</option><option>Life</option><option>Travel</option><option>Education</option><option>Food</option>
          </select>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}><button className="btn">{editId? 'Update':'Publish'}</button></div>
      </form>
    </div>
  )
}
