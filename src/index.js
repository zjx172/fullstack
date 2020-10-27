// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// import React from 'react'
// import ReactDOM from 'react-dom'
// const Hello = (props) => {
//   const bornYear = () => {
//     const yearNow = new Date().getFullYear()
//     return yearNow - props.age
//   }

//   return (
//     <div>
//       <p>
//         Hello {props.name}, you are {props.age} years old
//       </p>
//       <p>So you were probably born in {bornYear()}</p>
//     </div>
//   )
// }



// const Hello = ({ name, age }) => {
//    // const { name, age } = props

//   const bornYear = () => new Date().getFullYear() - age

//   return (
//     <div>
//       <p>Hello {name}, you are {age} years old</p>
//       <p>So you were probably born in {bornYear()}</p>
//     </div>
//   )
// }

// const App = () => {
//   const name = 'Peter'
//   const age = 10

//   return (
//     <div>
//       <h1>Greetings</h1>
//       <Hello name="Maya" age={26 + 10} />
//       <Hello name={name} age={age} />
//     </div>
//   )
// }
// ReactDOM.render(<App />, document.getElementById('root'))



// const App = (props) => {
//   const {counter} = props
//   return (
//     <div>{counter}</div>
//   )
// }

// let counter = 1

// ReactDOM.render(
//   <App counter={counter} />, 
//   document.getElementById('root')
// )


// import React, { useState } from 'react'
// const App = () => {
//   const [ counter, setCounter ] = useState(0)//调用
//   setTimeout(
//     () => setCounter(counter + 1),
//     1000
//   )
//   console.log('rendering...', counter)
//   return (
//     <div>{counter}</div>
//   )
// }


// const Display = (props) => {
//   return (
//     <div>{props.counter}</div>
//   )
// }

// const Button = (props) => {
//   return (
//     <button onClick={props.handleClick}>
//       {props.text}
//     </button>
//   )
// }

// const App = () => {
//   const [clicks, setClicks] = useState({
//     left: 0, right: 0
//   })

//   // const handleLeftClick = () => {
//   //   const newClicks = { 
//   //     left: clicks.left + 1, 
//   //     right: clicks.right 
//   //   }
//   //   setClicks(newClicks)
//   // }

//   // const handleRightClick = () => {
//   //   const newClicks = { 
//   //     left: clicks.left, 
//   //     right: clicks.right + 1 
//   //   }
//   //   setClicks(newClicks)
//   // }

// //   const handleLeftClick = () => {
// //   const newClicks = { 
// //     ...clicks, 
// //     left: clicks.left + 1 
// //   }
// //   setClicks(newClicks)
// // }

// // const handleRightClick = () => {
// //   const newClicks = { 
// //     ...clicks, 
// //     right: clicks.right + 1 
// //   }
// //   setClicks(newClicks)
// // }


// const handleLeftClick = () =>
//   setClicks({ ...clicks, left: clicks.left + 1 })

// const handleRightClick = () =>
//   setClicks({ ...clicks, right: clicks.right + 1 })


//   return (
//     <div>
//       {clicks.left}
//       <button onClick={handleLeftClick}>left</button>
//       <button onClick={handleRightClick}>right</button>
//       {clicks.right}
//     </div>
//   )
// }

// const History = (props) => {
//   if (props.allClicks.length === 0) {
//     return (
//       <div>
//         the app is used by pressing the buttons
//       </div>
//     )
//   }

//   return (
//     <div>
//       button press history: {props.allClicks.join(' ')}
//     </div>
//   )
// }

// const Button = ({ onClick, text }) => (
//   <button onClick={onClick}>
//     {text}
//   </button>
// )

// const App = () => {
//   const [left, setLeft] = useState(0)
//   const [right, setRight] = useState(0)
//   const [allClicks, setAll] = useState([])

//   const handleLeftClick = () => {
//     setAll(allClicks.concat('L'))
//     setLeft(left + 1)
//   }

//   const handleRightClick = () => {
//     setAll(allClicks.concat('R'))
//     setRight(right + 1)
//   }

//   return (
//     <div>
//       {left}
//       <Button onClick={handleLeftClick} text='left' />
//       <Button onClick={handleRightClick} text='right' />
//       {right}
//       <History allClicks={allClicks} />
//     </div>
//   )
// }





// const App = () => {
//   const [value, setValue] = useState(10)
  
