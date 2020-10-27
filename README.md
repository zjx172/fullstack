

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
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

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify



















### props: passing data to components

【props：向组件传递数据】

使用所谓的[props](https://reactjs.org/docs/components-and-props.html)，可以将数据传递给组件。

让我们按照如下方式修改组件*Hello*

```js
const Hello = (props) => {  return (
    <div>
      <p>Hello {props.name}</p>    </div>
  )
}
```

现在定义组件的函数有一个参数*props*。 作为参数，它接收了一个对象，该对象具有组件中所定义的、用于定义user的所有“属性”所对应的字段。

props 按如下定义:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="George" />      <Hello name="Daisy" />    </div>
  )
}
```

可以有任意数量的props ，它们的值可以是“硬编码的”字符串，也可以是 JavaScript 表达式的结果。 如果props的值是通过 JavaScript 表达式实现的，那么它必须用花括号括起来。



可以有任意数量的props ，它们的值可以是“硬编码的”字符串，也可以是 JavaScript 表达式的结果。 如果props的值是通过 JavaScript 表达式实现的，那么它必须用花括号括起来。

让我们修改一下代码，使组件*Hello* 使用两个props:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'  const age = 10
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />      <Hello name={name} age={age} />    </div>
  )
}
```

上面*App* 组件传递的props有变量的值、求和表达式的计算结果和一个常规字符串。







但使用根元素并也不是唯一可行的选择，通过创建组件*数组* 也是一个有效的解决方案:

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name="Maya" age={26 + 10} />,
    <Footer />
  ]
}
```

但是，在定义应用的根组件时，数组这种方案并不明智，而且会使代码看起来有点难看。

由于根元素是必须的，所以在 Dom 树中会有“额外的” div 元素。 *这可以通过使用*[*fragments*](https://reactjs.org/docs/fragments.html#short-syntax)*来避免，即用一个空元素来包装组件的返回内容:*

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

现在它已经成功地编译了，React 生成的 DOM 不再包含额外的 div-元素了。







【JavaScript 教材】

互联网上的 JavaScript 指南既有好的，也有不好的。 这个页面上大多数与 JavaScript 特性相关的链接都参考了 Mozilla 的 JavaScript 指南[Mozilla's JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)。

强烈建议你立即在 Mozillas 网站上阅读[重新认识JavaScript(JS 教程)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

如果你想深入了解 JavaScript，互联网上有一个很棒的免费书系列叫做[You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)。

[egghead.io](https://egghead.io/) 上有大量关于 JavaScript、 React 及其他有趣议题的高质量短视频。不幸的是，有些材料是付费后才能看的。







怎么回事？事件处理程序应该是一个*函数* 或一个*函数引用*，当我们编写时

```js
<button onClick={setCounter(counter + 1)}>
```

**事件处理器实际上被定义成了一个*函数调用***。 在很多情况下这是可行的，但在这种特殊情况下就不行了。 一开始*counter* 变量的值是0。 当 React 第一次渲染时，它执行函数调用*setCounter(0+1)*，并将组件状态的值更改为1。

这将导致组件重新渲染，**react 将再次执行 setCounter 函数调用，并且状态将发生变化，从而导致另一个重新运行...**







一些读者可能想知道为什么我们不直接更新状态，像这样:

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

这个应用似乎可以工作。 但是，这违反了React 中状态不可直接修改的原则，因为它会导致意想不到的副作用。 必须始终通过将状态设置为新对象来更改状态。 如果之前的状态没有变化，属性仅仅需要简单地复制，就是通过将这些属性复制到新的对象中，并将其设置为新状态。

对于这个特定的应用来说，将所有状态存储在单个状态对象中是一个糟糕的选择; 没有明显的好处，还会导致产生的应用要复杂得多。 在这种情况下，将点击计数器存储到单独的状态块中是一个更合适的选择。



当单击*left* 按钮时，我们将字母 *L* 添加到 allClicks 数组中:

```js
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

存储在 allClicks 中的状态块现在被设置为一个数组，*该数组包含前一个状态数组的所有项以及字母* **L***。 向数组中添加新元素是通过*[*concat*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)*方法完成的，该方法不改变现有数组，而是返回数组* **新副本***，并将元素添加到该数组中。*



