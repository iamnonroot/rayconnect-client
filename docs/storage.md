<div dir="rtl">

# استوریج
اگر شما یکم فرانت کار کرده باشید ، قطعا با `localStorage` آشنایی دارید. حالا همون رو شما میتونید با رایکانکت توی فضای ابری داشته باشید و خوبیش اینکه توی هر جایی که کاربر وارد حسابش شده باشه ، باز هم بهش دسترسی داره. اما اگر هم نمیدونید `localStorage` چیه و اصلا فرانت کار نیستید یا فرانت کار خوبی نیستید و نبودید ( برید یکم مطالعه کنید اول ) ، استوریج یه فضای ذخیره سازی مثل متغیر هاست با این تفاوت که توی دیتابیس ذخیره میشه و قابلیت های پیچیده و حتی ساده دیتابیس رو نداره و خیلی خیلی سادس و میشه گفت دیتابیس فقط کلید و مقداریه ( منظورم : KeyValue )

## فهرست

- [دکوراتور ها](#دکوراتور-ها)
    - [Storage](#Storage)
    - بابا ها
        - [LoadAndSaveStorage](#LoadAndSaveStorage)
        - [SetAndGetStorage](#SetAndGetStorage)
- [توابع](#توابع)
    - [setItem](#setItem)
    - [getItem](#getItem)
    - [removeItem](#removeItem)
    - [hasItem](#hasItem)

<br><br>
# دکوراتور ها
دکوراتور ها که فقط در *TypeScript* قابل استفاده هستند برای ساده سازی و زیبایی کد شما مورد استفاده قرار میگیرد.

</div>

<br>

## Storage

<div dir="rtl">
این دکوراتور بهتون کمک میکنه که برای یک کلید خاص توابع آماده اون استفاده کنید که می تونید از ۲ کلاس پدر ارث بری کنید که کارتون رو خیلی ساده میکنه.
</div>

<br>

### LoadAndSaveStorage

<div dir="rtl">

خب این کلاس پدر بهتون ۳ تا متد رو میده که برای *load* کردن اطلاعات و ریختنش به متغیر *items* رو میده و با متد و تابع *save* داده رو از متغیر *items* میخونه و تو استوریج ذخیره میکنه.  
به عنوان نمونه شما توی *rayconnect-up* که با پکیج [*rayconnect/up@*](https://www.npmjs.com/package/@rayconnect/up) نصب می تونید بکنید ، تمامی اپ های شما با همین کلاس بابا ذخیره و ثبت میشه.  

اما نمونه قطعه کد زیر رو مشاهده کنید تا سادگیش رو درک کنید :
</div>


```typescript
import { Storage, LoadAndSaveStorage } from '@iamnonroot/rayconnect-client/core';

interface IApp {
    aid: string
    domain: string
}

@Storage({
    name: "apps"
})
export class Apps extends LoadAndSaveStorage<IApp> {}

// حالا این کلاس بچه رو بدید به رایکانکت

rayconnect.storage.from(Apps);

// یا میتونید خودتون دستی بهش بدید که باحال نمیشه کارتون ولی کار میکنه

const apps = new Apps(rayconnect);

// چطور حالا بهش دسترسی داشته باشیم

const apps = rayconnect.storage.get<Apps>('apps'); // نام اون استوریج رو که تو دکوراتور دادید رو اینجا بدید

// حالا می تونید اینطوری باهاش کار کنید

await apps.load();

console.log(apps.items);

// یکم با آرایمون بازی میکنیم مثلا 

apps.items.push({
    // ..  داده جدید پوش می کنیم
    aid: 'root',
    domain: 'iamroot.ir'
});

await apps.save();

```

<br>

### SetAndGetStorage

<div dir="rtl">

> در نوشتن مستندات این بخش من دیدم اصلا این کلاس پدر چیز خاصی نداره و یکسری ویژگی خاص باحال اضافه کردم

این کلاس بابا با بابای قبلی فرق داره و فرقش اینکه آرایه نیست! که با توابع *set*, *get*  با مقادیر میتونید بازی کنید و با *unset* مقدار رو حذف کنید و با *isEmpty* ببینید که مقدار داره یا نه و با *is* میتونید بررسی کنید که مقدارش با مقداری که میخواید برابری داره یا نه.

حالا نمونه کدش رو داشته باشیم :
</div>

```typescript
import { Storage, SetAndGetStorage } from '@iamnonroot/rayconnect-client';

type ThemeName = 'light' | 'dark';

@Storage({
    name: 'ui-theme'
})
export class UITheme extends SetAndGetStorage<ThemeName> {}

//  رایکانکتیش بکنید

rayconnect.storage.from(UITheme);

// همچنان اگر دلتون بخواد میتونید دستی بهش رایکانکت رو بدید

const uiTheme = new UITheme(rayconnect);

// اینم میشه خیلی راحت از خود رایکانکت گرفت

const uiTheme = rayconnect.storage.get<UITheme>('ui-theme'); // اگر دلتون به خودتون میسوزه و میخوای از هوشمندی کد ادیتور استفاده کنید ، بهش کلاس رو به عنوان جنریک اینترفیس بدید

// حالا کارایی که میتونید بکنید

await uiTheme.set('dark');

console.log(await uiTheme.get()); // resolve: dark

console.log(await uiTheme.isEmpty()); // resolve: false

console.log(await uiTheme.is('light')); // resolve: false => dark != light

await uiTheme.unset(); // خالی میشه 

```

<br><br>
<div dir="rtl">

# توابع

</div>

## setItem
<div dir="rtl">
با این تابع شما یک مقداری رو ذخیره میکنید تو استوریج.
</div><br>

```typescript
rayconnect.storage.setItem<T>(key: string, value: T | any): Promise<boolean>
```

<div dir="rtl">
مثال :‌
</div><br>

```typescript
await rayconnect.storage.setItem('ping', 'pong');
```

## getItem
<div dir="rtl">
با این تابع شما میتونید مقداری که ذخیره کردید رو از استوریج بکشید بیرون.
</div><br>

```typescript
rayconnect.storage.getItem<T>(key: string): Promise<T | any | null>
```

<div dir="rtl">
مثال :‌
</div><br>

```typescript
const value = await rayconnect.storage.getItem('ping');

console.log(value); // pong
```

## hasItem
<div dir="rtl">
آیا میخواهید ببینید که اصلا وجود داره توی استوریج ؟
</div><br>

```typescript
rayconnect.storage.hasItem(key: string): Promise<boolean>
```

<div dir="rtl">
مثال :‌
</div><br>

```typescript
await rayconnect.storage.hasItem('ping'); // true
```

## removeItem
<div dir="rtl">
حالا دیگه فقط حذف یک مقدار مونده که با این تابع میتونید اینکار رو بکنید.
</div><br>

```typescript
rayconnect.storage.removeItem(key: string): Promise<boolean>
```

<div dir="rtl">
مثال :‌
</div><br>

```typescript
await rayconnect.storage.removeItem('ping');
```