// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


// import React from 'react'
// import ReactDOM from 'react-dom'
// import { createStore } from 'redux'
// import {Provider} from 'react-redux'
// import noteReducer from './reducers/noteReducer'


// const noteReducer = (state = [], action) => {
//   if (action.type === 'NEW_NOTE') {
//     state.push(action.data)
//     return state
//   }

//   return state
// }

// const store = createStore(noteReducer)

// store.dispatch({
//   type: 'NEW_NOTE',
//   data: {
//     content: 'the app state is in redux store',
//     important: true,
//     id: 1
//   }
// })

// store.dispatch({
//   type: 'NEW_NOTE',
//   data: {
//     content: 'state changes are made with actions',
//     important: false,
//     id: 2
//   }
// })

// const App = () => {
//   return(
//     <div>
//       <ul>
//         {store.getState().map(note=>
//           <li key={note.id}>
//             {note.content} <strong>{note.important ? 'important' : ''}</strong>
//           </li>
//         )}
//         </ul>
//     </div>
//   )
// }


// const counterReducer = (state = 0, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return state + 1
//     case 'DECREMENT':
//       return state - 1
//     case 'ZERO':
//       return 0
//     default:
//       return state
//   }
// }

// const store = createStore(counterReducer)

// const App = () => {
//   return (
//     <div>
//       <div>
//         {store.getState()}
//       </div>
//       <button 
//         onClick={e => store.dispatch({ type: 'INCREMENT' })}
//       >
//         plus
//       </button>
//       <button
//         onClick={e => store.dispatch({ type: 'DECREMENT' })}
//       >
//         minus
//       </button>
//       <button 
//         onClick={e => store.dispatch({ type: 'ZERO' })}
//       >
//         zero
//       </button>
//     </div>
//   )
// }

// const renderApp = () => {
//   ReactDOM.render(
//   	<Provider store={store}>
//   	<App />
//   	</Provider>,
//   	document.getElementById('root'))
// }

// renderApp()
// store.subscribe(renderApp)



import React from 'react'
import ReactDOM from 'react-dom'
// import { createStore,combineReducers } from 'redux'
import { Provider } from 'react-redux' 
import App from './App'
// import noteReducer ,{ initializeNotes } from './reducers/noteReducer'
import store from './store'
// import filterReducer from './reducers/filterReducer'
// import { createNote } from './reducers/noteReducer'
// import { filterChange } from './reducers/filterReducer'
// import {composeWithDevTools } from 'redux-devtools-extension'
// import noteService from './services/notes'


// const reducer=combineReducers({
// 	notes:noteReducer,
// 	filter:filterReducer
// })

// const store = createStore(
// 	reducer
// )

// noteService.getAll().then(notes=>
// 	// notes.forEach(note=>{
// 	// 	store.dispatch({type:'NEW_NOTE',data:note})
// 	// })
// 	store.dispatch(initializeNotes(notes))
// )
// // console.log(store.getState())
// store.subscribe(()=>console.log(store.getState()))
// store.dispatch(filterChange('IMPORTANT'))
// store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))

ReactDOM.render(

  <Provider store={store}>
    <App />
  </Provider>,

  document.getElementById('root')
)