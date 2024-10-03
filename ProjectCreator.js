import fs from "fs";
import path from "path";
import  inquirer from "inquirer";
import {execSync } from "child_process";
import chalk  from "chalk";

import interfacesTemplate from "./src/templates/interfaces-template.js";
import integrationTemplate from "./src/templates/integration-template.js";
import packageTemplate from "./src/templates/packages-template.js"
import swaggerTemplate from "./src/templates/swagger-template.js";
import openapiTemplate from "./src/templates/openapi-template.js";
import prettierTemplate from "./src/templates/prettier-config.js";


import authTemplate from "./src/templates/basic-auth.js";
export class ProjectCreator {
  constructor() {
    this.prompt = inquirer.createPromptModule();
  }

  async createProject() {
    console.log(chalk.cyan('Создание нового проекта...'));
    const {projectName,authMethod} = await this.askForProjectName();
    console.log(chalk.green(`Проект ${projectName} создается...`));
    this.createProjectFolder(projectName);
    this.createInterfacesFile(projectName,authMethod);
    this.createIntegrationFile(projectName,authMethod);
    this.createPackageFile(projectName);
    this.createSwaggerDocs(projectName);
    this.createPrettierConfig(projectName);
    //await this.installDependencies(projectName);
    console.log(chalk.green(`Проект ${projectName} создан успешно!`));
    console.log(`Для перехода в ${projectName}:`,chalk.yellow(`cd ${projectName}`));
    console.log(`Для запуска ${projectName} `,chalk.yellow(`npm run start:dev`));
    console.log(`Для запуска документации`,chalk.yellow('npm run docs'));
  }

  askForProjectName() {
    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: chalk.cyan('Введите имя проекта:'),
      },
      {
        type: 'list',
        name: 'authMethod',
        message: chalk.cyan('Выберите способ авторизации:'),
        choices: [
          { name: 'Basic', value: 'basic' },
          { name: 'OAuth', value: 'oauth' },
          { name: 'None', value: 'none' },
        ],
      },
    ]).then((answers) => {
      const projectName = answers.projectName;
      const authMethod = answers.authMethod;
      return { projectName, authMethod };
    });
  }

  createProjectFolder(projectName) {
    try {
      fs.mkdirSync(projectName);
      console.log(chalk.green(`Папка проекта ${projectName} создана успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания папки проекта: ${error}`));
    }
  }

  createInterfacesFile(projectName,auth_type) {
    const interfacesPath = path.join(projectName, 'interfaces.d.ts');
    let authData_fields = ``
    if(auth_type === "basic"){
      authData_fields = 
      `
      connection_login:string;
      connection_password: string;
      connection_base_url:string;
      url:string;
      passHash:string;
      `
    } else if(auth_type === "oauth"){
      authData_fields =
      `
      client_id:string;
      client_secret:string;
      redirect_url:string;
      accessToken:string;
      refreshToken:string;
      BASE_URL:string;
      `
    } else if(auth_type ==="None"){
      authData_fields = ``
    }
    
    try {
      fs.writeFileSync(interfacesPath, interfacesTemplate(projectName,authData_fields));
      console.log(chalk.green(`Файл interfaces.d.ts создан успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания файла interfaces.d.ts: ${error}`));
    }
  }

  createIntegrationFile(projectName,auth_type) {
    const integrationPath = path.join(projectName, `${projectName}.ts`);
    try {
      fs.writeFileSync(integrationPath, integrationTemplate(projectName,authTemplate(auth_type)));
      console.log(chalk.green(`Файл ${projectName}.ts создан успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания файла ${projectName}.ts: ${error}`));
    }
  }

  createPackageFile(projectName) {
    const packagePath = path.join(projectName, `package.json`);
    try {
      fs.writeFileSync(packagePath, packageTemplate(projectName));
      console.log(chalk.green(`Файл package.json создан успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания файла package.json: ${error}`));
    }
  }

  createSwaggerDocs(projectName) {
    const swaggerPath = path.join(projectName, 'swagger.js');
    const openapiPath = path.join(projectName, 'openapi.yaml');

    try {
      fs.writeFileSync(swaggerPath, swaggerTemplate(projectName));
      fs.writeFileSync(openapiPath, openapiTemplate(projectName));
      console.log(chalk.green(`Документация Swagger создана успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания документации Swagger: ${error}`));
    }
  }

  installDependencies(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    try {
      execSync(`npm install`, { cwd: projectPath, stdio: 'inherit' });
      console.log(chalk.green(`Зависимости установлены успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка установки зависимостей: ${error}`));
    }
  }
  createPrettierConfig(projectName){
    const prettierPath = path.join(projectName, '.prettierrc');
    try {
      fs.writeFileSync(prettierPath, prettierTemplate(projectName));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания файла конфигурации prettier: ${error}`));
    }
  }
}

