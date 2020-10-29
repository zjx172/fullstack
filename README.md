# 解耦

------

### The components children, aka. props.children

【组件的 children，又叫 props.children】

用于控制登录表单是否可见的代码，应当被视作它自己的逻辑实体，出于这个原因，它最好从 *App* 组件中解耦到自己的组件中。

我们的目标是实现一个新的 *Togglable* 组件，按照如下方式进行使用：

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

*Togglable* 组件的代码如下：

```js
import React, { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

这个新的且比较有趣的代码就是 [props.children](https://reactjs.org/docs/glossary.html#propschildren)， 它用来引用组件的子组件。子组件就是我们想要控制开启和关闭的 React 组件。

这一次，子组件被渲染到了用于渲染组件本身的代码中：

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

并不像之前我们见到的使用的普通属性， *children*被 React 自动添加了，并始终存在，只要这个组件定义了关闭标签 */>*

------

### State of the forms

【表单的状态】

应用的状态当前位于 App 组件中。

React[文档](https://reactjs.org/docs/lifting-state-up.html)阐述了关于在哪里放置状态:

> *Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.*
> 通常，几个组件需要反映相同的变化数据。 我们建议将共享状态提升到它们最接近的共同祖先。

如果我们考虑一下表单的状态，例如一个新便笺的内容在创建之前，App 组件实际上并不需要它做任何事情。

我们也可以将表单的状态移动到相应的组件中。

*newNote* state 属性和负责更改它的事件处理程序已经从 App 组件移动到负责记录表单的组件。

现在只剩下一个props，即 createNote 函数，当创建新便笺时，表单将调用该函数。

既然我们已经摆脱了*newNote* 状态及其事件处理程序，那么 App 组件就变得更简单了。

用于创建新便笺的 addNote 函数接收一个新便笺作为参数，该函数是我们发送到表单的唯一props:

------

### References to components with ref

【引用具有 ref 的组件】

我们当前的实现还不错，但有个地方可以改进

当我们创建了一个新的 Note，我们应当隐藏新建 Note 的表单。当前这个表单会持续可见，但隐藏这个表单有个小问题。**可见性是透过*Togglable* 组件的*visible* 变量来控制的，我们怎么从外部进行访问呢？**

实际上从父组件来关闭这个表单有许多方法，我们来使用 React 的 [ref](https://reactjs.org/docs/refs-and-the-dom.html)机制，它提供了一个组件的引用。

我们把 *App* 组件按如下修改：

```js
import React, { useState, useRef } from 'react'
const App = () => {
  // ...
  const noteFormRef = useRef()
  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

我们同样要修改 *Togglable* 组件：

```js
import React, { useState, useImperativeHandle } from 'react'
const Togglable = React.forwardRef((props, ref) => {  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {    return {      toggleVisibility    }  })
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
export default Togglable
```

> - 创建组件的函数被包裹在了[forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref) 函数调用。利用这种方式可以访问赋给它的引用。
> - 组件利用[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) Hook来将*toggleVisibility* 函数能够被外部组件访问到。
> - 我们现在可以在 Note 创建后，通过调用 *noteFormRef.current.toggleVisibility()* 控制表单的可见性了

我们创建了三个单独的组件，并且都有自己的状态：

![fullstack content](https://fullstackopen.com/static/c7355696281ca0c4d8d1e734a1d81a26/5a190/12e.png)

*ref* 属性用于为变量 togglable1、 togglable2 和 togglable3 中的每个组件分配一个引用。

------

### PropTypes

*Togglable* 组件假定使用者会通过 *buttonLabel* 属性获传递按钮的文本。 如果我们忘记给组件定义:

```js
<Togglable> buttonLabel forgotten... </Togglable>
```

应用会运行正常，但浏览器呈现一个没有 label text 的按钮。

如果我们希望使用 *Togglable* 组件时，强制给按钮一个 label text 属性值。

这个需求可以通过 [prop-types](https://github.com/facebook/prop-types) 包来定义，我们来安装一下：

```bash
npm install prop-types
```

我们可以定义 *buttonLabel* 属性定义为 mandatory，或按如下加入*required* 这种字符串类型的属性：

```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

如果这时属性是 undefined，控制台就会展示如下的错误信息

![fullstack content](https://fullstackopen.com/static/7a239ed6d3ad6721a65ae3ac24eb29b5/5a190/15.png)



虽然应用程序仍然可以工作，没有任何东西强迫我们定义 PropTypes。 但它可以通过控制台飙红来提醒我们，因为不处理红色警告是非常不专业的做法。

让我们给 *LoginForm* 组件同样定义一个 PropTypes。

```js
import PropTypes from 'prop-types'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
    // ...
  }

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
```

如果传递给 prop 的类型是错误的。例如，如果我们尝试定义 *handleSubmit* 成 string，那结果会出现如下警告：

![fullstack content](https://fullstackopen.com/static/ec732518823c5e2921d46285e5549bf3/5a190/16.png)

------

### [ESlint的使用](https://cn.eslint.org/)

在第三章节中我们配置了[ESlint](https://fullstackopen.com/zh/part3/es_lint与代码检查#lint) ，为后台代码控制了代码样式。让我们同样加到前台代码中。

Create-react-app 已经默认为项目安装好了 ESlint， 所以我们需要做的就是定义自己的*.eslintrc.js* 文件

注意: 不要运行 eslint-- init 命令。 它将安装与 create-react-app 创建的配置文件不兼容的最新版本的 ESlint！

下面，我们将开始测试前端，为避免不想要和不相关的 lint 错误，我们先安装[eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) 库：

```bash
npm add --save-dev eslint-plugin-jest
```

让我们为 *.eslintrc.js* 添加如下内容

```js
module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest/globals": true 
  },
  "extends": [ 
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "react", "jest"
  ],
  "rules": {
      "indent": [
          "error",
          2  
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "never"
      ],
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
          "error", "always"
      ],
      "arrow-spacing": [
          "error", { "before": true, "after": true }
      ],
      "no-console": 0,
      "react/prop-types": 0
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

注意： 如果你将 Visual Studio Code 与 ESLint 插件一起使用，你可能需要增加额外的workspace级别的设置才能使其正常工作。如果看到`Failed to load plugin react: Cannot find module 'eslint-plugin-react'`说明需要一些额外的配置，增加`"eslint.workingDirectories": [{ "mode": "auto" }]`到 workspace 的settings.json文件中就运行正常了，具体详见[这里](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807)

让我们创建一个 [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) 添加如下内容：

```bash
node_modules
build
```

现在 *build* 和 *node_modules* 这两个文件夹就不会被 lint 到了

同样让我们为 lint 创建一个 npm 脚本：

```js
{
  // ...
  {
    "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 db.json",
    "eslint": "eslint ."  },
  // ...
}
```

组件 *Togglable* 导致了一些烦人的警告：组件定义缺少显示名:

![fullstack content](https://fullstackopen.com/static/eccfbd107d663e40474efec70eb83ea4/5a190/25ea.png)



React-devtools 还显示组件没有名称:

![fullstack content](https://fullstackopen.com/static/1fc750ed2c0c78b8736615837a6be1a0/5a190/26ea.png)



幸运的是，这个问题很容易解决

```js
import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ...
})

Togglable.displayName = 'Togglable'
export default Togglable
```



------

概念：

- 这个新的且比较有趣的代码就是 [props.children](https://reactjs.org/docs/glossary.html#propschildren)， 它用来引用组件的子组件。子组件就是我们想要控制开启和关闭的 React 组件。
- [useRef](https://reactjs.org/docs/hooks-reference.html#useref) 方法就是用来创建 *noteFormRef* 引用，它被加到了能够控制表单创建的 *Togglable* 组件， *noteFormRef* 变量就代表了组件的引用。
- 总结一下，[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useImperativeHandle)函数是一个 React hook，用于定义组件中的函数，该组件可以从组件外部调用。
- 创建组件的函数被包裹在了[forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref) 函数调用。利用这种方式可以访问赋给它的引用。
-  [prop-types](https://github.com/facebook/prop-types) 
- [ESlint](https://fullstackopen.com/zh/part3/es_lint与代码检查#lint) 

------

错误解决：

[ Unexpected end of JSON input while parsing near '...E-----\r\n"}},"10.3.1'](https://stackoverflow.com/questions/47675478/npm-install-errorunexpected-end-of-json-input-while-parsing-near-nt-webpack)