将日志记录到控制台绝不是调试应用的唯一方法。 你可以在 Chrome 开发者控制台的*debugger* 中暂停应用代码的执行，只需在代码中的任何地方写入命令[debugger](https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/debugger)即可。





### Rules of Hooks

【Hook的规则】

为了确保应用正确地使用基于Hook的状态函数，我们必须遵循一些限制和规则。

不能从循环、条件表达式或任何不是定义组件的函数的地方调用 *useState* （同样的还有 *useEffect* 函数，将在后面的课程中介绍）。 这样做是为了确保Hook总是以相同的顺序调用，如果不是这样，应用的行为就会不规则。

回顾一下，hook 只能从定义 React component 的函数体内部调用:

```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

```JavaScript
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

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}

```

两种方式







### Useful Reading

【有用的阅读材料】

互联网上充满了React相关的材料。 然而，我们使用了这样一种新的React方式，以至于网上发现的绝大多数材料对我们的目的来说都已经过时了。

你可在如下链接中找到有用的资料:

- React[官方文档](https://reactjs.org/docs/hello-world.html)在某种程度上值得一读，尽管其中大部分只有在课程后期才会变得有意义。 此外，所有与类组件相关的内容都与我们无关。

- 一些关于[Egghead.io](https://egghead.io/)的课程，如[开始学习React](https://egghead.io/courses/Start-learning-React) ，质量很高，稍新一点的[初学者React指南](https://egghead.io/courses/The-Beginner-s-guide-to-reactjs)也相对不错; 这两门课程都介绍了一些概念，这些概念也将在本课程后面介绍。 然而，这两门课程都使用了 Class 组件，而不是本课程中使用的新的函数式组件。



使用数组的 [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) 方法添加新便笺到便笺列表中，如 [第1章](https://fullstackopen.com/zh/part1/javascript#arrays) 讲的那样:

```js
setNotes(notes.concat(noteObject))
```

该方法不会改变原始的 *notes* 状态数组，而是会创建数组的一个新副本，并将新项添加到尾部。 这很重要，因为我们绝不能在React中[直接改变状态](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly) ！





------



------

让我们使用一个在开发过程中使用的工具，称为[JSON 服务器](https://github.com/typicode/JSON-Server 服务器) ，作为我们的服务器。

在项目的根目录中创建一个名为*db.json* 的文件，其内容如下:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "date": "2019-05-30T17:30:31.098Z",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "date": "2019-05-30T18:39:34.091Z",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "date": "2019-05-30T19:20:14.298Z",
      "important": true
    }
  ]
}
```

