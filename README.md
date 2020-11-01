我们还要创建一个新的action创建函数。 我们将在一个新的*src/reducers/filterReducer.js*中为action创建器编写代码 模块:

```js
const filterReducer = (state = 'ALL', action) => {
  // ...
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    filter,
  }
}

export default filterReducer
```

我们可以为我们的应用创建实际的reducer，通过结合现有的两个reducer和[combineReducers](https://redux.js.org/api/combineReducers)函数。

让我们在*index.js* 文件中定义组合的 reducer:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'import { Provider } from 'react-redux' 
import App from './App'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'
const reducer = combineReducers({  notes: noteReducer,  filter: filterReducer})
const store = createStore(reducer)

console.log(store.getState())

ReactDOM.render(
  /*
  <Provider store={store}>
    <App />
  </Provider>,
  */
  <div />,
  document.getElementById('root')
)
```

由于我们的应用在这一点上完全中断，因此我们渲染一个空的*div* 元素，而不是*App* 组件。

存储的状态被打印到控制台:

![fullstack content](https://fullstackopen.com/static/1b0877b46c22965801911f30d5bb233d/5a190/4e.png)



正如我们可以看到的输出信息，store正是我们想要的！

让我们仔细看看组合reducer是如何创建的:

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```

上面由 reducer 定义的存储状态是一个具有两个属性的对象:*notes* 和*filter*。*notes* 属性的值由*noteReducer* 定义，它不必处理状态的其他属性。 类似地，*filter**属性由\*filterReducer\*管理。*

------

### Finishing the filters

*【完成过滤器】*

