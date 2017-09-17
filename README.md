# Expert2K17
> *Реализация оболочки экспертной системы*

## Требования к системе для запуска проекта:
* [.NET Core 2.0.0 SDK](https://github.com/dotnet/core/blob/master/release-notes/download-archives/2.0.0-download.md) или более новый в пределах минорной версии 2.0 или с поддержкой приложений, написанных под фреймворк `netcoreapp2.0`.
* [Node.js](https://nodejs.org/en/download/current/)
* [PostgreSQL](https://www.postgresql.org/download/)

## Настройка проекта
После клонирования репозитория перейдите в папку проекта `Expert2K17/Expert2K17` и выполните следующие действия в консоли:

1.  `npm install`.
2.  В `connections.json` пропишите параметры доступа к PostgreSQL. У пользователя должны быть права на вход и на создание баз данных (либо пустая база данных должна быть уже создана и должны быть права на создание таблиц в ней).
3.  В `connections.json` измените токен добавления прав админа на неизвестный сторонним пользователям.
4.  `dotnet restore`.

## Запуск проекта
### Запуск в режиме отладки
Чтобы запустить проект в отладочном режиме, выполните команду `dotnet run`.

### Запуск в режиме релиза
Для запуска в режиме релиза требуется [.NET Core 2.0.0 Runtime](https://github.com/dotnet/core/blob/master/release-notes/download-archives/2.0.0-download.md) (включён в .NET Core 2.0.0 SDK).

Чтобы запустить проект в режиме релиза, выполните следующие действия:
1.  Выполните команду `dotnet publish -c Release` в папке проекта. В результате в папке `bin/Release/netcoreapp2.0/publish` будет лежать скомпилированная версия системы.
2.  Запустите скомпилированную версию системы, перейдя в папку, где она лежит, и запустив команду `dotnet Expert2K17.dll`.

### Запуск на системе без .NET Core
При необходимости возможна сборка версии, независимой от .NET Core Runtime или SDK. Для этого выполните следующие действия:
1.  Выберите подходящие для целевых машин Runtime Identifier (RID) из [списка](https://github.com/dotnet/corefx/blob/release/2.0.0/pkg/Microsoft.NETCore.Platforms/runtime.json).
2.  Добавьте в файл `Expert2K17.csproj` в разделе `<PropertyGroup>` тег `<RuntimeIdentifiers>`, в котором через точку с запятой перечислите все необходимые RIDы.
3.  Выполните публикацию проекта командой `dotnet publish -c Release -r `*RID*.

В результате в папке `bin/Release/netcoreapp2.0/`*RID*`/publish` будет лежать скомпилированная версия системы, независимая от установленных в целевой системе .NET Core. Для запуска используйте исполняемый файл `Expert2K17` с расширением, типичным для исполняемых файлов в целевой системе.

## Известные проблемы
*   `npm install` выдаёт предупреждения вида:

    > *package*` requires a peer of webpack@`*versions*` but none is installed. You must install peer dependencies yourself.`
    
    Данное предупреждение можно игнорировать, так как проект зависит от `webpack@^3.6.0`, и данная версия `webpack` обратно совместима с требуемой версией `webpack@^2.0`.
