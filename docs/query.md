# کوئری ها
با کوئری ها شما می توانید درخواست هایتان را بین کاربران یا سرور اپ ارتباط بر قرار کنید و داده ها و اطلاعات را منتقل سازید. با کوئری ها شما توانایی اجرای توابع را به صورت ابری و آنلاین خواهید داشت.

### فهرست
- مفاهیم کلی
    - address
    - method
    - scope

- مفاهیم جداگانه
    - user & token
    - data
    - permission

- دکوراتور ها
    - Query

- توابع
    - hasScope
    - setPermission
    - on
    - send
    - exec

- اینترفیس ها

<br><br>

# مفاهیم کلی
شما در استفاده از کوئری ها با ۳ ویژگی اصلی و مهم کوئری برخورد دارید که عبارت اند از *scope* و *method* و *address*.

|ورودی|اجباری|نوع|یکتا|توضیحات|مثال|
|-|-|-|-|-|-|
| scope | true | string | false | محدوده اجرایی کوئری |‌ "chat", "user" |
| method | true | string | false | مشخص کردن نوع کار  | "GET", "POST" |
| address | true | string | true | آدرس یا نام کوئری  | "users", "user/list"

# مفاهیم جداگانه
این ها مفاهمی هستند که بسته به تابعی که استفاده می کنید ، جزء ورود های آن تابع استفاده قرار میگیرند.

| ورودی |‌ اجباری |‌ نوع |‌ تابع |‌ توضیحات |
|-|-|-|-|-|
|user| false | string یا "*" یا "guest" | send و exec | آی دی نام کاربر و اگر * باشد یعنی همه کاربران بجز مهمان و اگر guest باشد یعنی مهمان ها و همه کاربران| 
|token| false | string یا "*" |‌ send و exec | توکن کاربر که اگر * باشد یعنی به همه ی توکن های کاربر |
| data | true | < T > یا object یا any | send و exec | داده ای که می خواهید ارسال کنید | 
| permission |  true | string یا "*" یا "guest" | setPermission و  @Query | آی دی نام کاربر و اگر * باشد یعنی همه کاربران بجز مهمان و اگر guest باشد یعنی مهمان ها و همه کاربران |

<br><br>
# دکوراتور ها
دکوراتور ها که فقط در *TypeScript* قابل استفاده هستند برای ساده سازی و زیبایی کد شما مورد استفاده قرار میگیرد. در بخش اینترفیس ها مقادیر دیگر نوشته شده است.  
گوش دادن به یک کوئری و اجرای دستورات لازمه وقتی که درخواست آن ارسال شد. توجه داشته باشید که این دکوراتور فقط دستورات *setPermission* و *on* را به شکل خوشگل تری اجرا میکند.
نحوه اجرایی و ساختن آن در قطعه کد زیر می بینید :

```typescript
import { Query } from '@iamnonroot/rayconnect-client/core';
import { RunQuery } from '@iamnonroot/rayconnect-client/interface';

@Query({
    scope: "post",
    method: "GET",
    address: "post/all",
    permission: "guest"
})
export class Posts implements RunQuery {
    async run(request: IQueryRequest<{ page: number }>, response: IQueryResponse): Promise<void> {
        let { page } = request.body;
        // Database is doing some things ....
        response.send([...]);
    }
}

...

rayconnect.query.of(Posts);

...
```
به هیچ عنوان فرامویش نکنید که باید به رایکانکت این کلاس را معرفی کنید با دستور زیر :‌

```typescript
rayconnect.query.of(Posts);
```
<br><br>
# توابع

## hasScope
با این تابع شما میتوانید ببینید که رایکانکت که ازش ساختین آیا اسکوپ را دارد یا ندارد. جالب است بدانید که این تابع در تابع *on* برای جلوگیری از خطا استفاده شده است و یک خطا خیلی زیبا و کاملا مفهومی چاپ می کند!

```typescript
rayconnect.query.hasScope(scope: string): boolean;
```

مثال :‌

```typescript
if(rayconnect.query.hasScope("post")) {
    // اسکوپ را دارد
} else {
    // اسکوپ را ندارد
}
```

## setPermission
با این تابع شما می توانید دسترسی های لازم برای گوش دادن به یک کوئری را تعیین کنید.
```typescript
rayconnect.query.setPermission(option: IQueryOption): Promise<void>;
```

مثال : 

```typescript
try {
    await rayconnect.query.setPermission({
        scope: "post",
        method: "GET",
        address: "post/all",
        access: "guest"
    });
} catch (error) {
    // خطا در ثبت دسترسی
}
```

## on
گوش دادن به یک کوئری و اجرای دستورات لازمه وقتی که درخواست آن ارسال شد.

```typescript
rayconnect.query.on(option: OnQuery, callback: QueryCallback):‌ void;
```

مثال:

```typescript
rayconnect.query.on({
    scope: "post",
    method: "GET",
    address: "post/all",
}, (request: IQueryRequest<{ page: number }>, response: IQueryResponse)=> {
    let { page } = request.body;
    // کار های دیتابیسی خیلی خفن ...
    response.send([...]);
});
```

## send
یک درخواست یک طرفه به دریافت کننده

```typescript
rayconnect.query.send(option: SendQuery): void;
```

مثال :

```typescript
rayconnect.query.send({
    scope: "chat",
    method: "SEND",
    address: "message/send",
    user: "root", // این اختیاری هستند ولی من توی مثالی که زدم نوشتم
    token: "*", // این اختیاری هستند ولی من توی مثالی که زدم نوشتم
    data: {
        message: "سلام"
    }
});
```

## exec
یک درخواست دو طرفه با دریافت کننده و همراه با نتیجه

```typescript
rayconnect.query.exec<T>(option: ExecQuery): Promise<ExecQueryResponse<T>>;
```

مثال :

```typescript
interface IResult {
    status: boolean
    id: string
}

rayconnect.query.exec({
    scope: "post",
    method: "CREATE",
    address: "post/new",
    data: {
        title: "سلام دنیا",
        content: "سلام من از طرف رایکانکت به دنیا"
    }
}).then((response: ExecQueryResponse<IResult>)=> {
    if(response.body.status == true) {
        console.log(response.body.id);
    }
}).catch((error)=> {
    // خطا رخ داده که ما گرفتیمش و به شما دادیم
});
```

## اینترفیس ها
کد هایی که برای اینترفیس نوشته شده ، پیوست خورده اند.

```typescript
export interface IQueryOption {
    scope: string
    method: string
    address: string,
    access?: 'guest' | '*' | string
}

export interface IQueryRequest<T> {
    body: T
    user: string
    token: string
    at: number
}

export interface IQueryResponse {
    send: (data: any) => void
}

export interface RunQuery {
    run: (request: IQueryRequest<any>, response: IQueryResponse) => Promise<void> | void
}

export interface OnQuery {
    scope: string
    method: string
    address: string
}

export interface SendQuery {
    scope: string
    method: string
    address: string
    data: object | any
    user?: string
    token?: string
}

export interface ExecQuery {
    scope: string
    method: string
    address: string
    data: object | any
    user?: string
    token?: string
}

export interface ExecQueryResponse<T> extends IQueryRequest<T> { }
```