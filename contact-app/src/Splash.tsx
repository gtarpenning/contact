import React from "react";

type Props = {
  onStart: () => void
}

export default function Splash({ onStart }: Props) {
  return (
    <div>
      <h1>Contact</h1>
      <button onClick={onStart}>Play</button>
    </div>
  );
}
