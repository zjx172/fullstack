登录表单的处理方式与我们第二章所讲的处理方式相同。当前应用状态有*username* 和 *password* 都存储在表单中。表单有事件处理逻辑，与*App*组件的状态保持同步。

**事件处理逻辑也很简单：将一个对象作为参数传递给它们，它们将*target* 字段从对象里解构出来，将它的值保存为状态**

```js
({ target }) => setUsername(target.value)
```

------

*handleLogin* 方法负责发送表单，还没有被实现。

通过*api/login*这个 HTTP POST 请求完成登录。让我们将它解耦到自己的 *services/login.js* 模块中

我们会使用*async/await* 语法而不再使用 promises，代码如下：

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

------

处理登录的方法可以按如下方式实现：

```js
import loginService from './services/login' 

const App = () => {
  // ...
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const handleLogin = async (event) => {
    event.preventDefault()

    try {      const user = await loginService.login({        username, password,      })      setUser(user)      setUsername('')      setPassword('')    } catch (exception) {      setErrorMessage('Wrong credentials')      setTimeout(() => {        setErrorMessage(null)      }, 5000)    }  }

  // ...
}
```

如果登录成功，表单 字段 被清空，并且服务器响应（包括 token 和用户信息）被存储到 应用状态的*user* 字段 。

如果登录失败，或者执行 *loginService.login* 产生了错误，则会通知用户。

总之用户登录成功是不会通知用户的。让我们将应用修改为，只有当用户没有登录时才显示登录表单，即 *user === null* 。只有当用户登录成功后才会显示添加新的 Note，这样 *user* 状态才会包含信息

------

条件渲染：

```js
      {user === null && loginForm()}      {user !== null && noteForm()}
```

虽然看起来有点古怪，但在 React 中十分常见的一个[React trick](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator) ，即按条件渲染表单：

```js
{
  user === null && loginForm()
}
```

------

让我们修复创建新 Note 的代码，来和后台对接好。也就是说把登录成功用户的 token 放到 HTTP 请求的认证头中。

*noteService* 模块修改如下：

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null
const setToken = newToken => {  token = `bearer ${newToken}`}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {    headers: { Authorization: token },  }
  const response = await axios.post(baseUrl, newObject, config)  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl } /${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken }
```

------

### Saving the token to browsers local storage

【将 token 保存到浏览器的本地存储中】

我们仍然需要修改我们的应用，以便当我们进入页面时，应用会检查是否能在本地存储中找到登录用户的详细信息，如果可以，将信息保存到应用的状态中，以及*noteService*中

正确的方式是用一个[effect hook](https://reactjs.org/docs/hooks-effect.html)： 这种机制我们在第2章节 [第2章](https://fullstackopen.com/zh/part2/从服务器获取数据#effect-hooks)分中见到过，当时是用来从服务器中获取所有 Note。

我们可以有多个effect hook，所以我们来创建一个hook 来处理首次登录页面：

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    if (loggedUserJSON) {      const user = JSON.parse(loggedUserJSON)      setUser(user)      noteService.setToken(user.token)    }  }, [])
  // ...
}
```