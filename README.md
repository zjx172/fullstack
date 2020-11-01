------

现在让我们安装[redux-thunk](https://github.com/gaearon/redux-thunk)-库，它允许我们创建*asynchronous actions*:

```bash
npm install redux-thunk
```

Redux-thunk-库 是所谓的*redux-中间件*，它必须在store的初始化过程中初始化。 在这里，让我们将store的定义提取到它自己的文件 *src/store.js* 中。:

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'import { composeWithDevTools } from 'redux-devtools-extension'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)  )
)

export default store
```

更改之后，文件 *src/index.js*如下所示

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux' 
import store from './store'import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

感谢 redux-thunk，可以定义*action creators*，这样它们就可以返回一个函数，其参数是 redux-store 的*dispatch*-method。 因此，可以创建异步action创建器，它们首先等待某个action完成，然后分派真正的action。

现在，我们可以定义action创建器*initializeNotes*，它初始化便笺的状态如下:

```js
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch({
      type: 'INIT_NOTES',
      data: notes,
    })
  }
}
```

在内部函数(即*异步 action*)中，操作首先从服务器获取所有便笺，然后*将* 便笺分发到action中，从而将它们添加到store中。

组件*App* 现在可以定义如下:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {    dispatch(initializeNotes())   },[dispatch]) 
  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}
```

这个解决方案非常优雅。便笺的初始化逻辑已经完全分离到 React 组件之外。

action 构造器 *createNote* 添加了一个新的便笺，看起来像这样

```js
export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch({
      type: 'NEW_NOTE',
      data: newNote,
    })
  }
}
```

这里的原理是相同的: 首先执行一个异步操作，然后调度改变store态的action。

*NewNote*组件更改如下:

```js
const NewNote = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">lisää</button>
    </form>
  )
}
```