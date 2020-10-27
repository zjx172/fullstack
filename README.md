代码首先从数据库中根据 request 提供的 *username* 搜索用户。

然后通过检查 request 中的*password*， 由于 password 在数据库中并不是明文存储的，而是存储的通过 password 计算的 Hash 值， *bcrypt.compare* 方法用来检查 password 是否正确。

```js
await bcrypt.compare(body.password, user.passwordHash)
```

如果用户没有找到， 或者是密码错误，request 会被 response 成[401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2)， 失败的原因会被放到 response 的 body 体中。

如果密码正确，通过 *jwt.sign* 方法创建一个 token， 这个 token 包含了数字签名表单中的用户名以及 user id。

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

> 这个 token 通过环境变量中的*SECRET* 作为*密码* 来生成数字化签名。
>
> 这个数字化签名确保只有知道了这个 secret 的组织才能够生成合法的 token
>
> 这个环境变量的值必须放到 *.env*文件中。
>
> 一个成功的请求会返回 *200 OK*的状态码。这个生成的 token 以及用户名放到了返回体中被返回。

***jwt.sign(userForToken, process.env.SECRET)* 方法失败了。因为我们忘记了给环境变量一个 SECRET。它可以是任何 string， 只要我们放到 *.env*（[NPM酷库：dotenv，从文件加载环境变量](https://segmentfault.com/a/1190000012826888)）中，登录就正常了。**

------

##### [webpack 之 process.env.NODE_ENV 详解](https://juejin.im/post/6844903955663683597)

### 如何配置环境变量

下面讲讲如何配置各个环境的环境变量。

#### Windows配置

##### 临时配置

直接在cmd环境配置即可，查看环境变量，添加环境变量，删除环境变量。

```
#node中常用的到的环境变量是NODE_ENV，首先查看是否存在 
set NODE_ENV 
#如果不存在则添加环境变量 
set NODE_ENV=production 
#环境变量追加值 set 变量名=%变量名%;变量内容 
set path=%path%;C:\web;C:\Tools 
#某些时候需要删除环境变量 
set NODE_ENV=
```

------

### Limiting creating new notes to logged in users

【为登录用户限制创建 Note】

让我们更改以下创建新 Note 的逻辑，即只有合法 token 的 request 才能被通过。

有几种方法可以将令牌从浏览器发送到服务器中。我们将使用[Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) 头信息。头信息还包含了使用哪一种[authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) 。如果服务器提供多种认证方式，那么认证 Scheme 就十分必要。这种 Scheme 用来告诉服务器应当如何解析发来的认证信息。

*Bearer* schema 正是我们需要的。

实际上，这意味着假设我们有一个 token 字符串*eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW*, 认证头信息的值则为：

```
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
```



将新建 Note 的代码修改如下：

```js
const jwt = require('jsonwebtoken')
// ...
const getTokenFrom = request => {  const authorization = request.get('authorization')  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {    return authorization.substring(7)  }  return null}
notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)  const decodedToken = jwt.verify(token, process.env.SECRET)  if (!token || !decodedToken.id) {    return response.status(401).json({ error: 'token missing or invalid' })  }  const user = await User.findById(decodedToken.id)
  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```

*getTokenFrom* 这个 辅助函数将 token 与认证头信息相分离。token 的有效性通过 *jwt.verify* 进行检查。这个方法同样解码了 token， 或者返回了一个 token 所基于的对象

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

这个对象通过 token 解码后得到*username* 和 *id* ，用来告诉 server 谁创建了这次 request。

如果没有 token， 或者对象解析后没有获得用户认证 (*decodedToken.id* is undefined)， 错误码[401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) 就会返回，并在 response 的 body 体中包含了失败的原因

```js
if (!token || !decodedToken.id) {
  return response.status(401).json({
    error: 'token missing or invalid'
  })
}
```

当请求的创建者被成功解析，就会继续执行。

使用 Postman 赋值正确的 *authorization* 头信息，即*bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ*， 第二个值是登录操作返回的令牌，新的 Note 就能创建了。







------

概念：

- [基于令牌的认证](https://scotch.io/tutorials/the-ins-and-outs-of-token-based-authentication#toc-how-token-based-works)
- 安装[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 库， 它会允许我们生成 [Json Web Token](https://jwt.io/)。
- [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
- [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes)
- 如果应用有很多接口都需要认证，JWT 认证应当被分拆到它们自己的中间件中。一些现成的类库，如[express-jwt](https://www.npmjs.com/package/express-jwt)可以使用。
- 使用 token 认证的用户名、密码以及应用应当始终在 [HTTPS](https://en.wikipedia.org/wiki/HTTPS)上使用。我们可以使用 Node [HTTPS](https://nodejs.org/api/https.html) 服务器来替换我们的 [HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html)服务器，（HTTPS 需要更多配置）。从另一方面来说，我们应用的生产版本在 Heroku 中，所以我们的应用才能十分安全：Heroku 通过 HTTPS 在浏览器和 Heroku 服务器之间路由了所有的流量

