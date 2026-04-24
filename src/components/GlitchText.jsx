export default function GlitchText({ text, style = {} }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{ position: 'absolute', inset: 0, color: '#ff2d78', animation: 'glitch 3s infinite', animationDelay: '.1s', pointerEvents: 'none', userSelect: 'none' }}>{text}</span>
      <span style={{ position: 'absolute', inset: 0, color: '#00f5ff', animation: 'glitch2 3s infinite', animationDelay: '.2s', pointerEvents: 'none', userSelect: 'none' }}>{text}</span>
      {text}
    </span>
  );
}
