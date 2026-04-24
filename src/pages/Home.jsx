import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleField from '../components/ParticleField';
import GlitchText from '../components/GlitchText';
import ProjectCard from '../components/ProjectCard';
import CategoryFilter from '../components/CategoryFilter';
import { getProjects } from '../firebase/projects';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('all');
  const [navVisible, setNavVisible] = useState(true);
  const [prevScroll, setPrevScroll] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProjects().then(data => { setProjects(data); setLoading(false); });
  }, []);

  useEffect(() => {
    const fn = () => {
      const sy = window.scrollY;
      setNavVisible(sy < prevScroll || sy < 80);
      setPrevScroll(sy);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, [prevScroll]);

  const filtered = category === 'all' ? projects : projects.filter(p => p.categoryId === category);

  if (selected) {
    return (
      <>
        <ParticleField />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ProjectDetail project={selected} onBack={() => setSelected(null)} />
        </div>
      </>
    );
  }

  return (
    <>
      <ParticleField />
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* NAV */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom,rgba(4,4,12,.9),transparent)', backdropFilter: 'blur(8px)',
          transform: navVisible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform .4s cubic-bezier(.23,1,.32,1)',
        }}>
          <div style={{ fontFamily: 'Orbitron,sans-serif', fontWeight: 900, letterSpacing: 4, color: '#00f5ff', textShadow: '0 0 15px #00f5ff', animation: 'flicker 8s infinite', fontSize: 20 }}>
            CGDONG
          </div>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            {['WORKS', 'ABOUT', 'CONTACT'].map(item =>
              <a key={item} href={`#${item.toLowerCase()}`}
                style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 9, letterSpacing: 3, color: '#5a5a7a', textTransform: 'uppercase', transition: 'color .2s,text-shadow .2s' }}
                onMouseEnter={e => { e.target.style.color = '#00f5ff'; e.target.style.textShadow = '0 0 8px #00f5ff'; }}
                onMouseLeave={e => { e.target.style.color = '#5a5a7a'; e.target.style.textShadow = 'none'; }}
              >{item}</a>
            )}
            <button onClick={() => navigate('/admin')}
              style={{ background: 'none', border: '1px solid #ffffff15', color: '#5a5a7a', padding: '6px 14px', fontFamily: 'Orbitron,sans-serif', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00f5ff60'; e.currentTarget.style.color = '#00f5ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff15'; e.currentTarget.style.color = '#5a5a7a'; }}
            >ADMIN</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 80px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: '50%', width: 40, height: 2, background: 'linear-gradient(to right,transparent,#00f5ff)' }} />
          <div style={{ fontSize: 11, letterSpacing: 6, color: '#00f5ff', fontFamily: 'Orbitron,sans-serif', textTransform: 'uppercase', marginBottom: 24, animation: 'slideUp .8s ease both', textShadow: '0 0 10px #00f5ff' }}>
            Landscape · Architecture · Visual Design
          </div>
          <h1 style={{ fontFamily: 'Orbitron,sans-serif', fontWeight: 900, fontSize: 'clamp(56px,8vw,120px)', lineHeight: .95, letterSpacing: -1, animation: 'slideUp .8s ease both', animationDelay: '.1s', marginBottom: 32 }}>
            <GlitchText text="CGDONG" style={{ display: 'block', background: 'linear-gradient(135deg,#eef0ff 40%,#00f5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#ff2d78,#7b2fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '.6em', fontWeight: 400, letterSpacing: 8 }}>PORTFOLIO</span>
          </h1>
          <p style={{ maxWidth: 480, fontSize: 15, lineHeight: 1.8, color: '#7a7a9a', animation: 'slideUp .8s ease both', animationDelay: '.2s', marginBottom: 48 }}>
            조경·건축·3D·영상을 넘나드는 공간 디자이너. 자연과 도시, 기술이 만나는 지점에서 감각적인 공간 경험을 표현합니다.
          </p>
          <a href="#works" style={{ textDecoration: 'none', fontFamily: 'Orbitron,sans-serif', fontSize: 10, letterSpacing: 4, color: '#04040c', background: '#00f5ff', padding: '14px 36px', textTransform: 'uppercase', boxShadow: '0 0 30px #00f5ff60,0 0 60px #00f5ff30', animation: 'slideUp .8s ease both', animationDelay: '.3s', display: 'inline-block', transition: 'box-shadow .3s,transform .3s' }}
            onMouseEnter={e => { e.target.style.boxShadow = '0 0 50px #00f5ff90,0 0 100px #00f5ff50'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.boxShadow = '0 0 30px #00f5ff60,0 0 60px #00f5ff30'; e.target.style.transform = 'translateY(0)'; }}
          >EXPLORE WORKS</a>
          <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'float 3s ease-in-out infinite' }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: '#3a3a5a', fontFamily: 'Orbitron,sans-serif', textTransform: 'uppercase' }}>SCROLL</div>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,#3a3a5a,transparent)' }} />
          </div>
        </section>

        {/* WORKS */}
        <section id="works" style={{ padding: '80px 60px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Orbitron,sans-serif', letterSpacing: 6, fontWeight: 700, textTransform: 'uppercase', fontSize: 20, color: 'rgb(201,201,201)' }}>Selected Works</h2>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,#5a5a7a30,transparent)' }} />
            <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 10, color: '#3a3a5a', letterSpacing: 2 }}>{String(filtered.length).padStart(2, '0')}</span>
          </div>

          <CategoryFilter active={category} onChange={setCategory} />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'Orbitron,sans-serif', fontSize: 10, letterSpacing: 4, color: '#3a3a5a' }}>
              LOADING...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {filtered.map((p, i) => <ProjectCard key={p.id} project={p} onClick={setSelected} index={i} />)}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'Orbitron,sans-serif', fontSize: 10, letterSpacing: 4, color: '#3a3a5a', textTransform: 'uppercase' }}>
              NO PROJECTS YET
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '60px 80px', borderTop: '1px solid #ffffff08', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 13, fontWeight: 900, letterSpacing: 4, color: '#00f5ff20' }}>CGDONG</div>
          <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 9, letterSpacing: 3, color: '#3a3a5a', textTransform: 'uppercase' }}>© 2025 All Rights Reserved</div>
        </footer>
      </div>
    </>
  );
}

