### Pure functions, immutable

-  它打破了 Redux 的 reducer 必须是[纯函数](https://en.wikipedia.org/wiki/Pure_function)的[基本假设](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#handling-actions)：纯函数是这样的，它们不会引起任何副作用，当使用相同的参数调用时，它们必须始终返回相同的结果。

  > 我们使用方法 *state.push(action.data)* 向状态添加了一个新 note，该方法更改 state-对象的状态。 这是不允许的。 使用 concat 方法可以很容易地解决这个问题，它创建一个新数组，其中包含旧数组和新元素的所有元素:
  >
  > ```js
  > const noteReducer = (state = [], action) => {
  >   if (action.type === 'NEW_NOTE') {
  >     return state.concat(action.data)
  >   }
  > 
  >   return state
  > }
  > ```

- Reducer 状态必须由不可变 [immutable](https://en.wikipedia.org/wiki/Immutable_object) 对象组成。 如果状态发生了更改，则不会更改旧对象，而是将其替换为新的、已更改的对象。 这正是我们对新的 reducer 所做的: 用新的数组替换旧的数组。

  ------

  ### Uncontrolled form

  值得注意的是，我们没有像前面那样将表单字段的状态绑定到 App 组件的状态。 React 称这种形式为不受控的[uncontrolled](https://reactjs.org/docs/uncontrolled-components.html)。

> Uncontrolled forms have certain limitations (for example, dynamic error messages or disabling the submit button based on input are not possible). However they are suitable for our current needs.
> 非受控的表单有某些限制(例如，不能发送动态错误消息或根据输入禁用提交按钮)。 然而，他们是适合我们目前需求的。

你可以在[这里](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)阅读更多关于非受控表单的内容。

------

### Action creators

【Action 创造器】

我们开始注意到，即使在像我们这样简单的应用程序中，使用 Redux 也可以简化前端代码。 然而，我们可以做得更好。

实际上，Redux 组件并不需要知道 Redux 操作的类型和形式。 让我们将创建行为分离到它们自己的功能中:

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}
```

创建action的函数称为action创建器[action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators)。

App 组件不再需要知道任何关于 action 的内部表示，它只需要调用 creator-函数就可以获得正确的操作:

```js
const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content))    
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))  }

  // ...
}
```

------

### Forwarding Redux-Store to various components

【Redux-Store 到多种组件】

除了reducer，我们的应用是在一个文件。 这当然是不明智的，我们应该将*App* 分离到它自己的模块中。

现在的问题是，移动后*App* 如何访问store？ 更广泛地说，当一个组件由许多较小的组件组成时，必须有一种方法让所有组件访问store。

有多种方法可以与组件共享 redux-store。 首先，我们将研究使用最新的，也是最简单的方法，即 [react-redux](https://react-redux.js.org/) 的[hooks](https://react-redux.js.org/api/hooks)-api 。

首先我们安装 react-redux

```js
npm install react-redux
```

接下来，我们将 App 组件移动到它自己的文件 App.js 中。 让我们看看这将如何影响其余的应用文件。

对 App 组件的更改很小。 这个 store 现在可以通过`props.store`的属性进入:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.render(
  <Provider store={store}>    <App />
  </Provider>,  document.getElementById('root')
)
```

请注意，应用现在被定义为由 redux 库提供的[Provider](https://react-redux.js.org/api/provider)的子组件。

应用的存储作为store属性提供给Provider

action创建器的定义已经移到了 reducer 文件中

*App* 组件的代码

```js
import React from 'react'
import { 
  createNote, toggleImportanceOf
} from './reducers/noteReducer' 
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()  const notes = useSelector(state => state)
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note =>          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
```

*useDispatch*-hook 提供了所有 React 组件对dispatch-函数的访问，这个 redux-store 的 dispatch-函数是在*index.js* 中定义的 。

这就允许所有组件对 redux-store 的状态进行更改。

该组件可以通过 react-redux 库的[useSelector](https://react-redux.js.org/api/hooks#useselector)-hook访问存储在store中的便笺。

```js
import { useSelector, useDispatch } from 'react-redux'
const App = () => {
  // ...
  const notes = useSelector(state => state)  // ...
}
```

*useSelector* 接收一个函数作为参数，该函数可以搜索或选择来自 redux-store 的数据。

这里我们需要所有的便笺，所以我们的 selector 函数返回整个状态:

```js
state => state
```

通常选择器函数比较有趣，只返回 redux-store 内容的选定部分。

例如，我们可以只返回标记为重要的便笺:

```js
const importantNotes = useSelector(state => state.filter(note => note.important))  
```

*Note**，负责渲染单个note非常简单，并且不知道它获得的事件处理作为属性分派到 action。 在 React 术语中，这种类型的组件被称为*[展示层presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) *。*

*Note**，从另一方面来说， 是一个*[容器container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) *组件，因为它包含一些应用逻辑: 它定义 Note 组件的事件处理程序做什么，并协调表示* *presentational**组件的配置，即**Note**s。【TODO】*

------

工具概念：

- 应用程序似乎正常工作，但我们声明的 reducer 并不优雅。 它打破了 Redux 的 reducer 必须是[纯函数](https://en.wikipedia.org/wiki/Pure_function)的[基本假设](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#handling-actions)

- [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) 

- 当我们通过解构[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)的方式从数组中获取元素时，会使用类似的语法来收集其余的元素

- 创建action的函数称为action创建器[action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators)。

- *Note**，负责渲染单个note非常简单，并且不知道它获得的事件处理作为属性分派到 action。 在 React 术语中，这种类型的组件被称为*[展示层presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) *。*

- *Note**，从另一方面来说， 是一个*[容器container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) *组件，因为它包含一些应用逻辑: 它定义 Note 组件的事件处理程序做什么，并协调表示* *presentational**组件的配置，即**Note**s*

- [reducer](https://redux.js.org/basics/reducers) 

- [store](https://redux.js.org/basics/store)

-  [actions](https://redux.js.org/basics/actions)

- 创建action的函数称为action创建器[action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators)。

  





















# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



