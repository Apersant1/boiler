export default(projectName)=>
`
openapi: 3.0.2
info:
  title: ${projectName}
  description: API for interacting with ${projectName}
  version: 1.0.0

servers:
  - url: https://example.com/api/v4

paths:
  /test:
    get:
      tags: 
        - ${projectName}
      summary: Шаблон
      security:
        - bearerAuth: []
      responses:
        200:
          description: Шаблон
          content:
            application/json:
              schema:
                type: array

`