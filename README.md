```js
import {
  // ...
  useParams} from "react-router-dom"

const Note = ({ notes }) => {
  const id = useParams().id
```

Note 组件接收所有的便笺作为 props *notes*，它可以通过 react-router 的[useParams](https://reacttraining.com/react-router/web/api/hooks/useParams)函数访问 url 参数(要显示的便笺的 id)。

------

### useHistory

导航到*Login*-视图 的选项在菜单中有条件地渲染。

```js
<Router>
  <div>
    <Link style={padding} to="/">home</Link>
    <Link style={padding} to="/notes">notes</Link>
    <Link style={padding} to="/users">users</Link>
    {user      ? <em>{user} logged in</em>      : <Link style={padding} to="/login">login</Link>    }  </div>

  // ...
</Router>
```

处理登录功能的组件代码如下

```js
import {
  // ...
  useHistory} from 'react-router-dom'

const Login = (props) => {
  const history = useHistory()
  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    history.push('/')  }
```

------

### redirect

关于*Users* 路由还有一个有趣的细节:

```js
<Route path="/users" render={() =>
  user ? <Users /> : <Redirect to="/login" />
} />
```

如果用户未登录，则不渲染*Users* 组件。 相反，用户*使用\*Redirect\*组件重定向到登录视图*

------

### Hooks

React 提供了10种不同的内置Hook，其中最受欢迎的是我们已经广泛使用的[useState](https://reactjs.org/docs/hooks-reference.html  https://reactjs.org/docs/hooks-reference.html#useState)和[useEffect](https://reactjs.org/docs/hooks-reference.html#useEffect) Hook。

在[第5章](https://fullstackopen.com/zh/part5/props_children_与_proptypes#references-to-components-with-ref)中，我们使用了[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useImperativeHandle)-hook，它允许组件为其他组件提供其功能。

在过去的一年里，许多 React 库已经开始提供基于 hook 的 api。正如[第6章](https://fullstackopen.com/zh/part6/flux架构与_redux)所讲的。

我们使用 react-redux 库中的[useSelector](https://react-redux.js.org/api/hooks#useSelector)和[useDispatch](https://react-redux.js.org/api/hooks#useDispatch)Hook来共享我们对组件的 redux-store 和 dispatch 函数。 

Redux 的基于Hook的 api 比旧的、仍然可用的[connect](https://fullstackopen.com/zh/part6/connect方法)-api 更易于使用。

我们在[上一章节](https://fullstackopen.com/zh/part7/react_router)中介绍的[React-router](https://reacttraining.com/React-router/web/guides)的 api 也部分基于[hook](https://reacttraining.com/React-router/web/api/hooks)。 它的Hook可以用来访问 url 参数和历史对象，这允许以编程方式操作浏览器的 url。

正如在[第1章](https://fullstackopen.com/zh/part1/深入_react_应用调试#rules-of-hooks)中提到的，Hook不是正常的函数，在使用这些函数时，我们必须遵守某些[规则或限制](https://reactjs.org/docs/hooks-rules.html)。

 让我们回顾一下使用Hook的规则，一字不差地从官方的 React 文档中复制下来:

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function.

**不要在循环、条件或嵌套函数中调用 Hooks。**取而代之的是，始终在 React 函数的顶层使用 Hooks。

**Don’t call Hooks from regular JavaScript functions.** Instead, you can:

**不要从常规的 JavaScript 函数中调用 Hooks**，取而代之的是，你可以:

- Call Hooks from React function components.
- 从 React 函数组件调用Hook。
- Call Hooks from custom Hooks
- 从自定义Hook调用Hook

------

### Custom hooks

【自定义Hook】

React 提供了创建我们自己的[自定义](https://reactjs.org/docs/hooks-custom.html)Hook的选项。 根据 React，自定义Hook的主要目的是促进组件中使用的逻辑的重用。

> 构建自己的 hook 可以让您将组件逻辑提取到可重用的函数中

自定义Hook是常规的 JavaScript 函数，可以使用任何其他Hook，只要它们遵循[hook 的规则](https://fullstackopen.com/zh/part1/深入_react_应用调试#rules-of-hooks)。 此外，自定义Hook的名称必须以单词 use 开头。

让我们将计数器逻辑提取到它自己的自定义Hook中，Hook的代码如下:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}
```

我们的自定义Hook在内部使用 useState Hook来创建自己的状态。 Hook返回一个对象，其属性包括计数器的值以及操作值的函数。

React组件可以使用如下所示的Hook:

```js
const App = (props) => {
  const counter = useCounter()
```



------

### Spread attributes

【展开属性】

正如 React 文档中的[示例](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)所述，如下两种方法为组件传递props可以得到完全相同的结果:

```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

------

工具概念：

- [useHistory](https://reacttraining.com/react-router/web/api/hooks/useHistory 路由)

- [useParams](https://reacttraining.com/react-router/web/api/Hooks/useparams)

- *一种方法是使用 react-router 的*[useRouteMatch](https://reacttraining.com/react-router/web/api/hooks/useRouteMatch)*Hook来计算出应用组件中显示的便笺的 id。*

- ### More about hooks

  【关于Hook更多知识】

  互联网上开始充斥着越来越多关于Hook的有用资料。 如下是值得一查的资料来源:

  - [Awesome React Hooks Resources](https://github.com/rehooks/Awesome-React-Hooks)
  - [Easy to understand React Hook recipes by Gabe Ragland](https://usehooks.com/)
  - [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)

  