您可以使用命令 *npm install -g json-server*在您的机器上[安装](https://github.com/typicode/json-server#getting-started) JSON 服务器。 global 安装需要管理员权限，这意味着它不可能在教学电脑或新生的笔记本电脑上安装。

但是，全局安装不是必须的。因为我们可以在应用的根目录使用 npx 命令运行*json-server*:

```js
npx json-server --port 3001 --watch db.json
```

默认情况下，*json-server*在端口3000上启动; 但是由于 create-react-app 项目设置了3000端口，因此我们必须为 json-server 定义一个备用端口，比如端口3001。

让我们在浏览器中输入地址 http://localhost:3001/notes。 我们可以看到*JSON-server* 以 JSON 格式提供了我们之前写到文件的便笺:









https://zh-hans.reactjs.org/docs/hooks-effect.html

https://reactjs.org/docs/hooks-state.html

### **[useEffect](https://zh-hans.reactjs.org/docs/hooks-effect.html)**

最后，让我们来整体看一下 effect hook :

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

让我们用不同的方式重写一下代码。

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```





```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```

现在我们可以更清楚地看到函数 [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) 实际上需要*两个参数* 。第一个是函数本身。 根据文档描述:

> *By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.* 默认情况下，effects 在每次渲染完成后运行，但是你可以选择只在某些值发生变化时才调用。

因此，默认情况下，effect是*总是* 在组件渲染之后才运行。 然而，在我们的例子中，我们只想在第一次渲染的时候执行这个效果。

*useEffect*的第二个参数用于[指定effect运行的频率](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)。 如果第二个参数是一个空数组 *[]*，那么这个effect只在组件的第一次渲染时运行。



使用[对象展开object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)语法创建新对象的代码

可能看起来有点奇怪:

```js
const changedNote = { ...note, important: !note.important }
```

实际上， *{ ...note }* 创建一个新对象，其中包含来自 note 对象的所有属性的副本。 当我们在 spreaded 对象后面的花括号中添加属性时，例如*{ ...note, important: true }*，那么新对象的重要性属性的值将为 true。 在我们的示例中，*important* 属性在原始对象中取其先前值的反值。





```js
axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id !== id ? note : response.data))
})
```

这是通过 *map*方法实现的:

```js
notes.map(note => note.id !== id ? note : response.data)
```

*Map 方法通过将旧数组中的每个项映射到新数组中的一个项来创建一个新数组。* *在我们的示例中，新数组被有条件地创建，即如果***note.id !== id***为true，我们只需将项从旧数组复制到新数组中。 如果条件为 false，则将服务器返回的 note 对象添加到数组中。*



内联样式有一定的限制，例如，所谓的[pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)不能直接使用。







### nodemon

如果我们对应用的代码进行更改，我们必须重新启动应用以查看更改。 我们通过键入 *⌃+C* 首先关闭应用，然后重新启动应用。 与 React 中方便的工作流程相比，Node就有点麻烦，在 React 中，浏览器会在进行更改后自动重新加载。

解决这个问题的方法是使用[nodemon](https://github.com/remy/nodemon) :

> nodemon 将监视启动 nodemon 的目录中的文件，如果任何文件发生更改，nodemon 将自动重启节点应用。

让我们通过下面的命令将 nodemon 定义为*开发依赖development dependency*:

```bash
npm install --save-dev nodemon
```







一个约定是结合resource 类型名称和resource的唯一标识符来创建resource唯一的地址。

假设我们的服务的根 URL 是 *www.example.com/api* 。

如果我们将便笺的资源类型定义为*note*，那么标识为10的便笺资源的地址就是唯一的地址*www.example.com/api/notes/10*。

所有便笺资源的整个集合的 URL 是 *www.example.com/api/notes* 。

我们可以对资源执行不同的操作。要执行的操作由 HTTP*动词verb* 定义:

| URL      | verb   | functionality                                                |
| :------- | :----- | :----------------------------------------------------------- |
| notes/10 | GET    | fetches a single resource                                    |
| notes    | GET    | fetches all resources in the collection                      |
| notes    | POST   | creates a new resource based on the request data             |
| notes/10 | DELETE | removes the identified resource                              |
| notes/10 | PUT    | replaces the entire identified resource with the request data |
| notes/10 | PATCH  | replaces a part of the identified resource with the request data |
|          |        |                                                              |

这就是我们如何粗略地定义 REST 所指的 [统一接口 uniform interface](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints) ，这意味着一种一致的定义接口的方式，使系统能够进行合作。

这种解释 REST 的方式在 Richardson Maturity Model 属于[RESTful 成熟度的第二个层次](https://martinfowler.com/articles/richardsonmaturitymodel.html)。 根据 Roy Fielding 提供的定义，我们实际上并没有定义一个[REST API](http://roy.gbiv.com/untangled/2008/REST-apis-must-be-hypertext-driven)。 事实上，世界上大多数所谓的“REST” API都不符合 Fielding 在其论文中概述的原始标准。

在某些地方(例如[Richardson，Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) ，你会看到我们为一个简单的[CRUD](https://en.wikipedia.org/wiki/create,_read,_update_and_delete) API 建立的模型，这被称为[面向资源架构resource oriented architecture](https://en.wikipedia.org/wiki/resource-oriented_architecture)的例子，而不是 REST。 我们将避免陷入语义学的争论，而是回到应用的工作中。





如果我们搜索一个 id 不存在的便笺，服务器会响应:

![fullstack content](https://fullstackopen.com/static/71dba69685a59c3d5249303257863366/5a190/10ea.png)



返回的 HTTP状态码还是200，这意味着响应成功了。 *content-length* 标头的值为0，因为没有将数据与响应一起发送回来，可以从浏览器验证这一点。

出现此行为的原因是，如果没有找到匹配的便笺，则将note变量设置为了*undefined*。 需要在服务器上以更好的方式处理这种情况。 如果没有发现任何提示，服务器应该用状态码[404 not found](https://www.w3.org/protocols/rfc2616/rfc2616-sec10.html#sec10.4.5)响应，而不是200。



更改应用在*index.js* 文件底部使用的端口定义，如下所示:

```js
const PORT = process.env.PORT || 3001app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

