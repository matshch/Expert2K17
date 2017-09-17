# Expert2K17
> *Реализация оболочки экспертной системы*

## Требования к системе для запуска проекта:
* [.NET Core 2.0.0 SDK](https://github.com/dotnet/core/blob/master/release-notes/download-archives/2.0.0-download.md) или более новый в пределах минорной версии 2.0 или с поддержкой приложений, написанных под фреймворк `netcoreapp2.0`.
* [Node.js](https://nodejs.org/en/download/current/)
* [PostgreSQL](https://www.postgresql.org/download/)

## Настройка проекта
После клонирования репозитория перейдите в папку проекта `Expert2K17/Expert2K17` и выполните следующие действия в консоли:

1. `npm install`.
2. В `connections.json` пропишите параметры доступа к PostgreSQL. У пользователя должны быть права на вход и на создание баз данных (либо пустая база данных должна быть уже создана и должны быть права на создание таблиц в ней).
3. В `connections.json` измените токен добавления прав админа на неизвестный сторонним пользователям.
4. `dotnet restore`.

## Запуск проекта
Чтобы запустить проект в отладочном режиме, выполните команду `dotnet run`.

Чтобы подготовить проект к запуску в режиме релиза, выполните команду `dotnet publish -c Release`. После этого в папке `bin/Release/netcoreapp2.0/publish` будет лежать скомпилированная версия системы, которую можно запустить командой `dotnet Expert2K17.dll`. Для запуска таким образом требуется [.NET Core 2.0.0 Runtime](https://github.com/dotnet/core/blob/master/release-notes/download-archives/2.0.0-download.md).

При необходимости возможна сборка версии, независимой от .NET Core Runtime или SDK. Для этого выберите подходящие для целевых машин Runtime Identifier (RID) из [списка](https://github.com/dotnet/corefx/blob/release/2.0.0/pkg/Microsoft.NETCore.Platforms/runtime.json), затем добавьте в `Expert2K17.csproj` в раздел `<PropertyGroup>` тег `<RuntimeIdentifiers>`, в котором через точку с запятой перечислите все необходимые RIDы. После этого выполните публикацию проекта командой `dotnet publish -c Release -r `*RID*. В результате в папке `bin/Release/netcoreapp2.0/`*RID*`/publish` будет лежать скомпилированная версия системы, независимая от установленных в целевой системе .NET Core. Для запуска используйте исполняемый файл `Expert2K17`.

## Известные проблемы
*   `npm install` выдаёт предупреждения вида:

    > *package*` requires a peer of webpack@`*versions*` but none is installed. You must install peer dependencies yourself.`
    
    Данное предупреждение можно игнорировать, так как проект зависит от `webpack@^3.6.0`, и данная версия `webpack` обратно совместима с требуемой версией `webpack@^2.0`.
