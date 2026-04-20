import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple password check (can be changed to any desired password)
    if (password === '123456') { 
      onLogin();
    } else {
      setError('รหัสผ่านไม่ถูกต้อง'); // Incorrect password
      setPassword('');
    }
  };

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>ระบบจัดการการจองห้องพัก<br/><span style={{ fontSize: '0.6em', opacity: 0.7 }}>(ระบบภายใน)</span></h1>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '350px',
        border: '2px solid var(--color-text)',
        borderRadius: 'var(--border-radius)',
        padding: '30px'
      }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>เข้าสู่ระบบ</h2>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>รหัสผ่าน :</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '1.2em',
              marginTop: '10px',
              border: '2px solid var(--color-text)',
              borderRadius: 'var(--border-radius)',
              background: 'transparent',
              color: 'var(--color-text)'
            }}
            placeholder="กรอกรหัสผ่าน"
            required
            autoFocus
          />
        </div>
        
        {error && <p style={{ color: '#e74c3c', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
        
        <button className="btn" type="submit" style={{ width: '100%', padding: '12px', fontSize: '1.1em', marginTop: '10px' }}>
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}
