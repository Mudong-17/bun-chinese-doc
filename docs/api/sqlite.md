---
outline: "deep"
---

# SQLite

Bun 在其内置的`bun:sqlite`模块中原生实现了一个高性能的[SQLite3](https://www.sqlite.org/)驱动程序。要使用它，请从内置的`bun:sqlite`模块中导入。

```ts
import { Database } from "bun:sqlite";

const db = new Database(":memory:");
const query = db.query("select 'Hello world' as message;");
query.get(); // => { message: "Hello world" }
```

这个 API 非常简单、同步且快速。感谢[better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)及其贡献者们，为`bun:sqlite`的 API 提供了灵感。

其特性包括：

- 事务支持
- 参数（命名和位置）
- 预编译语句
- 数据类型转换（`BLOB` 变为 `Uint8Array`）
- 比任何其他 JavaScript 中的 SQLite 驱动程序性能更快

`bun:sqlite`模块在读取查询方面大约比`better-sqlite3`快 3-6 倍，比`deno.land/x/sqlite`快 8-9 倍。每个驱动程序都是根据[Northwind Traders](https://github.com/jpwhite3/northwind-SQLite3/blob/46d5f8a64f396f87cd374d1600dbf521523980e8/Northwind_large.sqlite.zip)数据集进行的基准测试。您可以查看和运行[基准源代码](https://github.com/oven-sh/bun/tree/main/bench/sqlite)。

<image width="738" alt="Bun、better-sqlite3和deno.land/x/sqlite的SQLite基准测试" src="https://user-images.githubusercontent.com/709451/168459263-8cd51ca3-a924-41e9-908d-cf3478a3b7f3.png" caption="在运行macOS 12.3.1的M1 MacBook Pro（64GB）上进行了基准测试" />

## 数据库

要打开或创建 SQLite3 数据库：

```ts
import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite");
```

要打开一个内存中的数据库：

```ts
import { Database } from "bun:sqlite";

// 所有这些都做了相同的事情
const db = new Database(":memory:");
const db = new Database();
const db = new Database("");
```

要以只读模式打开：

```ts
import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite", { readonly: true });
```

要在文件不存在时创建数据库：

```ts
import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite", { create: true });
```

### `.close()`

要关闭数据库：

```ts
const db = new Database();
db.close();
```

注意：`close()`在数据库被垃圾回收时会自动调用。可以多次调用它，但在第一次之后不会产生任何效果。

### `.serialize()`

`bun:sqlite`支持 SQLite 自带的将数据库序列化和反序列化到内存的机制。

```ts
const olddb = new Database("mydb.sqlite");
const contents = olddb.serialize(); // => Uint8Array
const newdb = Database.deserialize(contents);
```

在内部，`.serialize()`调用了[`sqlite3_serialize`](https://www.sqlite.org/c3ref/serialize.html)。

### `.query()`

在`Database`实例上使用`db.query()`方法来[准备](https://www.sqlite.org/c3ref/prepare.html)SQL 查询。结果是一个`Statement`实例，它将被缓存在`Database`实例上。_查询不会被执行_。

```ts
const query = db.query(`select "Hello world" as message`);
```

> **注意** — 使用`.prepare()`方法来准备一个查询，*而不会*将其缓存在`Database`实例上。
>
> ```ts
> // 编译预处理语句
> const query = db.prepare("SELECT * FROM foo WHERE bar = ?> ");
> ```

## 语句

`Statement`是一个*准备好的查询*，这意味着它已被解析并编译成了高效的二进制形式。它可以以性能良好的方式多次执行。

使用在`Database`实例上的`.query`方法创建一个语句。

```ts
const query = db.query(`select "Hello world" as message`);
```

查询可以包含参数。这些可以是数值（`?1`）或命名（`$param`或`:param`或`@param`）。

```ts
const query = db.query(`SELECT ?1, ?2;`);
const query = db.query(`SELECT $param1, $param2;`);
```

当执行查询时，这些值将与参数绑定。一个`Statement`可以使用几种不同的方法来执行，每种方法以不同的形式返回结果。

### `.all()`

使用`.all()`来运行一个查询，并将结果作为对象数组返回。

```ts
const query = db.query(`select $message;`);
query.all({ $message: "Hello world" });
// => [{ message: "Hello world" }]
```

在内部，这会调用[`sqlite3_reset`](https://www.sqlite.org/capi3ref.html#sqlite3_reset)，并重复调用[`sqlite3_step`](https://www.sqlite.org/capi3ref.html#sqlite3_step)，直到返回`SQLITE_DONE`为止。

### `.get()`

使用`.get()`来运行一个查询，并将第一个结果作为对象返回。

```ts
const query = db.query(`select $message;`);
query.get({ $message: "Hello world" });
// => { $message: "Hello world" }
```

在内部，这会调用[`sqlite3_reset`](https://www.sqlite.org/capi3ref.html#sqlite3_reset)，然后调用[`sqlite3_step`](https://www.sqlite.org/capi3ref.html#sqlite3_step)，直到不再返回`SQLITE_ROW`为止。如果查询不返回行，则返回`undefined`。

### `.run()`

使用`.run()`来运行一个查询，并返回`undefined`。这对于模式修改查询（例如`CREATE TABLE`）或批量写入操作非常有用。

```ts
const query = db.query(`create table foo;`);
query.run();
// => undefined
```

在内部，这会调用[`sqlite3_reset`](https://www.sqlite.org/capi3ref.html#sqlite3_reset)，并调用[`sqlite3_step`](https://www.sqlite.org/capi3ref.html#sqlite3_step)一次。当您不关心结果时，不需要遍历所有行。

### `.values()`

使用`values()`来运行查询，并以数组的形式返回所有结果的数组。

```ts
const query = db.query(`select $message;`);
query.values({ $message: "Hello world" });

query.values(2);
// [
//   [ "Iron Man", 2008 ],
//   [ "The Avengers", 2012 ],
//   [ "Ant-Man: Quantumania", 2023 ],
// ]
```

在内部，这会调用[`sqlite3_reset`](https://www.sqlite.org/capi3ref.html#sqlite3_reset)，并重复调用[`sqlite3_step`](https://www.sqlite.org/capi3ref.html#sqlite3_step)，直到返回`SQLITE_DONE`为止。

### `.finalize()`

使用`.finalize()`来销毁一个`Statement`并释放与之关联的任何资源。一旦完成，`Statement`将无法再次执行。通常情况下，垃圾回收器会为您执行此操作，但在性能敏感的应用程序中，显式完成可能会有用。

```ts
const query = db.query("SELECT title, year FROM movies");
const movies = query.all();
query.finalize();
```

### `.toString()`

在`Statement`实例上调用`toString()`会打印扩展的 SQL 查询。这对于调试很有用。

```ts
import { Database } from "bun:sqlite";

// 设置
const query = db.query("SELECT $param;");

console.log(query.toString()); // => "SELECT NULL"

query.run(42);
console.log(query.toString()); // => "SELECT 42"

query.run(365);
console.log(query.toString()); // => "SELECT 365"
```

在内部，这会调用[`sqlite3_expanded_sql`](https://www.sqlite.org/capi3ref.html#sqlite3_expanded_sql)。参数使用最近绑定的值进行扩展。

## 参数

查询可以包含参数。这些可以是数值（`?1`）或命名（`$param`或`:param`或`@param`）。在执行查询时，将值绑定到这些参数：


```ts
const query = db.query("SELECT * FROM foo WHERE bar = $bar");
const results = query.all({
  $bar: "bar",
});
```

```json
[
  { "$bar": "bar" }
]
```


也可以使用编号（位置）参数：


```ts
const query = db.query("SELECT ?1, ?2");
const results = query.all("hello", "goodbye");
```

```ts
[
  {
    "?1": "hello",
    "?2": "goodbye"
  }
]
```


## 事务

事务是一种以*原子*方式执行多个查询的机制；也就是说，要么所有查询成功，要么所有查询都失败。使用`db.transaction()`方法创建事务：

```ts
const insertCat = db.prepare("INSERT INTO cats (name) VALUES ($name)");
const insertCats = db.transaction((cats) => {
  for (const cat of cats) insertCat.run(cat);
});
```

此时，我们还没有插入任何猫！调用`db.transaction()`返回一个新的函数（`insertCats`），该函数*包装*执行查询的函数。

要执行事务，请调用此函数。所有参数都将传递给包装函数；包装函数的返回值将由事务函数返回。包装函数还可以访问在执行事务的地方定义的`this`上下文。

```ts
const insert = db.prepare("INSERT INTO cats (name) VALUES ($name)");
const insertCats = db.transaction((cats) => {
  for (const cat of cats) insert.run(cat);
  return cats.length;
});

const count = insertCats([
  { $name: "Keanu" },
  { $name: "Salem" },
  { $name: "Crookshanks" },
]);

console.log(`Inserted ${count} cats`);
```

当调用`insertCats`时，驱动程序将自动[`开始`](https://www.sqlite.org/lang_transaction.html)一个事务，并在包装函数返回时`提交`它。如果抛出异常，事务将回滚。异常将像往常一样传播；它不会被捕获。

> **嵌套事务** — 事务函数可以从其他事务函数内部调用。这样做时，内部事务变成一个[保存点](https://www.sqlite.org/lang_savepoint.html)。
>
> <details>
> <summary>查看嵌套事务示例</summary>
>
> ```ts
> // 设置
> import { Database } from "bun:sqlite";
> const db = Database.open(":memory:");
> db.run(
>   "CREATE TABLE expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT, dollars INTEGER);"
> );
> db.run(
>   "CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, age INTEGER)"
> );
> const insertExpense = db.prepare(
>   "INSERT INTO expenses (note, dollars) VALUES (?, ?)"
> );
> const insert = db.prepare(
>   "INSERT INTO cats (name, age) VALUES ($name, $age)"
> );
> const insertCats = db.transaction((cats) => {
>   for (const cat of cats) insert.run(cat);
> });
>
> const adopt = db.transaction((cats) => {
>   insertExpense.run("adoption fees", 20);
>   insertCats(cats); // 嵌套事务
> });
>
> adopt([
>   { $name: "Joey", $age: 2 },
>   { $name: "Sally", $age: 4 },
>   { $name: "Junior", $age: 1 },
> ]);
> ```
> </details>

事务还具有`deferred`、`immediate`和`exclusive`版本。

```ts
insertCats(cats); // 使用"BEGIN"
insertCats.deferred(cats); // 使用"BEGIN DEFERRED"
insertCats.immediate(cats); // 使用"BEGIN IMMEDIATE"
insertCats.exclusive(cats); // 使用"BEGIN EXCLUSIVE"
```

### `.loadExtension()`

要加载[SQLite 扩展](https://www.sqlite.org/loadext.html)，请在`Database`实例上调用`.loadExtension(name)`：

```ts
import { Database } from "bun:sqlite";

const db = new Database();
db.loadExtension("myext");
```

<details>
<summary>对于macOS用户</summary>
**macOS用户** 默认情况下，macOS附带了Apple的专有SQLite构建，不支持扩展。要使用扩展，您需要安装原始版SQLite。

```bash
$ brew install sqlite
$ which sqlite # 获取二进制文件的路径
```

在创建任何`Database`实例之前，通过调用`Database.setCustomSQLite(path)`将`bun:sqlite`指向新构建。（在其他操作系统上，这是一个无操作。）传递 SQLite `.dylib`文件的路径，而不是可执行文件。使用 Homebrew 的最新版本，这类似于`/opt/homebrew/Cellar/sqlite/<version>/libsqlite3.dylib`。

```ts
import { Database } from "bun:sqlite";

Database.setCustomSQLite("/path/to/libsqlite.dylib");

const db = new Database();
db.loadExtension("myext");
```

</details>

## 参考

```ts
class Database {
  constructor(
    filename: string,
    options?:
      | number
      | {
          readonly?: boolean;
          create?: boolean;
          readwrite?: boolean;
        }
  );

  query<Params, ReturnType>(sql: string): Statement<Params, ReturnType>;
}

class Statement<Params, ReturnType> {
  all(params: Params): ReturnType[];
  get(params: Params): ReturnType | undefined;
  run(params: Params): void;
  values(params: Params): unknown[][];

  finalize(): void; // 销毁语句并清理资源
  toString(): string; // 序列化为SQL

  columnNames: string[]; // 结果集的列名
  paramsCount: number; // 语句期望的参数数量
  native: any; // 表示语句的本机对象
}

type SQLQueryBindings =
  | string
  | bigint
  | TypedArray
  | number
  | boolean
  | null
  | Record<string, string | bigint | TypedArray | number | boolean | null>;
```

### 数据类型

| JavaScript 类型 | SQLite 类型            |
| --------------- | ---------------------- |
| `string`        | `TEXT`                 |
| `number`        | `INTEGER` 或 `DECIMAL` |
| `boolean`       | `INTEGER`（1 或 0）    |
| `Uint8Array`    | `BLOB`                 |
| `Buffer`        | `BLOB`                 |
| `bigint`        | `INTEGER`              |
| `null`          | `NULL`                 |