function ProjectDetail({ project, onBack }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 50); window.scrollTo(0, 0); }, []);
  const color = project.color || '#00f5ff';
  const gradient = project.gradient || `linear-gradient(135deg,${color},#7b2fff)`;

  return (
    <div style={{ minHeight: '100vh', opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(20px)', transition: 'all .5s cubic-bezier(.23,1,.32,1)' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to bottom,rgba(4,4,12,.95),transparent)', backdropFilter: 'blur(10px)' }}>
        <button onClick={onBack} style={{ background: 'none', border: `1px solid ${color}60`, color, padding: '8px 20px', fontFamily: 'Orbitron,sans-serif', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', boxShadow: `0 0 10px ${color}30`, transition: 'all .2s' }}
          onMouseEnter={e => { e.target.style.background = `${color}20`; }}
          onMouseLeave={e => { e.target.style.background = 'none'; }}
        >← BACK</button>
        <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 11, letterSpacing: 4, color: '#5a5a7a' }}>CGDONG PORTFOLIO</div>
      </div>

      <div style={{ height: '60vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '60px 80px' }}>
        {project.imageUrl
          ? <img src={project.imageUrl} alt={project.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .6 }} />
          : <div style={{ position: 'absolute', inset: 0, background: gradient, opacity: .4 }} />
        }
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,4,12,1) 0%,rgba(4,4,12,.3) 60%,transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color, fontFamily: 'Orbitron,sans-serif', textTransform: 'uppercase', marginBottom: 14, textShadow: `0 0 10px ${color}` }}>
            {project.category} / {project.year}
          </div>
          <h1 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(32px,5vw,72px)', fontWeight: 900, letterSpacing: 2, color: '#eef0ff', textShadow: `0 0 40px ${color}40`, lineHeight: 1.1 }}>
            {project.title}
          </h1>
        </div>
      </div>

      <div style={{ padding: '60px 80px', maxWidth: 1200 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color, fontFamily: 'Orbitron,sans-serif', textTransform: 'uppercase', marginBottom: 18 }}>ABOUT THIS PROJECT</div>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: '#c0c0d8', fontWeight: 300 }}>{project.description}</p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {(project.tags || []).map(t =>
                <span key={t} style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Orbitron,sans-serif', padding: '7px 16px', border: `1px solid ${color}`, color, background: `${color}10`, boxShadow: `0 0 10px ${color}30` }}>{t}</span>
              )}
            </div>
          </div>
          <div>
            {project.imageUrl && (
              <img src={project.imageUrl} alt={project.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 2, border: `1px solid ${color}30` }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
