
module.exports = (projectName) => 
`{
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "",
    "main": "${projectName}.js",
    "scripts": {
      "start:dev": "tsc --watch ${projectName}.ts",
      "build":"tsc",
      "docs": "node swagger.js"
    },
    "dependencies": {
      "swagger-ui": "^5.17.14",
      "swagger-ui-express": "^5.0.1",
      "typescript": "^5.5.4"
    },
    "devDependencies": {
      "cors": "^2.8.5",
      "yamljs": "^0.3.0"
    }
}
`;