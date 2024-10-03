
export default (projectName,connections) => `
import { IIntegration, IService, IBundle } from './interfaces';

const integration:IIntegration={
    schema:1,
    meta:{
        key:"${projectName}-ui",
        name: "${projectName} UI",
        description: "UI для ${projectName}",
    },
    blocks:[],
    connections:[${connections}]
}
`;