*Webpack-dev-server*

*当前的配置使得开发我们的应用成为可能，但是工作流非常糟糕(以至于它类似于 Java 的开发工作流)。 每次我们对代码进行修改时，我们必须将它捆绑起来并刷新浏览器以测试代码。*

[webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) *为我们的问题提供了一个解决方案:*

```js
npm install --save-dev webpack-dev-server
```

*让我们定义一个 npm 脚本来启动 dev-server:*

```js
{
  // ...
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack serve --mode=development"  },
  // ...
}
```

*我们还可以在**webpack.config.js* *文件的配置对象中添加一个新的**devServer* *属性:*

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  devServer: {    、contentBase: path.resolve(__dirname, 'build'),    compress: true,    port: 3000,  },  // ...
};
```

------

### Minifying the code

*【压缩代码】在将应用部署到生产环境时，我们使用的是 webpack 生成的\*main.js\* 代码包。 Js 文件的大小为974473字节，尽管我们的应用只包含几行我们自己的代码。 文件大小较大是因为 bundle 还包含整个 React 库的源代码。 捆绑代码的大小很重要，因为浏览器必须在第一次使用应用时加载代码。 对于高速互联网连接，974473字节不是问题，但是如果我们继续增加更多的外部依赖，加载速度可能会成为一个问题，特别是对于移动用户。如果我们检查 bundle 文件的内容，我们注意到通过删除所有便笺，可以在文件大小方面大大优化它。 手动优化这些文件是没有意义的，因为有许多现有的工具可以完成这项工作。Javascript 文件的优化过程被称为\*minification\*，用于此目的的主要工具之一是[UglifyJS](http://lisperator.net/UglifyJS/)。*

------

*后端服务器的地址目前在应用代码中是硬编码的。 当代码为生产打包时，我们如何以受控的方式更改地址以指向生产后端服务器？*

------

# 各种各样的Class components

 在构造函数中初始化状态:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {      anecdotes: [],      current: 0    }  }

  render() {
    if (this.state.anecdotes.length === 0 ) {      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>
          {this.state.anecdotes[this.state.current].content}        </div>
        <button>next</button>
      </div>
    )
  }
}
```

组件状态位于实例变量的 this.state 中。 状态是具有两个属性的对象。*this.state.anecdotes* 是八卦列表，*this.state.current* 是当前显示八卦的索引。

