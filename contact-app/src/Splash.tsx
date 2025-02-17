type Props = {
  onStart: () => void;
};

export default function Splash({ onStart }: Props) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Contact</h1>
      <span style={{ fontStyle: 'italic' }}>
        Mind meld with artificial intelligence
      </span>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={onStart}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}
