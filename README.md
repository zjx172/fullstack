如果我们用关系型数据库来实现会显得比较直白。每个资源都会有独立的数据库表，而创建 便笺 的 用户 ID 会作为 便笺 的外键进行存储。

但如果我们使用文档数据库，就会有一些不同，体现在实现这种模型会有多种不同的方式。

与所有的文档数据库一样，我们可以使用 Mongo 的对象 id 来引用存储其他 collection 中的文档。这有点像关系型数据库的外键。

------

### References across collections

【跨 collection 引用】

如果我们使用关系型数据库，Note 会包含一个*外键*来指向创建它的 User。在文档数据库中，我们也可以这么做。

```js
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})
```

让我们展开 *model/note.js* 文件中 note 的 schema，让 note 包含其创建者的信息。

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {    type: mongoose.Schema.Types.ObjectId,    ref: 'User'  }})
```

与关系型数据库形成鲜明对比，引用被同时存储在了两个 document 中。 Note 引用了创建它的 User， User 引用了它所创建的 Note 的数组。

------

### Populate

我们希望我们的 API 以这样的方式工作，即当一个 HTTP GET 请求到*/api/users* 路由时，User 对象同样包含其创建 Note 的内容，而不仅仅是 Note 的 id。 在关系型数据库中，这个功能需求可以通过 *join query* 实现。

```js
usersRouter.get('/', async (request, response) => {
  const users = await User    .find({}).populate('notes')
  response.json(users)
})
```

让我们增加一组合适的 User 信息到 Note 中：

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
});
```

Mongoose 中*populate* 方法的功能是基于这样一个事实，即我们已经用 ref 选项为 Mongoose Schema 中的引用定义了类型：

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

------

工具概念：

- 传统的文档数据库，例如 Mongo 是不支持*join queries*的，但这在关系型数据库却很常见，用来聚合不同表中的数据。但从 Mongo 的 3.2 版本开始，它开始支持[lookup aggregation queries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/)。
- [单向 Hash 函数](https://en.wikipedia.org/wiki/Cryptographic_hash_function)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [存储密码](https://codahale.com/how-to-safely-store-a-password/) 的基本原理超出了本课程的范围。我们也不会讨论赋值给[saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds) 的魔法值 10 代表什么，但你可以在相关文章中找到它。、
- 我们实际上是在实践[测试驱动开发 TDD](https://en.wikipedia.org/wiki/Test-driven_development),也就是在函数实现之前先写测试用例。
- Mongoose 并没有内置的 validator 来检查某个字段的唯一性。我们可以使用一个现成的解决方案[mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) 这个 npm 包
- [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7)的 *part4-7* 分支中找到当前应用的代码
- Mongoose 的 join 是通过[populate](http://mongoosejs.com/docs/populate.html) 方法完成的。