现在我们使用定义在[环境变量](https://en.wikipedia.org/wiki/environment_variable)的端口，如果环境变量 *PORT* 是未定义的，则使用端口3001。











### Serving static files from the backend

【从后端服务部署静态文件】

部署前端的一个选择是将生产构建( *build* 目录)复制到后端仓库的根目录，并配置后端以显示前端的 *main page* (文件 *build/index.html*)作为其主页。

我们从将前端的生产构建复制到后端的根目录。 使用一台Mac 或 Linux 计算机，可以通过命令从前端目录进行复制



为了让 express 显示 *static content*、 页面 *index.html* 和它用来fetch的 JavaScript 等等，我们需要一个来自 express 的内置中间件，称为[static](http://expressjs.com/en/starter/static-files.html)。

当我们在中间件声明中添加如下内容时

```js
app.use(express.static('build'))
```

每当 express 收到一个 HTTP GET 请求时，它都会首先检查*build* 目录是否包含与请求地址对应的文件。 如果找到正确的文件，express 将返回该文件。

现在 HTTP GET 向地址*www.serversaddress.com/index.html*或 *www.serversaddress.com* 的GET请求，将显示 React 前端。 Get 请求到地址 www.serversaddress.com/notes 将由后端代码处理。

因为在我们的情况下，前端和后端都在同一个地址，所以我们可以声明 baseUrl 为[relative](https://www.w3.org/tr/wd-html40-970917/htmlweb.html#h-5.1.2) URL。 这意味着我们可以省略声明服务器的部分。

```js
import axios from 'axios'
const baseUrl = '/api/notes'
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

更改之后，我们必须创建一个新的生产构建，并将其复制到后端存储库的根。

该应用现在可以从*后端* 地址 [http://localhost:3001](http://localhost:3001/) 中使用:

![fullstack content](https://fullstackopen.com/static/f5d8aad803a0a13ea9b29fd705774ec8/5a190/28e.png)



我们的应用现在的工作方式与我们在第0章节中研究的[单页应用](https://fullstackopen.com/zh/part0/web_应用的基础设施#single-page-app) 示例应用完全一样。

当我们使用浏览器访问地址 [http://localhost:3001](http://localhost:3001/) 时，服务器从*build* 仓库返回*index. html* 文件。 档案的摘要内容如下:

```html
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```

该文件包含一些指令，用于获取定义应用样式的 CSS 样式表，以及两个*script* 标签，这些标记说明浏览器获取应用的 JavaScript 代码——即实际的 React 应用。

React代码从服务器地址 http://localhost:3001/api/notes 获取便笺，并将它们渲染到屏幕上。 服务器和浏览器之间的通信可以在开发控制台的*Network* 选项卡中看到:





确保应用的生产版本在本地正常工作之后，将前端的生产构建提交到后端存储库，并将代码再次推送到 Heroku。







### Streamlining deploying of the frontend

【流程化前端部署】

为了在没有额外手工工作的情况下创建前端的新的生产构建，我们在后端存储库的*package.json* 中添加一些 npm-scripts:

```json
{
  "scripts": {
     //...
    "build:ui": "rm -rf build && cd ../../osa2/materiaali/notes-new && npm run build --prod && cp -r build ../../../osa3/notes-backend/",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  }
}
```

脚本 *npm run build:ui*用于构建前端，并在后端存储库下复制生产版本。*npm run deploy* 会将当前的后端版本发布到heroku.

*npm run deploy:full* 会将这两者结合起来，并包含更新后端存储库所需的*git* 命令。

还有一个脚本 *npm run logs:prod* 用于显示 heroku 日志。

注意，我构建的脚本中的目录路径 *build:ui* 依赖于文件系统中存储库的位置。

> **注意** 在Windows中，npm 脚本默认是运行在cmd.exe 这个默认的shell中的，而它并不支持bash命令。因此如果希望以上的bash命令运转良好，你可以将默认的shell换成bash（默认Windows安装Git时已经安装了Bash）：



### Proxy

【代理】

前端上的更改导致它不能再在开发模式下工作(当使用命令 npm start 启动时) ，因为到后端的连接无法工作。

![fullstack content](https://fullstackopen.com/static/19026b5379d1feef11ecc20ca2f669a9/5a190/32ea.png)



这是由于将后端地址更改为了一个相对 URL:

```js
const baseUrl = '/api/notes'
```

因为在开发模式下，前端位于地址*localhost: 3000*，所以对后端的请求会发送到错误的地址*localhost:3000/api/notes*。 而后端位于*localhost: 3001*。

如果这个项目是用 create-react-app 创建的，那么这个问题很容易解决。 将如下声明添加到前端仓库的*package.json* 文件中就足够了。

```bash
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"}
```

在重新启动之后，React 开发环境将作为一个[代理](https://create-react-app.dev/docs/proxying-api-requests-in-development/)工作。 如果 React 代码对服务器地址*[http://localhost:3000](http://localhost:3000/)*发出了一个 HTTP 请求，而不是 React 应用本身管理的地址(即当请求不是为了获取应用的 CSS 或 JavaScript) ，那么该请求将被重定向到 *HTTP://localhost:3001* 的服务器。

现在前端也工作良好，可以在开发和生产模式下与服务器一起工作。

我们方法的一个劣势，是前端部署的复杂程度。 部署新版本需要生成新的前端生产构建并将其复制到后端存储库。 这使得创建一个自动化的[部署管道](https://martinfowler.com/bliki/DeploymentPipeline.html)变得更加困难。 部署管道是指通过不同的测试和质量检查将代码从开发人员的计算机转移到生产环境的自动化控制的方法。

有多种方法可以实现这一点(例如将后端和前端代码[放到同一仓库中](https://github.com/mars/heroku-cra-node)) ，但我们现在不讨论这些。

在某些情况下，将前端代码部署为它自己的应用可能是合理的。 通过create-react-app 创建的应用是[简单的](https://github.com/mars/create-react-app-buildpack)。

后端的当前代码可以在分支*part3-3* 中的[Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3)上找到。 前端代码的更改位于 [前端仓库frontend repository](https://github.com/fullstack-hy2020/part2-notes/tree/part3-1)的*part3-1* 分支。



连接数据库

### Schema

在建立到数据库的连接之后，**我们为一个便笺定义[模式schema](http://mongoosejs.com/docs/guide.html)和匹配的[模型](http://mongoosejs.com/docs/models.html)** :

```js
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

首先，我们定义了存储在 noteSchema 变量中的便笺的[模式](http://mongoosejs.com/docs/guide.html)。 

模式告诉 **Mongoose 如何将 note 对象存储在数据库中**。

> 在 Note 模型定义中，第一个 *"Note"*参数是模型的单数名。 集合的名称将是小写的复数 *notes*，因为[Mongoose 约定](http://mongoosejs.com/docs/models.html)是当模式以单数(例如*Note*)引用集合时自动将其命名为复数(例如*notes*)。
>
> 像 Mongo 这样的文档数据库是*schemaaless*，这意味着数据库本身并不关心存储在数据库中的数据的结构。 可以在同一集合中存储具有完全不同字段的文档。

> Mongoose 背后的思想是，存储在数据库中的数据在*application* 级别上被赋予一个*schema* ，该模式定义了存储在任何给定集合中的文档的形状。

### Creating and saving objects

【创建和保存对象】

接下来，应用在*Note* [model](http://mongoosejs.com/docs/models.html)的帮助下创建一个新的 Note 对象:

```js
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})
```

*模型是所谓的***构造函数constructor function***，它根据提供的参数创建新的 JavaScript 对象。* 

由于对象是使用模型的构造函数创建的，因此它们具有模型的所有属性，其中包括将对象保存到数据库的方法。



> 将对象保存到数据库是通过恰当命名的 save 方法实现的，可以通过 then 方法提供一个事件处理程序:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

> 当对象保存到数据库时，将调用提供给该对象的事件处理。 事件处理程序使用命令代码 `mongoose.connection.close()`关闭数据库连接。 
>
> 如果连接没有关闭，程序将永远不能完成它的执行。

保存操作的结果存在事件处理程序的结果参数中。 当我们将一个对象存储到数据库时，结果并不那么有趣。 如果希望在实现应用或调试过程中仔细查看对象，可以将该对象打印到控制台。

我们还可以通过修改代码中的数据和再次执行程序来保存更多的便笺。

遗憾的是 Mongoose 文档并不是非常一致，在其示例中使用了回调函数，而在其其他章节又使用了不同的方式，因此不建议直接从那里复制粘贴代码。 **不建议在同一代码中将承诺与老式的回调混合使用。**

### Fetching objects from the database

> 【从数据库中获取对象】

让我们注释掉生成新便笺的代码，并用如下代码替换它:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

当代码执行时，程序会输出存储在数据库中的所有便笺:

![fullstack content](https://fullstackopen.com/static/a6fd392c94d0102772d9412d0ce8f3f4/5a190/70ea.png)



这些对象是通过 Note 模型的[find](https://mongoosejs.com/docs/api.html#model_model.find)方法从数据库中检索的。 该方法的参数是表示搜索条件的对象。 因为参数是一个空的对象`{}`，所以我们得到了存储在 notes 集合中的所有便笺。

搜索条件遵循 Mongo 搜索查询[语法](https://docs.mongodb.com/manual/reference/operator/)。

我们可以限制我们的搜索，只包括重要的便笺，如下所示:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```



如果便笺没有*content* 属性，我们将使用状态码*400 bad request* 响应该请求。

在数据存储到数据库之前验证数据格式的一个更聪明的方法是使用 Mongoose 提供的[validation](https://mongoosejs.com/docs/validation.html)功能。

我们可以为模式中的每个字段定义特定的验证规则:

```js
const noteSchema = new mongoose.Schema({
  content: {    type: String,    minlength: 5,    required: true  },  date: {     type: Date,    required: true  },  important: Boolean
})
```

现在要求*content* 字段至少有五个字符长。*date* 字段被设置为必需的，这意味着它不能丢失。 同样的约束也适用于*content* 字段，因为最小长度限制允许字段为空。 我们没有向*important* 字段添加任何约束，因此模式中的定义没有更改。

***minlength* 和 *required* 验证器是[内置的](https://mongoosejs.com/docs/validation.html#built-in-validators) ，由 Mongoose 提供。 Mongoose允许我们创建新的验证器[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)，如果没有一个内置的验证器满足我们的需求的话。**











## 示例

在我们的 [fetch json 示例](https://github.com/mdn/fetch-examples/tree/master/fetch-json) 中(运行 [fetch json live](http://mdn.github.io/fetch-examples/fetch-json/)), 我们使用 [`Request.Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request) 构造函数创建一个新的请求, 然后使用它来获取一个 `.json` 文件。当获取成功时，我们使用 `json()` 读取并解析数据，然后像预期的那样从结果对象中读取值，并将其插入到列表项中以显示我们的产品数据。

```js
const myList = document.querySelector('ul');
const myRequest = new Request('products.json');

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    for (const product of data.products) {
      let listItem = document.createElement('li');
      listItem.appendChild(
        document.createElement('strong')
      ).textContent = product.Name;
      listItem.append(
        ` can be found in ${
          product.Location
        }. Cost: `
      );
      listItem.appendChild(
        document.createElement('strong')
      ).textContent = `£${product.Price}`;
      myList.appendChild(listItem);
    }
  });
```







*路由处理程序也被移动到一个专用的模块中。 路由的事件处理程序通常称为***controllers***，出于这个原因，我们创建了一个新的***controllers** *目录。 所有与便笺相关的路由现在都在***controllers** *目录下的***notes.js** *模块中定义。*

*A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.*
路由对象是中间件和路由的单例。 您可以把它看作是一个“迷你应用” ，只能执行中间件和路由功能。 每个 Express 应用都有一个内置的应用路由。

下面的*app.js* 是一个创建实际应用的文件，对路由对象使用use方法，按如下方式使用:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

如果请求的 URL 以 */api/notes*开头，则会使用之前定义的路由。 由于这个原因，notesRouter 对象必须只定义路由的相对部分，即空路径*/*或仅仅定义参数*/:id*。【TODO】

