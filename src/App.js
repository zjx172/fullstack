// import React ,{ useState,useEffect }from 'react'
// import axios from 'axios' 
// import Note from './components/Note'

// const App = (props) => {
//     const [notes, setNotes] = useState([])
//     // const [notes, setNotes] = useState(props.notes)
//     const [newNote, setNewNote] = useState('')
//     const [showAll, setShowAll] = useState(true)


//     // useEffect(() => {
//     //     console.log('effect')
//     //     axios
//     //         .get('http://localhost:3001/notes')
//     //         .then(response => {
//     //             console.log('promise fulfilled')
//     //             setNotes(response.data)
//     //         })
//     // }, [])




//     // const hook = () => {
//     //     console.log('effect')
//     //     axios
//     //         .get('http://localhost:3001/notes')
//     //         .then(response => {
//     //             console.log('promise fulfilled')
//     //             setNotes(response.data)
//     //         })
//     // }

//     // useEffect(hook, [])




//     // console.log('render', notes.length, 'notes')



//     // const addNote = (event) => {
//     //     event.preventDefault()
//     //     const noteObject = {
//     //         content: newNote,
//     //         date: new Date().toISOString(),
//     //         important: Math.random() < 0.5,
//     //         id: notes.length + 1,
//     //     }

//     //     setNotes(notes.concat(noteObject))
//     //     setNewNote('')
//     // }

//     const addNote = event => {
//         event.preventDefault()
//         const noteObject = {
//             content: newNote,
//             date: new Date(),
//             important: Math.random() < 0.5,
//         }
//         axios
//             .post('http://localhost:3001/notes', noteObject)
//             .then(response => {
//                 setNotes(notes.concat(response.data))
//                 setNewNote('')
//                 console.log('swjhwsjk');
//             })
//     }


//     const toggleImportanceOf = (id) => {
//         const url = `http://localhost:3001/notes/${id}`
//         console.log(url,2878979);
//         const note = notes.find(n => n.id === id)
//         const changedNote = { ...note, important: !note.important }
//         axios.put(url, changedNote).then(response => {
//         setNotes(notes.map(note => note.id !== id ? note : response.data))
//         })
//     }

//     const handleNoteChange = (event) => {
//         console.log(event.target.value,789798)
//         setNewNote(event.target.value)
//     }

//     const notesToShow = showAll
//     ? notes
//     : notes.filter(note => note.important === true)

//     return (
//         <div>
//             <h1>Notes</h1>   
//             <button onClick={() => setShowAll(!showAll)}>
//                 show {showAll ? 'important' : 'all' }
//             </button>
//             <ul>
//                 {notesToShow.map((note, i) => 
//                 <Note
//                 key={i}
//                 note={note} 
//                 toggleImportance={() => toggleImportanceOf(note.id)}
//                 />)}
//             </ul>
//             <ul>
//                 {notesToShow.map(note =>
//                     <Note key={ note.id } note={ note } />
//                 )}
//             </ul>
//             <form onSubmit={ addNote }>
//                 <input value={ newNote } onChange={ handleNoteChange } />
//             <button type="submit">save</button>
//             </form>
//         </div>
//     )
// }
// export default App



import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div> 
  )
}

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState('some error happened...')
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [user,setUser]=useState(null)

    useEffect(() => {
        // noteService
        //     .getAll()
        //     .then(response => {
        //         setNotes(response.data)
        // })
        noteService
        .getAll()
        .then(initialNotes => {
            // console.log(initialNotes);
            setNotes(initialNotes)
        })
    }, [])

     useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteService.setToken(user.token)
        }
    }, [])

    const toggleImportanceOf = (id) => {
        // const url = `http://localhost:3001/notes/${id}`
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }
        // console.log(changedNote)
        // axios.put(url, changedNote).then(response => {
        //     console.log(response);
        // setNotes(notes.map(note => note.id !== id ? note : response.data))
        // })
        noteService
        .update(id, changedNote).then(returnedNote=>{
            setNotes(notes.map(note=>note.id!==id?note:returnedNote))
        })
        .catch(error=>{
            setErrorMessage(
                `Note '${note.content}' was already removed from server`
            )
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
            setNotes(notes.filter(n=>n.id!==id))
        })
            // .then(response => {
            //     console.log(response,2222);
            //     let newnote=notes.map(note => note.id !== id ? note : response.data)
            //     console.log(newnote,22333)
            //     setNotes(newnote)
            // })
            // .then(returnedNote => {
            //     setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            // })




        // console.log('importance of ' + id + ' needs to be toggled')
    }
    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5,
            id: notes.length + 1,
        }

        // axios
        //     .post('http://localhost:3001/notes', noteObject)
        //     .then(response => {
        //         setNotes(notes.concat(response.data))
        //         setNewNote('')
        //     })

        noteService
            .create(noteObject)
            // .then(response => {
            //     setNotes(notes.concat(response.data))
            //     setNewNote('')
            // })
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
        }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)


    const handleLogin= async (event)=>{
        event.preventDefault()
        // console.log('logging in with',username,password)
        try{
            const user=await loginService.login({
                username,
                password
            })
            console.log(user.token)
            window.localStorage.setItem(
                'loggedNoteappUser', JSON.stringify(user)
            ) 
            noteService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        }catch(exception){
            setErrorMessage('Wrong credentials')
            setTimeout(()=>{
                setErrorMessage(null)
            },5000)
        }
    }



     const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  
  )

//             // {user === null && loginForm()}
            // {user !== null && noteForm()}


    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />

               {user === null ?
                loginForm() :
                <div>
                    <p>{user.name} logged-in</p>
                    {noteForm()}
                </div>
            }
            <h2>Notes</h2>


            <div>
                <button onClick={ () => setShowAll(!showAll) }>
                    show{ showAll ? ' important' : ' all' }
                </button>
            </div>
            <ul>
                { notesToShow.map((note, i) =>
                <Note 
                    key={ i }
                    note={ note }
                    toggleImportance={() => toggleImportanceOf(note.id)}/>
                )}
            </ul>
            <form onSubmit={ addNote }>
                <input value={ newNote } onChange={ handleNoteChange } />
                <button type="submit">save</button>
            </form>
            <Footer />
        </div>
    )
}

export default App 