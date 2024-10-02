const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const childProcess = require('child_process');

class ProjectCreator {
  constructor() {
    this.prompt = inquirer.createPromptModule();
  }

  async createProject() {
    const projectName = await this.askForProjectName();
    this.createProjectFolder(projectName);
    this.createInterfacesFile(projectName);
    this.createIntegrationFile(projectName);
    this.createPackageFile(projectName);
    this.createSwaggerDocs(projectName);
    await this.installDependencies(projectName);
    console.log(`Проект ${projectName} создан успешно!`);
    console.log(`Для перехода в ${projectName}: 'cd ${projectName}'`);
    console.log(`Для запуска ${projectName} 'npm run start:dev'`);
    console.log(`Для запуска документации 'npm run docs'`);
  }

  askForProjectName() {
    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Введите имя проекта:',
      },
    ]).then((answers) => answers.projectName);
  }

  createProjectFolder(projectName) {
    fs.mkdirSync(projectName);
  }

  createInterfacesFile(projectName) {
    const interfacesPath = path.join(projectName, 'interfaces.d.ts');
    fs.copyFileSync("./src/templates/interfaces.d.ts", interfacesPath);
  }

  createIntegrationFile(projectName) {
    const integrationTemplate = require('./src/templates/integration-template');
    const integrationPath = path.join(projectName, `${projectName}.ts`);
    fs.writeFileSync(integrationPath, integrationTemplate(projectName));
  }
  createPackageFile(projectName) {
    const packageTemplate = require('./src/templates/packages-template');
    const packagePath = path.join(projectName, `package.json`);
    fs.writeFileSync(packagePath, packageTemplate(projectName));
  }
  createSwaggerDocs(projectName) {
    const swaggerPath = path.join(projectName, 'swagger.js');
    const openapiPath = path.join(projectName, 'openapi.yaml');
    fs.copyFileSync("./src/templates/swagger.js", swaggerPath);
    fs.copyFileSync("./src/templates/openapi.yaml", openapiPath);
  }
   installDependencies(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    childProcess.exec(`npm install`, { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка установки зависимостей: ${error}`);
      } else {
        console.log(`Зависимости установлены успешно!`);
      }
    });
  }
}

module.exports = ProjectCreator;