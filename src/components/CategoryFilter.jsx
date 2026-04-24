const CATEGORIES = [
  { id: 'all', en: 'ALL WORKS', ko: '전체', color: '#00f5ff' },
  { id: 'recent', en: 'RECENT WORKS', ko: '최근작업', color: '#00f5ff' },
  { id: 'landscape', en: 'LANDSCAPE · ARCHITECTURE', ko: '조경/건축', color: '#aaff00' },
  { id: 'competition', en: 'COMPETITION · PROPOSAL', ko: '현상공모/제안', color: '#ff2d78' },
  { id: 'masterplan', en: 'MASTER PLAN', ko: '마스터플랜', color: '#7b2fff' },
  { id: 'animation', en: 'ANIMATION · PROMO', ko: 'ANIMATION/홍보영상', color: '#ff8c00' },
  { id: 'modeling', en: '3D-MODELING', ko: '3D모델링', color: '#aaff00' },
];

export { CATEGORIES };

export default function CategoryFilter({ active, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48, borderBottom: '1px solid #ffffff08', paddingBottom: 28 }}>
      {CATEGORIES.map(cat => {
        const on = active === cat.id;
        return (
          <button key={cat.id} onClick={() => onChange(cat.id)}
            style={{
              background: on ? `${cat.color}18` : 'transparent',
              border: `1px solid ${on ? cat.color : '#ffffff15'}`,
              color: on ? cat.color : '#5a5a7a',
              padding: '10px 16px', fontFamily: 'Orbitron,sans-serif',
              fontSize: 8, letterSpacing: 2, textTransform: 'uppercase',
              transition: 'all .2s', boxShadow: on ? `0 0 16px ${cat.color}40` : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}
            onMouseEnter={e => { if (!on) { e.currentTarget.style.borderColor = cat.color + '60'; e.currentTarget.style.color = cat.color + 'cc'; } }}
            onMouseLeave={e => { if (!on) { e.currentTarget.style.borderColor = '#ffffff15'; e.currentTarget.style.color = '#5a5a7a'; } }}
          >
            <span>{cat.en}</span>
            <span style={{ fontSize: 7, opacity: .75, fontFamily: 'Space Grotesk,sans-serif', letterSpacing: 1 }}>{cat.ko}</span>
          </button>
        );
      })}
    </div>
  );
}
