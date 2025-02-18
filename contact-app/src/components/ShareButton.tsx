interface ShareButtonProps {
  guessCount: number;
}

const ShareButton = ({ guessCount }: ShareButtonProps) => {
  const shareText = `I made contact with AI in ${guessCount} guesses, think you can beat me?`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CONTACT - AI Word Game',
          text: shareText,
          url: 'https://contactai.life',
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        padding: '8px 16px',
        fontSize: '16px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Share
    </button>
  );
};

export default ShareButton;