在 函数化组件中，从服务器中获取数据的正确位置是在[effect hook](https://reactjs.org/docs/hooks-effect.html)中，当一个组件渲染时执行，或者在必要的情况下降低频率，例如只在与第一次渲染结合时执行。

类组件的[生命周期方法](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-Class)提供了相应的功能。 触发从服务器获取数据的正确位置在 声明周期方法 [componentDidMount](https://reactjs.org/docs/react-component.html#componentDidMount)中，该方法在组件第一次渲染之后执行一次:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {    axios.get('http://localhost:3001/anecdotes').then(response => {      this.setState({ anecdotes: response.data })    })  }
  // ...
}
```

------

差异是微小的。 函数式组件和类组件最大的区别在于，类组件的状态是一个单独的对象，并且使用 setState 方法更新状态，而在函数式组件中，状态可以由多个不同的变量组成，所有这些变量都有自己的更新函数。

在一些更高级的用例中，与类组件的生命周期方法相比，effect hook 提供了更好的控制副作用的机制。

**使用 函数式组件的一个显著好处是不必处理 Javascript 类的 \*this\* 引用的自引用。**

在我看来，以及其他许多人的看法中，类组件基本上没有比通过Hook增强的函数组件提供任何好处，除了所谓的[错误边界](https://reactjs.org/docs/error-boundaries.html)机制，它目前(2020年2月16日)还没有被函数组件使用。

在编写新代码时，如果项目使用的是 React 16.8或更高，那么[没有理由使用类组件](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both)。 另一方面，[目前没有必要重写所有旧的React代码](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components)作为函数组件。

------

### Organization of code in React application

在大多数应用中，我们遵循的原则是，将组件放在目录*components* 中，reducer程序放在目录*reducers* 中，负责与服务器通信的代码放在目录*services* 中。

这种组织方式适合于较小的应用，但是随着组件数量的增加，需要更好的解决方案。 组织一个项目没有一种正确的方法。 这篇文章[100% 正确的方式构建一个 React 应用(或为什么根本没这回事)](https://hackernoon.com/The-100-correct-way-to-structure-a-React-app-or-why-theres-no-such-thing-3ede534ef1ed)提供了一些关于这个问题的观点。

------

 此外，如果我们正在使用 Redux，那么应用遵循[Flux](https://facebook.github.io/Flux/docs/in-depth-overview)-架构，React 的角色更专注于创建视图。 

应用的业务逻辑使用 Redux 状态和操作创建者来处理。

 如果在 redux 应用中使用第6章熟悉的[redux thunk](https://fullstackopen.com/zh/part6/在_redux应用中与后端通信#asynchronous-actions-and-redux-thunk)，那么业务逻辑几乎可以与 React 代码完全分离。

------

### React/node-application security

到目前为止，我们还没有触及安全。 我们现在也没有太多的时间，但是幸运的是系里有一个 MOOC-course [Securing Software](https://cybersecuritybase.mooc.fi/module-2.1)来处理这个重要的话题。

不过，我们还是要看一下这门课程的一些具体内容。

开放 Web 应用安全项目，又称为[OWASP](https://www.owasp.org/) ，每年发布一份 Web 应用中最常见安全风险的清单。 最近的名单可以在这里找到( https://owasp.org/www-project-top-ten/)。 每年都可以发现同样的风险。

在列表的顶部，我们发现*injection*，这意味着例如，在应用中使用表单发送的文本被解释为与软件开发人员预期的完全不同。 最著名的注射类型可能是[sql 注入](https://stackoverflow.com/questions/332365/how-does-The-SQL-injection-from-The-bobby-tables-xkcd-comic-work)。

例如，如果下面的 sql 查询将在一个易受攻击的应用中执行:

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```

现在让我们假设一个恶意用户*Arto Hellas* 将它们的名称定义为

```
Arto Hell-as'; DROP TABLE Users; --
```

这样名称将包含一个单引号 `'`，它是一个 sql 字符串的开头和结尾字符。 作为执行这两个 sql 操作的结果，第二个操作将销毁数据库表*Users*

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --'
```

Sql-injections 可以通过[sanitizing](https://security.stackexchange.com/questions/172297/sanitizing-input-for-parameterized-queries)输入来阻止，这将需要检查查询的参数不包含任何禁止的字符，在这里是单引号。 如果发现被禁止的字符，它们将被替换为安全的替代字符，即[逃逸](https://en.wikipedia.org/wiki/escape_character#javascript)字符。

注射攻击在 NoSQL-databases 也是可行的。 然而，mongoose 通过[sanitizing](https://zanon.io/posts/nosql-injection-in-mongodb)查询来阻止它们。 你可以在[这里](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)找到更多关于这个话题的讨论。

------

#### Server side rendering, isomorphic applications and universal code

【服务器端渲染，同构应用和通用代码】

浏览器并不是唯一可以渲染使用 React 定义的组件的域。 渲染也可以在[服务器](https://reactjs.org/docs/react-dom-server.html)上完成。 这种方法正在越来越多地被使用，例如，当服务器第一次访问应用时，服务器使用 React 生成的预渲染页面。 从这里开始，应用的操作继续像往常一样进行，这意味着浏览器执行 React，它操纵浏览器显示的 DOM。 在服务器上完成的渲染命名为:*server side rendering*。

服务器端渲染的一个动机是搜索引擎优化。 搜索引擎一直以来都不擅长识别 JavaScript 渲染的内容，然而，这种趋势可能正在发生转变，例如，看看[这个](https://www.javascriptstuff.com/react-seo/)和[这个](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9)。

当然，服务器端渲染并不是 React 或者甚至是 JavaScript 所特有的。 理论上，在整个堆栈中使用相同的编程语言可以简化概念的执行，因为可以在前端和后端运行相同的代码。

除了服务器端渲染之外，还有所谓的*同构应用* 和*通用代码* 的讨论，尽管对它们的定义还存在一些争议。 根据一些[定义](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb)同构的 web 应用是同时在前端和后端执行渲染的应用。 另一方面，通用代码是可以在大多数环境中执行的代码，即前端和后端。

React 和 Node 为将同构应用实现为通用代码提供了一个理想的选择。

直接使用 React 编写通用代码目前仍然相当繁琐。 最近在 React 上实现了一个名为[Next.js](https://github.com/zeit/Next.js/)的库，这个库吸引了很多关注，是开发通用应用的一个很好的选择。

------

#### Progressive web apps

【渐进式网络应用】

最近人们开始使用 Google 推出的术语[渐进式网络应用](https://developers.google.com/web/progressive-web-apps/)(PWA)。

简而言之，我们讨论的是 web 应用，尽可能在每个平台上利用这些平台中最好的部分。 移动设备的小屏幕不能妨碍应用的可用性。 PWAs 也应该在脱机模式下或缓慢的互联网连接下完美地工作。 在移动设备上，它们必须像其他应用一样可以安装。 PWA 中的所有网络流量都应该加密。

使用 create-react-app 创建的应用在默认情况下是[渐进的](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/readme.md#making-a-progressive-web-app)。 如果应用使用来自服务器的数据，则使其逐步进行需要工作。 离线功能通常是在[service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)的帮助下实现的。

------

#### Microservice architecture

【微服务架构】

在本课程中，我们仅仅触及了服务器端的皮毛。 在我们的应用中，我们有一个*单体monolithic* 后端，这意味着一个应用组成一个整体并在单个服务器上运行，只服务于几个 api 端点。

随着应用的增长，整体后端方法开始在性能和可维护性方面出现问题。

[微服务体系结构](https://martinfowler.com/articles/microservices.html)(microservices)是一种将应用的后端与许多独立的服务组合在一起的方法，这些服务通过网络相互通信。 单独的微服务的目的是照顾一个特定的逻辑功能整体。 在纯微服务体系结构中，服务不使用共享数据库。

例如，bloglist 应用可以由两个服务组成: 一个处理用户，另一个处理 blog。 用户服务的职责是用户注册和用户身份验证，而博客服务将负责与博客相关的操作。

下面的图片显示了基于微服务架构的应用和基于更传统单体结构的应用的结构差异:

![fullstack content](https://fullstackopen.com/static/beecf1d05714ef6a4ac0721fce62d394/5a190/36.png)



前面的角色(图片中被一个正方形包围)在两个模型之间没有太大的不同。 在微服务和前端之间通常有一个所谓的[API 网关](http://microservices.io/patterns/apigateway) ，它提供了一种更加传统的“同一服务器上的所有东西”的幻觉

微服务体系结构的出现和发展是为了满足大规模互联网应用的需要。 这种趋势早在微服务这个词出现之前就由亚马逊设定了。 关键的起点是亚马逊 CEO 杰夫 · 贝索斯在2002年发给所有员工的一封电子邮件:

> All teams will henceforth expose their data and functionality through service interfaces. 今后，所有团队都将通过服务接口公开其数据和功能。
>
> Teams must communicate with each other through these interfaces. 团队必须通过这些接口彼此沟通。

> There will be no other form of inter-process communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network. 不允许使用其他形式的行程间通讯: 不允许直接链接，不允许直接读取其他团队的数据存储，不允许共享内存模型，不允许任何后门。 只允许通过网络上的服务接口调用进行通信。

> 你使用什么技术并不重要。
>
> All service interfaces, without exception, must be designed from the ground up to be externalize-able. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world. 所有的服务接口，无一例外，必须从头开始设计，使其具有可外部化的特性。 也就是说，团队必须进行规划和设计，以便能够将界面暴露给外部世界的开发人员。
>
> No exceptions. 没有例外。
>
> Anyone who doesn’t do this will be fired. Thank you; have a nice day! 不这样做的人将被解雇。谢谢，祝你今天愉快！

如今，微服务使用的最大先驱之一是 [Netflix](https://www.infoq.com/presentations/Netflix-chaos-microservices)。

微型服务的使用已经被大肆宣传成为当今的一种[银弹silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet)，它被用来解决几乎所有的问题。 然而，在应用微服务体系结构时会遇到很多挑战，而且通过最初创建一个传统的包含所有内容的后端，首先使用[单体优先monolith first](https://martinfowler.com/bliki/MonolithFirst.html)可能是有意义的。 或者也许[不是](https://martinfowler.com/articles/dont-start-monolith.html)。 关于这个问题有很多不同的意见。 这两个链接都指向马丁 · 福勒的网站; 正如我们所看到的，即使是聪明人也不能完全确定哪一种正确的方式更正确。

不幸的是，我们不能在本课程中更深入地探讨这个重要的议题。 即使只是粗略地看一下这个问题，也需要至少5个星期的时间。

#### Serverless

在2014年底 Amazon 发布了[lambda](https://aws.amazon.com/lambda/)之后，web 应用开发中出现了一个新的趋势: [无服务器](https://serverless.com/)。

Lambda 的主要特点是，它支持在云中执行单个函数，如今 Google 的[Cloud函数](https://cloud.google.com/functions/)以及[Azure相似的函数](https://azure.microsoft.com/en-us/services/functions/)也是如此。 以前，云中最小的可执行单元是一个*进程*，例如一个运行 Node 后端的执行期函式库。

例如，使用 Amazon 的[API 网关](https://aws.amazon.com/API-gateway/) ，可以制作无服务器的应用，其中对定义的 HTTP API 的请求可以直接从云函数中获得响应。 通常，这些函数已经使用云服务数据库中存储的数据进行操作。

无服务器并不是说应用中没有服务器，而是说服务器是如何定义的。 软件开发人员可以将他们的编程工作转移到更高的抽象级别，因为不再需要通过编程方式定义 http 请求的路由、数据库关系等，因为云基础设施提供了所有这些。 云函数也有助于创建良好的扩展系统，例如亚马逊的 Lambda 每秒可以执行大量的云函数。 所有这些都是通过基础设施自动完成的，不需要启动新的服务器等等。

### Useful libraries and interesting links

【有用的库和有趣的链接】

开发者社区已经产生了大量有用的库。 如果你正在开发更实质性的东西，那么检查一下现有的解决方案是否已经可用是值得的。

找到库的一个好地方是 https://applibslist.xyz/ 。

下面列出了一些可信任方推荐的库。

如果您的应用必须处理复杂的数据[lodash](https://www.npmjs.com/package/lodash) ，这是我们在[第4章](https://fullstackopen.com/zh/part4/从后端结构到测试入门#exercises-4-3-4-7)中推荐使用的一个很好的库。 如果您更喜欢函数式编程风格，您可以考虑使用[ramda](https://ramdajs.com/)。

如果你正在处理时间和日期，[date-fns](https://github.com/date-fns/date-fns) 提供了很好的处理时间和日期的工具。

[Formik](https://www.npmjs.com/package/Formik)和[redux-form](https://redux-form.com/8.3.0/)可以用来更容易地处理表单。

如果你的应用显示图表，你可以从多个选项中进行选择，推荐使用[recharts](http://recharts.org/en-US/)和[highcharts](https://github.com/highcharts/highcharts-react)。

由 Facebook 维护的[immutable.js](https://github.com/Facebook/immutable-js/)-library，顾名思义，提供了一些数据结构的不可变实现。 当我们使用 Redux 时，这个库可能是有用的，因为我们[记得](https://fullstackopen.com/zh/part6/flux架构与_redux#pure-functions-immutable) 来自第6章节: reducers 必须是纯函数，这意味着它们不能修改存储的状态，而是必须在发生变化时用一个新的状态替换它。 在过去的一年里，一些不可变的 js 的流行已经被[Immer](https://github.com/mweststrate/immer) 接管了，它提供了类似的功能，但是在一个相对简单的包中。

[Redux-saga](https://redux-saga.js.org/)提供了另一种方法，用于为[redux thunk](https://fullstackopen.com/zh/part6/在_redux应用中与后端通信#asynchronous-actions-and-redux-thunk)制作异步操作，类似于第6章节。 有些人欣然接受这种炒作，并且喜欢这种炒作。 我不这么认为。

对于单页应用来说，收集用户和页面交互的分析数据比传统的加载整个页面的网页应用 [更具有挑战性](https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications)。 [React Google Analytics](https://github.com/react-ga/react-ga) 数据库提供了一个解决方案。

在使用 Facebook 非常流行的 [React Native](https://facebook.github.io/react-native/) 库开发移动应用时，你可以利用你的 React 知道如何开发。

当涉及到用于管理和捆绑 JavaScript 项目的工具时，社区变化很大。 最佳实践发生了迅速的变化(年份是近似值，没有人记得那么久以前) :

- 2011 [Bower](https://www.npmjs.com/package/bower)
- 2012 [Grunt](https://www.npmjs.com/package/grunt)
- 2013-14 [Gulp](https://www.npmjs.com/package/gulp)
- 2012-14 [Browserify](https://www.npmjs.com/package/browserify)
- 2015- [Webpack](https://www.npmjs.com/package/webpack)

在 webpack 开始主导市场之后，赶时髦的人似乎对工具开发失去了兴趣。 几年前，[Parcel](https://parceljs.org/)开始以简单(Webpack 绝对不是)和快于 Webpack 的方式推销自己。 然而，在一个有希望的开始后，Parcel 并没有聚集任何动力，而且它开始看起来将不会是 Webpack 的终结者。

网站 https://reactpatterns.com/ 提供了一个简明的React最佳实践列表，其中一些已经在本课程中熟悉了。 另一个类似的列表是[react bits](https://vasanthk.gitbooks.io/react-bits/)。

[Reactiflux](https://www.reactiflux.com/) 一个很大的React开发者不和谐的聊天社区。 在课程结束后，它可能是一个可能的获得支持的地方。 例如，许多库都有自己的频道。

------

工具概念：

- 然而，我们通过[复制](https://fullstackopen.com/zh/part3/把应用部署到网上#serving-static-files-from-the-backend)将绑定的前端代码复制到后端存储库中来完成部署。 一个可能更好的方法是单独部署前端代码。 特别是使用 create-react-app 创建的应用，它非常简单，这要归功于内置的[buildpack](https://github.com/mars/create-react-app-buildpack)。
- 正如我在[第6章](https://fullstackopen.com/zh/part6/connect方法#redux-and-the-component-state)的结尾所提到的，React [Context-api](https://reactjs.org/docs/context.html)为集中式状态管理提供了一种替代方案，无需 redux 之类的第三方库。 你可以阅读更多关于这个主题的 [这个网站](https://www.simplethread.com/cant-replace-redux-with-hooks/) 和 [这个网站](https://hswolff.com/blog/how-to-usecontext-with-usereducer/)。