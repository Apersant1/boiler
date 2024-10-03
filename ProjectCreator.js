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

export class ProjectCreator {
  constructor() {
    this.prompt = inquirer.createPromptModule();
  }

  async createProject() {
    console.log(chalk.cyan('Создание нового проекта...'));
    const projectName = await this.askForProjectName();
    console.log(chalk.green(`Проект ${projectName} создается...`));
    this.createProjectFolder(projectName);
    this.createInterfacesFile(projectName);
    this.createIntegrationFile(projectName);
    this.createPackageFile(projectName);
    this.createSwaggerDocs(projectName);
    await this.installDependencies(projectName);
    console.log(chalk.green(`Проект ${projectName} создан успешно!`));
    console.log(chalk.yellow(`Абсолютный путь к проекту: ${path.resolve(projectName)}`));
    console.log(chalk.yellow(`Для перехода в ${projectName}: 'cd ${projectName}'`));
    console.log(chalk.yellow(`Для запуска ${projectName} 'npm run start:dev'`));
    console.log(chalk.yellow(`Для запуска документации 'npm run docs'`));
  }

  askForProjectName() {
    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: chalk.cyan('Введите имя проекта:'),
      },
    ]).then((answers) => answers.projectName);
  }

  createProjectFolder(projectName) {
    try {
      fs.mkdirSync(projectName);
      console.log(chalk.green(`Папка проекта ${projectName} создана успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания папки проекта: ${error}`));
    }
  }

  createInterfacesFile(projectName) {
    const interfacesPath = path.join(projectName, 'interfaces.d.ts');
    try {
      fs.writeFileSync(interfacesPath, interfacesTemplate(projectName));
      console.log(chalk.green(`Файл interfaces.d.ts создан успешно!`));
    } catch (error) {
      console.error(chalk.red(`Ошибка создания файла interfaces.d.ts: ${error}`));
    }
  }

  createIntegrationFile(projectName) {
    const integrationPath = path.join(projectName, `${projectName}.ts`);
    try {
      fs.writeFileSync(integrationPath, integrationTemplate(projectName));
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
}

