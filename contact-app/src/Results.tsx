
const Results = ({ score }: { score: number }) => {


  return <div>
    <h1>CONTACT</h1>
    <div>
        <p>You just made contact with an AI...</p>
        <p>It only took you {score} guesses!</p>
    </div>
  </div>
}

export default Results
