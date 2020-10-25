------

Node 中的约定是用 *NODE_ENV* 环境变量定义应用的执行模式。 在我们当前的应用中，如果应用不是在生产模式下，我们只加载 *.env* 中定义的环境变量。

通常的做法是为开发和测试定义不同的模式。

我们在使用 nodemon 的 *npm run dev* 脚本中指定了应用的模式为 *development* 。 我们还指定了默认的 npm start 命令将模式定义为*production*。

------

我们在脚本中指定应用模式的方式有一个小问题: 它不能在 Windows 上工作。 我们可以通过如下命令安装[cross-env](https://www.npmjs.com/package/cross-env)作为一个开发依赖包，来纠正这个问题:

```bash
npm install --save-dev cross-env
```

然后，我们可以通过在*package.json* 中定义的 npm 脚本中使用跨平台兼容性的 cross-env 库来实现:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

现在我们可以修改应用在不同模式下运行的方式。 作为示例，我们可以定义应用在运行测试时使用单独的测试数据库。

------

现在我们可以修改应用在不同模式下运行的方式。 作为示例，我们可以定义应用在运行测试时使用单独的测试数据库。

我们可以在 Mongo DB Atlas 中创建单独的测试数据库。 在多人开发同一个应用的情况下，这不是一个最佳解决方案。 特别是测试执行时，通常要求并发运行的测试，因此不能使用单个数据库实例。

最好使用安装并跑在开发人员本地机器上的数据库来运行我们的测试。 最佳的解决方案是让每个测试用例执行时使用自己独立的数据库。 通过[运行内存中的 Mongo](https://docs.mongodb.com/manual/core/inmemory/)或使用[Docker](https://www.docker.com/)容器来实现这个“相对简单”。 我们不会把事情复杂化，而是继续使用 MongoDB Atlas 数据库。

------

让我们在*tests/note_api.test.js*文件中编写第一个测试:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
```

测试从*app.js* 模块导入 Express 应用，并用*supertest* 函数将其包装成一个所谓的[superagent](https://github.com/visionmedia/superagent)对象。 这个对象被分配给*api* 变量，测试可以使用它向后端发出 HTTP 请求。

我们的测试向*api/notes* url 发出 HTTP GET 请求，并验证请求是否用状态码200响应。 测试还验证*Content-Type* 头是否设置为 *application/json*，表明数据是所需的格式。

------

supertest的文档说明如下:

> *if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.*
> 如果服务器还没有监听连接，那么它就会绑定到一个临时端口，因此没有必要跟踪端口。

换句话说，supertest 负责在**内部使用端口启动被测试的应用**。



------



我们的测试已经使用 Jest 的[afterAll](https://facebook.github.io/Jest/docs/en/api.html#afterallfn-timeout)函数在测试执行完成后关闭到数据库的连接。 Jest 提供了许多其他的[函数](https://facebook.github.io/Jest/docs/en/setup-teardown.html#content) ，可以在运行任何测试之前或每次运行测试之前执行一次操作。

让我们在*每个 test* 之前使用[beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout)函数初始化数据库 i:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')const initialNotes = [  {    content: 'HTML is easy',    date: new Date(),    important: false,  },  {    content: 'Browser can execute only Javascript',    date: new Date(),    important: true,  },]beforeEach(async () => {  await Note.deleteMany({})  let noteObject = new Note(initialNotes[0])  await noteObject.save()  noteObject = new Note(initialNotes[1])  await noteObject.save()})// ...
```

在开始时清除数据库，然后将存储在 initialNotes 数组中的两个便笺保存到数据库中。 这样做，我们可以确保在运行每个测试之前，数据库处于相同的状态。

------

下面的命令只运行 *tests/note_api.test.js*文件中的测试:

```js
npm test -- tests/note_api.test.js
```

*-t* 选项可用于运行具有特定名称的测试:

```js
npm test -- -t 'a specific note is within the returned notes'
```

提供的参数可以引用测试或描述块的名称。 参数也可以只包含名称的一部分。 下面的命令将运行名称中包含*notes* 的所有测试:

```js
npm test -- -t 'notes'
```

**注意**: 当运行单个测试时，如果运行的测试没有使用该连接，则 mongoose 连接可能保持打开状态。

这个问题可能是因为 supertest 为连接优先，但是 jest 并不运行代码的 afterAll 部分。

------

人们开始怀疑，是否有可能重构代码以从方法中消除*catch*？

[express-async-errors](https://github.com/davidbanham/express-async-errors)库为此提供了一个解决方案。

我们来安装这个库吧

```bash
npm install express-async-errors
```

使用这个库很容易。

在*app.js* 中引入库:

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors')const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```

这个库的“魔法”是允许我们完全消除 try-catch 块。

例如，删除便笺的路由

可以变成

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

------

问题在于 **forEach 循环的每次迭代都会生成自己的异步操作**，而 beforeEach 不会等待它们完成执行。 换句话说，在 forEach 循环中定义的 await 命令不在 beforeEach 函数中，而是在 beforeEach 不会等待的独立函数中。



 换句话说，它是将每个项保存到数据库的Promise数组。

[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 方法可以用于将一个promises 数组转换为一个单一的promise，一旦数组中的每个promise作为参数被解析传递给它，它就会被实现。 最后一行代码 *await Promise.all(promiseArray)* 会等待着每个保存便笺的承诺都完成，这意味着数据库已经初始化。

> 当使用 Promise.all 方法时，仍然可以访问数组中每个promise的返回值。 如果我们使用 *await* 语法 *const results = await Promise.all(promiseArray)* 等待Promises被解析，操作将返回一个数组，该数组包含在 promiseArray 中的每个promise的解析值，并且它们与数组中的promise以相同的顺序出现。

Promise.all 并行执行它所收到的promises。 



如果promise需要按照特定顺序执行，这将是个问题。 在这样的情况下，操作可以在一个[for... of](https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/for...of)块中执行，这样保证一个特定的执行顺序。

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```





------

工具：

- [单元测试](https://en.wikipedia.org/wiki/Unit_testing)
- [mongo-mock](https://github.com/williamkapke/mongo-mock)
- [runInBand](https://jestjs.io/docs/en/cli.html#--runinband)
- [cross-env](https://www.npmjs.com/package/cross-env)
-  通过[运行内存中的 Mongo](https://docs.mongodb.com/manual/core/inmemory/)或使用[Docker](https://www.docker.com/)容器来实现这个“相对简单”。
- 我们实现的配置模块有点类似于[node-config](https://github.com/lorenwest/node-config)包。 
- 让我们使用[supertest](https://github.com/visionmedia/supertest)包来帮助我们编写 API 的测试。
- 让我们按照[指示](https://mongoosejs.com/docs/jest.html) ，在项目的根目录添加一个*jest.config.js* 文件
- 我们的测试使用 Jest 的[expect](https://facebook.github.io/Jest/docs/en/expect.html#content)方法验证响应数据的格式和内容。
- 我们的测试已经使用 Jest 的[afterAll](https://facebook.github.io/Jest/docs/en/api.html#afterallfn-timeout)函数在测试执行完成后关闭到数据库的连接。 Jest 提供了许多其他的[函数](https://facebook.github.io/Jest/docs/en/setup-teardown.html#content) ，可以在运行任何测试之前或每次运行测试之前执行一次操作。
- 让我们在*每个 test* 之前使用[beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout)函数初始化数据库 i:
- 通过[链式 Promise](https://javascript.info/promise-chaining) 可以一定程度上让这种熵增变得可控。并且通过 *then* 方法的链式调用来避免回调地狱。我们在这门课中已经见到了一些这种场景。
- [Callback Hell](http://callbackhell.com/)
- [Testing Mongoose with Jest](https://mongoosejs.com/docs/jest.html)
- [Iterating Generators Asynchronously](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously)
- [express-async-errors](https://github.com/davidbanham/express-async-errors)库为此提供了一个解决方案。库会处理一切事务。 如果在*async* 路由中发生异常，执行将自动传递到错误处理中间件。
- 当代码被重构时，总是有[regression](https://en.wikipedia.org/wiki/Regression_testing)的风险，这意味着现有的功能可能会中断。