//   const setToValue = (newValue) => () => {
//     setValue(newValue)
//   }
  
//   return (
//     <div>
//       {value}
//       <button onClick={setToValue(1000)}>thousand</button>
//       <button onClick={setToValue(0)}>reset</button>
//       <button onClick={setToValue(value + 1)}>increment</button>
//     </div>
//   )
// }

// const App = () => {
//   const [value, setValue] = useState(10)

//   const setToValue = (newValue) => {
//     setValue(newValue)
//   }

//   return (
//     <div>
//       {value}
//       <button onClick={() => setToValue(1000)}>
//         thousand
//       </button>
//       <button onClick={() => setToValue(0)}>
//         reset
//       </button>
//       <button onClick={() => setToValue(value + 1)}>
//         increment
//       </button>
//     </div>
//   )
// }



// const Display = props => <div>{props.value}</div>

// const Button = (props) => (
//   <button onClick={props.handleClick}>
//     {props.text}
//   </button>
// )

// const App = () => {
//   const [value, setValue] = useState(10)

//   const setToValue = newValue => {
//     setValue(newValue)
//   }

//   return (
//     <div>
//       <Display value={value} />
//       <Button handleClick={() => setToValue(1000)} text="thousand" />
//       <Button handleClick={() => setToValue(0)} text="reset" />
//       <Button handleClick={() => setToValue(value + 1)} text="increment" />
//     </div>
//   )
// }

// ReactDOM.render(
//   <App />, 
//   document.getElementById('root')
// )


// import React, { useState } from 'react'
// import ReactDOM from 'react-dom'

// const App = (props) => {
//     const [selected, setSelected] = useState(0);
//     const setToValue = () => {
//         let random = Math.floor(Math.random() * props.anecdotes.length);
//         setSelected(random)
//     }
//     return (
//         <div>
//           { props.anecdotes[selected] }
//           <button onClick={ () => setToValue() }>okkkk</button>
//         </div>
//     )
// }

// const anecdotes = [
//     'If it hurts, do it more often',
//     'Adding manpower to a late software project makes it later!',
//     'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//     'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//     'Premature optimization is the root of all evil.',
//     'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// ReactDOM.render(
//     <App anecdotes={ anecdotes } />,
//     document.getElementById('root')
// )


// import React from 'react'
// import ReactDOM from 'react-dom'

// const notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     date: '2019-05-30T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only Javascript',
//     date: '2019-05-30T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]

// const App = (props) => {
//   const { notes } = props

//   return (
//     <div>
//       <h1>Notes</h1>
//       <ul>
//         <li>{notes[0].content}</li>
//         <li>{notes[1].content}</li>
//         <li>{notes[2].content}</li>
//       </ul>
//     </div>
//   )
// }

// ReactDOM.render(
//   <App notes={notes} />,
//   document.getElementById('root')
// )



// const App = (props) => {
//   const { notes } = props

//   return (
//     <div>
//       <h1>Notes</h1>
//        <ul>
//         {notes.map(note => 
//         	<li key={note.id}>
//         		{note.content}
//         	</li>
//         )}
//       </ul>
//     </div>
//   )
// }
// const App = ({ notes }) => {
//   return (
//     <div>
//       <h1>Notes</h1>
//       <ul>
//         {notes.map(note => 
//           <li key={note.id}>
//             {note.content}
//           </li>
//         )}
//       </ul>
//     </div>
//   )
// }


// import React from 'react'
// import ReactDOM from 'react-dom'
// // import Note from './components/Note'
// import App from './App'


// import axios from 'axios'

// axios.get('http://localhost:3001/notes').then(response => {
//   const notes = response.data
//   console.log(notes)
// })
// // console.log(promise)

// const promise2 = axios.get('http://localhost:3001/foobar')
// console.log(promise2)

// const notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     date: '2019-05-30T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only Javascript',
//     date: '2019-05-30T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]


// ReactDOM.render(
//   <App notes={notes} />,
//   document.getElementById('root')
// )

import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// import axios from 'axios'

// axios.get('http://localhost:3001/notes').then(response => {
//   const notes = response.data
//   console.log(notes);
//   ReactDOM.render(
//     <App notes={notes} />,
//     document.getElementById('root')
//   )
// })

ReactDOM.render(<App />, document.getElementById('root'))