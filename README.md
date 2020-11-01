为了完成这一章节，我们将研究使用 redux 的另一种更古老、更复杂的方法，redux 提供的[connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md)-函数。

### Using the connect-function to share the redux store to components

【使用 connect-function 将 redux 存储共享给组件】

让我们首先使用 connect 函数将*Notes* 组件转换为*连接组件*:

```js
import React from 'react'
import { connect } from 'react-redux'import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // ...
}

const ConnectedNotes = connect()(Notes)export default ConnectedNotes
```

该模块导出的*连接组件* 与之前的常规组件工作方式完全相同。

组件需要 Redux 存储中的便笺列表和筛选器的值。 Connect 函数接受所谓的[mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapStateToProps-state-ownprops--object)函数作为它的第一个参数。 这个函数可以用来定义基于 Redux 存储状态的*连接组件* 的props。

如果我们定义:

```js
const Notes = (props) => {  const dispatch = useDispatch()

  const notesToShow = () => {    if ( props.filter === 'ALL ') {      return props.notes    }        return props.filter  === 'IMPORTANT'       ? props.notes.filter(note => note.important)      : props.notes.filter(note => !note.important)  }
  return(
    <ul>
      {notesToShow().map(note =>        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

const ConnectedNotes = connect(mapStateToProps)(Notes)
export default ConnectedNotes
```

该模块导出的*连接组件* 与之前的常规组件工作方式完全相同。

组件需要 Redux 存储中的便笺列表和筛选器的值。 Connect 函数接受所谓的[mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapStateToProps-state-ownprops--object)函数作为它的第一个参数。 这个函数可以用来定义基于 Redux 存储状态的*连接组件* 的props。

如果我们定义:

```js
const Notes = (props) => {  const dispatch = useDispatch()

  const notesToShow = () => {    if ( props.filter === 'ALL ') {      return props.notes    }        return props.filter  === 'IMPORTANT'       ? props.notes.filter(note => note.important)      : props.notes.filter(note => !note.important)  }
  return(
    <ul>
      {notesToShow().map(note =>        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

const ConnectedNotes = connect(mapStateToProps)(Notes)
export default ConnectedNotes
```

Notes组件可以直接访问存储的状态，例如通过包含便笺列表的 propss.Notes。 类似地，props.filter 引用了过滤器的值。

使用*connect* 和我们定义的*mapStateToProps* 函数的结果可以这样可视化:

