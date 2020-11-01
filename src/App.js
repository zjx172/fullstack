// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }




// import React from 'react'
// import { 
//   createNote, toggleImportanceOf
// } from './reducers/noteReducer' 
// import { useSelector, useDispatch } from 'react-redux'

// const generateId = () =>
//   Number((Math.random() * 1000000).toFixed(0))

// const App = () => {
//   const addNote = (event) => {
//     event.preventDefault()
//     const content = event.target.note.value
//     event.target.note.value = ''
//     store.dispatch({
//       type: 'NEW_NOTE',
//       data: {
//         content,
//         important: false,
//         id: generateId()
//       }
//     })
//   }

//   const toggleImportance = (id) => {
//     store.dispatch({
//       type: 'TOGGLE_IMPORTANCE',
//       data: { id }
//     })
//   }

//   return (
//     <div>
//       <form onSubmit={addNote}>
//         <input name="note" /> 
//         <button type="submit">add</button>
//       </form>
//       <ul>
//         {store.getState().map(note =>
//           <li
//             key={note.id} 
//             onClick={() => toggleImportance(note.id)}
//           >
//             {note.content} 
//             <strong>{note.important ? 'important' : ''}</strong>
//           </li>
//         )}
//       </ul>
//     </div>
//   )
// }

// export default App;


import React ,{useEffect} from 'react'
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
// import noteService from './services/notes'
import { initializeNotes } from './reducers/noteReducer'
import {useDispatch } from 'react-redux'

const App = () => {
  // const filterSelected = (value) => {
  //   console.log(value)
  // }
  const dispatch = useDispatch()
  useEffect(()=>{
    // noteService
    //  .getAll().then(notes=>dispatch(initializeNotes(notes)))
    dispatch(initializeNotes())
  },[dispatch])
  return (
    <div>
      <NewNote />
      <VisibilityFilter/>
      <Notes />
    </div>
  )
}

export default App
