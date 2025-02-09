
type Props = {
  onStart: () => void
}

export default function Splash({ onStart }: Props) {
  return (
    <div>
      <h1>Contact</h1>
      <span style={{ fontStyle: 'italic' }}>Mind meld with artificial intelligence</span>
      <div style={{ marginTop: '20px' }}>
        <button onClick={onStart}>Play</button>
      </div>
    </div>
  );
}