![fullstack content](https://fullstackopen.com/static/8d9b109ea7cd8799e42f204d5a7ae39e/5a190/24c.png)



Notes 组件通过 props.Notes 和*props.filter* 具有“直接访问”功能，用于检查 Redux 存储的状态。

【跟vue的mixin差不多】

Notelist 组件实际上不需要关于选择哪个过滤器的信息，因此我们可以将过滤逻辑移到其他位置。

我们只需要在便笺props中给它正确过滤的便笺:

```js
const Notes = (props) => {  const dispatch = useDispatch()

  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {  if ( state.filter === 'ALL' ) {    return {      notes: state.notes    }  }  return {    notes: (state.filter  === 'IMPORTANT'       ? state.notes.filter(note => note.important)      : state.notes.filter(note => !note.important)    )  }}
const ConnectedNotes = connect(mapStateToProps)(Notes)
export default ConnectedNotes  
```

------

### mapDispatchToProps

现在这个组件可以通过它的props调用函数直接调用*toggleImportanceOf* action creator 定义的action:

```js
const Notes = (props) => {
  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}
```

当使用 connect 时，我们可以简单地这样做:

```js
props.toggleImportanceOf(note.id)
```

不需要单独调用 dispatch 函数，因为 connect 已经将 *toggleImportanceOf* action creator 修改为包含 dispatch 的形式。

了解 mapDispatchToProps 的工作原理可能需要一些时间，特别是当我们了解了[使用它的替代方法](https://fullstackopen.com/zh/part6/connect方法#alternative-way-of-using-map-dispatch-to-props)之后。

使用连接产生的结果可以这样想象:

![fullstack content](https://fullstackopen.com/static/fa7e363e012d376ac17d5a8fbc3cae9d/5a190/25b.png)



除了通过*props.notes* 和*props.filter* 访问存储的状态外，该组件还引用了一个函数，该函数可以通过其*toggleimportof* prop 用于分派*TOGGLE IMPORTANCE*-类型操作。

我们也可以使用 connect 来创建新便笺:

```js
import React from 'react'
import { connect } from 'react-redux' 
import { createNote } from '../reducers/noteReducer'

const NewNote = (props) => {  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(  null,   { createNote })(NewNote)
```

由于组件不需要访问存储的状态，我们可以简单地将*null* 作为连接的第一个参数

------

### Alternative way of using mapDispatchToProps

【使用 mapDispatchToProps 的另一种方式】

我们如下面的方式定义了从连接的*NewNote* 组件发送操作的函数:

```js
const NewNote = () => {
  // ...
}

export default connect(
  null,
  { createNote }
)(NewNote)
```

我们可以将下面的*function* 定义作为连接的第二个参数:

```js
const NewNote = (props) => {
  // ...
}

const mapDispatchToProps = dispatch => {  return {    createNote: value => {      dispatch(createNote(value))    },  }}
export default connect(
  null,
  mapDispatchToProps
)(NewNote)
```

在这个替代定义中， mapDispatchToProps是一个函数，它通过将 dispatch-function 作为参数传递给它来调用它。 函数的返回值是一个对象，它定义了一组作为props传递给连接组件的函数。 我们的示例将传递的函数定义为 createNote prop:

```js
value => {
  dispatch(createNote(value))
}
```

它只是分发使用*createNote* action创建器创建的action。





然后，该组件通过其 props.createNote 引用该函数:

```js
const NewNote = (props) => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

这个概念相当复杂，通过文本来描述它是具有挑战性的。 在大多数情况下，使用更简单的*mapDispatchToProps* 就足够了。 然而，在有些情况下，需要更复杂的定义，比如*分派的操作* 需要引用[组件的支持](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931)。

Redux的创建者 Dan Abramov 创建了一个非常棒的教程，叫做 [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) ，你可以在 [Egghead.io](https://egghead.io/courses/Getting-started-with-Redux)上找到这个 。 我向每个人强烈推荐这个教程。 最后四个视频讨论了连接方法，特别是使用它的更“复杂”的方式。

------

### Presentational/Container revisited

【复习表现层/容器】

演示组件:

关心事物的外观。

- 可能包含表示和容器组件，并且通常有一些 DOM 标签和它们自己的样式。

- 经常允许通过建筑物进行隔离。

- 不依赖于应用的其他部分，如 Redux 操作或store。

- 不要说明数据是如何加载或Mutation的。

- 只通过props接收数据和回调。

- 很少有自己的状态(当他们这样做时，是 UI 状态而不是数据)。

- 除非需要状态、生命周期Hook或性能优化，否则被编写为功能组件。

  容器组件:

  - 关心事物的运作方式。

  - 内部可能包含表示和容器组件，但通常没有它们自己的 DOM 标签，除了一些包装的 div，并且从来没有任何样式。

  - 为表示或其他容器组件提供数据和行为。

  - 调用 Redux 操作，并将其作为表示组件的回调提供。

    通常是有状态的，因为它们倾向于作为数据源。

  - 通常使用高阶组件(如 React Redux 中的 connect)生成，而不是手写。

------

### Redux and the component state

【Redux 和组件状态】

我们在这个过程中已经走了很长的路，最后，我们已经到了我们使用 React“ the right way”的地步，意思是 React 只关注于生成视图，应用状态完全独立于 Redux 组件，并传递到 Redux、 Redux 的action和 Redux 的还原器。

那么 useState-hook 呢? 它为组件提供它们自己的状态？ 如果应用正在使用 Redux 或其他外部状态管理解决方案，它是否有任何作用？ 如果应用具有更复杂的形式，那么使用 useState 函数提供的状态实现它们的本地状态可能有益。 当然，可以让 Redux 管理表单的状态，但是，如果表单的状态只在填写表单时有关(例如用于验证) ，那么将状态的管理留给负责表单的组件可能是明智的。

------

概念：

-  Connect 函数接受所谓的[mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapStateToProps-state-ownprops--object)函数作为它的第一个参数。 这个函数可以用来定义基于 Redux 存储状态的*连接组件* 的props。

- Connect 函数的第二个参数可用于定义[mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapDispatchToProps-object--dispatch-ownprops--object) ，它是一组作为props传递给连接组件的 *action creator* 函数。 

- 重构的*Notes* 组件几乎完全集中在渲染便笺上，并且非常接近于所谓的[表示组件](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)。 根据 Dan Abramov 提供的 [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

- Redux的创建者 Dan Abramov 创建了一个非常棒的教程，叫做 [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) ，你可以在 [Egghead.io](https://egghead.io/courses/Getting-started-with-Redux)上找到这个 。 

- 阿布拉莫夫提到了术语[高阶组件](https://reactjs.org/docs/higher-order-components.html)。*Notes* 组件是常规组件的一个例子，而 React-Redux 提供的*connect* 方法是*高阶组件* 的一个例子。 从本质上讲，高阶组件是接受“ regular”组件作为参数的函数，然后返回一个新的“ regular”组件作为其返回值。

  高阶组件(High order components，简称 hoc)是定义可应用于组件的通用功能的一种方法。 这是一个来自函数式编程的概念，非常类似于面向对象编程中的继承。

  Hoc 实际上是[高阶函数](https://en.wikipedia.org/wiki/higher-order_function)(HOF)概念的推广。 Hofs 是接受函数作为参数或返回函数的函数。 实际上我们在整个课程中一直在使用 HOFs，例如，所有用于处理数组如 map、 filter 和 find 的方法都是 HOFs。

- 我们应该一直使用 redux 吗？ 可能不是。 Redux 的开发者 Dan Abramov 在他的文章 [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)中讨论了这个

- 现在，通过使用 React [context](https://reactjs.org/docs/context.html)-api 和[useReducer](https://reactjs.org/docs/hooks-reference.html#useReducer)-hook，不需要 redux 就可以实现类似 redux 的状态管理。

