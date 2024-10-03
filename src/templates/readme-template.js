export default (projectName)=>
String.raw
`
# Интеграция


## Добавление полей 
- ### Добавление полей authData
Для добавление новых полей в authdata необходимо модифицировать интерфейс **IAuthData**, который находится в [Интерфейсы](./interfaces.d.ts#:~:text=IAuthData)

- ### Добавление полей в inputData
Для добавление новых полей в inputData необходимо модифицировать интерфейс **IIputData**, который находится в [Интерфейсы](./interfaces.d.ts#:~:text=IIputData)

## Начало работы

-  Запустить компилятор в режиме отслеживания
      
        npm run start:dev
      
- Редактирование кода интеграции происходит в файле ${projectName}.ts
- Для проверки работоспособности написанной интеграции неоходимо копировать ${projectName}.js 
  - Предварительно удалив лишнее 
  
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var

  до **integration = {**


## Запуск интерактивной api среды

- 1. Запуск
        
        npm run docs
        
`