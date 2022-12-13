import { useState } from 'react'


const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticsLine = ({text, value}) => {
  
  return (
    <table> 
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      </tbody>
    </table>
  )
}

const Statistics = ({good,neutral,bad}) => {
  if (good===0 && neutral===0 && bad === 0) {
    return (
      <>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <>
      <h1>Statistics</h1>
      <StatisticsLine text='good' value={good}/>
      <StatisticsLine text='neutral' value={neutral}/>
      <StatisticsLine text='bad' value={bad}/>
      <StatisticsLine text='all' value={good + neutral + bad}/>
      <StatisticsLine text='average' value={(good - bad)/(good + neutral + bad)}/>
      <StatisticsLine text='positive' value={good/(good + neutral + bad)}/>
    </>
  )
}

const Anecdotes = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(7))
  const [index, setIndex] = useState()

  const handleRandomAnecdoteClick = () => {
    let randomNumber = (Math.random()*10)
    if (randomNumber>=anecdotes.length){
      randomNumber = anecdotes.length - 1
    }
    setSelected(parseInt(randomNumber))
  }

  const handleVoteClick = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)

    // Aquire largest number and the index of that number

    const maxValue = Math.max(...copy);
    setIndex(copy.indexOf(maxValue));
  }


  const handleNextAnecdoteClick = () => {
    if (selected === 6) {
      setSelected(0)
    }
    else {
      setSelected(selected + 1)
    }
  }

  
  return (
    <>
      <h1>Anecdotes</h1>
      <Button handleClick={handleRandomAnecdoteClick} text='random anecdote'/>
      <Button handleClick={handleVoteClick} text='vote'></Button>
      <Button handleClick={handleNextAnecdoteClick} text='next anecdote'></Button>
      <p>{anecdotes[selected]}</p>
      <h3>Votes</h3>
      <p>has {points[selected]} votes!</p>
      <h1>Most voted anecdote</h1>
      <p>{anecdotes[index]}</p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <>
      <h1>give Feedback</h1>
      <Button handleClick={handleGoodClick} text='good'/>
      <Button handleClick={handleNeutralClick} text='neutral'/>
      <Button handleClick={handleBadClick} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
      <Anecdotes />
    </>
  )
}



export default App