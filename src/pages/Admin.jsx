import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProjects, addProject, updateProject, deleteProject, uploadImage } from '../firebase/projects';

const CATEGORIES = [
  { id: 'recent', label: '최근작업 (RECENT WORKS)' },
  { id: 'landscape', label: '조경/건축 (LANDSCAPE)' },
  { id: 'competition', label: '현상공모/제안 (COMPETITION)' },
  { id: 'masterplan', label: '마스터플랜 (MASTER PLAN)' },
  { id: 'animation', label: 'ANIMATION/홍보영상' },
  { id: 'modeling', label: '3D모델링 (3D-MODELING)' },
];

const COLOR_MAP = {
  recent: '#00f5ff', landscape: '#aaff00', competition: '#ff2d78',
  masterplan: '#7b2fff', animation: '#ff8c00', modeling: '#aaff00',
};

const EMPTY_FORM = { title: '', description: '', categoryId: 'recent', year: String(new Date().getFullYear()), tags: '' };

export default function Admin() {
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState('');

  const loadProjects = () => getProjects().then(setProjects);

  useEffect(() => { if (user) loadProjects(); }, [user]);

  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');
    try { await login(email, password); }
    catch { setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.'); }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setProgress(0);
    try {
      let imageUrl = form.imageUrl || '';
      let imagePath = form.imagePath || '';
      if (imageFile) {
        const result = await uploadImage(imageFile, setProgress);
        imageUrl = result.url;
        imagePath = result.path;
      }
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        color: COLOR_MAP[form.categoryId] || '#00f5ff',
        imageUrl, imagePath,
      };
      if (editId) {
        await updateProject(editId, data);
        setMsg('프로젝트가 수정되었습니다.');
      } else {
        await addProject(data);
        setMsg('프로젝트가 추가되었습니다.');
      }
      setForm(EMPTY_FORM); setEditId(null); setImageFile(null); setImagePreview('');
      await loadProjects();
    } catch (err) {
      setMsg('오류: ' + err.message);
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = p => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description, categoryId: p.categoryId, year: p.year, tags: (p.tags || []).join(', '), imageUrl: p.imageUrl, imagePath: p.imagePath });
    setImagePreview(p.imageUrl || '');
    setImageFile(null);
    window.scrollTo(0, 0);
  };

  const handleDelete = async p => {
    if (!window.confirm(`"${p.title}" 를 삭제할까요?`)) return;
    setDeleting(p.id);
    await deleteProject(p.id, p.imagePath ? [p.imagePath] : []);
    await loadProjects();
    setDeleting(null);
  };

  const handleCancel = () => {
    setEditId(null); setForm(EMPTY_FORM); setImageFile(null); setImagePreview('');
  };

  if (loading) return <LoadingScreen />;

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#04040c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ background: '#0c0c1e', border: '1px solid #00f5ff30', padding: 40, width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 14, letterSpacing: 4, color: '#00f5ff', marginBottom: 8 }}>ADMIN LOGIN</div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required style={inputStyle} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required style={inputStyle} />
        {loginError && <div style={{ fontSize: 11, color: '#ff2d78', fontFamily: 'Orbitron,sans-serif', letterSpacing: 1 }}>{loginError}</div>}
        <button type="submit" style={btnPrimaryStyle}>LOGIN →</button>
        <button type="button" onClick={() => navigate('/')} style={btnGhostStyle}>← BACK TO SITE</button>
      </form>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#04040c', padding: '40px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
        <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 18, fontWeight: 900, letterSpacing: 4, color: '#00f5ff' }}>ADMIN PANEL</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/')} style={btnGhostStyle}>← PORTFOLIO</button>
          <button onClick={logout} style={{ ...btnGhostStyle, borderColor: '#ff2d7860', color: '#ff2d78' }}>LOGOUT</button>
        </div>
      </div>

      {msg && <div style={{ marginBottom: 24, padding: '12px 20px', background: msg.startsWith('오류') ? '#ff2d7815' : '#00f5ff15', border: `1px solid ${msg.startsWith('오류') ? '#ff2d78' : '#00f5ff'}60`, fontFamily: 'Orbitron,sans-serif', fontSize: 10, letterSpacing: 2, color: msg.startsWith('오류') ? '#ff2d78' : '#00f5ff' }}>{msg}</div>}

      {/* Form */}
      <div style={{ background: '#0c0c1e', border: '1px solid #ffffff10', padding: 32, marginBottom: 48 }}>
        <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 11, letterSpacing: 3, color: '#00f5ff', marginBottom: 24 }}>
          {editId ? 'EDIT PROJECT' : 'ADD NEW PROJECT'}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>PROJECT TITLE *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={inputStyle} placeholder="프로젝트 이름" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>YEAR</label>
            <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} style={inputStyle} placeholder="2025" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>CATEGORY</label>
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>TAGS (쉼표로 구분)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={inputStyle} placeholder="Park, Urban, Ecology" />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="프로젝트 설명" />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={labelStyle}>IMAGE 업로드</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <label style={{ ...btnGhostStyle, cursor: 'pointer', display: 'inline-block' }}>
                파일 선택
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="preview" style={{ height: 80, aspectRatio: '4/3', objectFit: 'cover', border: '1px solid #ffffff20' }} />
              )}
            </div>
            {saving && progress > 0 && progress < 100 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 3, background: '#ffffff10', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#00f5ff', transition: 'width .3s', boxShadow: '0 0 8px #00f5ff' }} />
                </div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: '#00f5ff', fontFamily: 'Orbitron,sans-serif', marginTop: 4 }}>UPLOADING {progress}%</div>
              </div>
            )}
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={{ ...btnPrimaryStyle, opacity: saving ? .5 : 1 }}>
              {saving ? 'SAVING...' : editId ? 'UPDATE PROJECT' : 'ADD PROJECT'}
            </button>
            {editId && <button type="button" onClick={handleCancel} style={btnGhostStyle}>CANCEL</button>}
          </div>
        </form>
      </div>

      {/* Project list */}
      <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 11, letterSpacing: 3, color: '#5a5a7a', marginBottom: 20 }}>
        ALL PROJECTS ({projects.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: '#0c0c1e', border: '1px solid #ffffff10', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color .2s' }}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: 80, height: 60, objectFit: 'cover', flexShrink: 0, border: '1px solid #ffffff10' }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700, color: '#eef0ff', letterSpacing: 1 }}>{p.title}</div>
              <div style={{ fontSize: 10, color: '#5a5a7a', marginTop: 4, fontFamily: 'Orbitron,sans-serif', letterSpacing: 2 }}>
                {p.categoryId?.toUpperCase()} · {p.year}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleEdit(p)} style={{ ...btnGhostStyle, fontSize: 9 }}>EDIT</button>
              <button onClick={() => handleDelete(p)} disabled={deleting === p.id} style={{ ...btnGhostStyle, borderColor: '#ff2d7860', color: '#ff2d78', fontSize: 9, opacity: deleting === p.id ? .5 : 1 }}>
                {deleting === p.id ? '...' : 'DELETE'}
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'Orbitron,sans-serif', fontSize: 10, letterSpacing: 4, color: '#3a3a5a' }}>NO PROJECTS YET</div>
        )}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#04040c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 10, letterSpacing: 4, color: '#00f5ff', animation: 'flicker 1.5s infinite' }}>LOADING...</div>
    </div>
  );
}

const inputStyle = {
  background: '#04040c', border: '1px solid #ffffff20', color: '#eef0ff',
  padding: '10px 14px', fontFamily: 'Space Grotesk,sans-serif', fontSize: 13,
  outline: 'none', width: '100%',
};
const labelStyle = { fontFamily: 'Orbitron,sans-serif', fontSize: 8, letterSpacing: 3, color: '#5a5a7a', textTransform: 'uppercase' };
const btnPrimaryStyle = { background: '#00f5ff', color: '#04040c', border: 'none', padding: '10px 28px', fontFamily: 'Orbitron,sans-serif', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer' };
const btnGhostStyle = { background: 'none', border: '1px solid #ffffff20', color: '#5a5a7a', padding: '10px 20px', fontFamily: 'Orbitron,sans-serif', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer' };
