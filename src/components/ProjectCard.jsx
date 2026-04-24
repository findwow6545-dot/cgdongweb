import { useState } from 'react';

export default function ProjectCard({ project, onClick, index }) {
  const [hov, setHov] = useState(false);
  const color = project.color || '#00f5ff';
  const gradient = project.gradient || `linear-gradient(135deg,${color},#7b2fff)`;

  return (
    <div
      onClick={() => onClick(project)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', cursor: 'pointer', borderRadius: 2,
        overflow: 'hidden', aspectRatio: '4/3',
        animation: 'slideUp .6s ease both', animationDelay: `${index * .08}s`,
        transition: 'transform .35s cubic-bezier(.23,1,.32,1)',
        transform: hov ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
      }}
    >
      {project.imageUrl
        ? <img src={project.imageUrl} alt={project.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ position: 'absolute', inset: 0, background: gradient }} />
      }

      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.1) 1px,transparent 1px)',
        backgroundSize: '30px 30px', opacity: .5,
      }} />

      {[[{ bottom: 8, right: 8 }, { borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }],
        [{ top: 8, right: 8 }, { borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }],
        [{ bottom: 8, left: 8 }, { borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }],
        [{ top: 8, left: 8 }, { borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }],
      ].map(([pos, border], i) =>
        <div key={i} style={{ position: 'absolute', width: 16, height: 16, boxShadow: `0 0 6px ${color}`, ...pos, ...border }} />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top,rgba(4,4,12,.95) 0%,rgba(4,4,12,.3) 60%,transparent 100%)',
        opacity: hov ? 1 : .75, transition: 'opacity .3s',
      }} />

      <div style={{
        position: 'absolute', inset: 0, border: `1px solid ${color}`,
        boxShadow: hov ? `inset 0 0 30px ${color}20,0 0 30px ${color}60` : 'none',
        transition: 'box-shadow .35s', pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 20px',
        transform: hov ? 'translateY(0)' : 'translateY(6px)',
        transition: 'transform .35s cubic-bezier(.23,1,.32,1)',
      }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color, fontFamily: 'Orbitron,sans-serif', textTransform: 'uppercase', marginBottom: 5, textShadow: `0 0 8px ${color}` }}>
          {project.categoryId?.toUpperCase()} — {project.year}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Orbitron,sans-serif', letterSpacing: 1, color: '#eef0ff', textShadow: '0 2px 8px rgba(0,0,0,.8)' }}>
          {project.title}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', opacity: hov ? 1 : 0, transition: 'opacity .3s' }}>
          {(project.tags || []).map(t =>
            <span key={t} style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Orbitron,sans-serif', padding: '3px 7px', border: `1px solid ${color}80`, color, background: `${color}15` }}>{t}</span>
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 9, letterSpacing: 3, color: '#ffffff70', fontFamily: 'Orbitron,sans-serif', textTransform: 'uppercase', opacity: hov ? 1 : 0, transition: 'opacity .3s', display: 'flex', alignItems: 'center', gap: 6 }}>
          VIEW PROJECT <span style={{ color, fontSize: 13 }}>→</span>
        </div>
      </div>
    </div>
  );
}
