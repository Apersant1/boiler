interface IAuthData {}
interface IIputData {}
interface IResponse<T = any> {
    response: T;
    status: string;
}

interface IConnectResponse extends IResponse<{}> { }



export interface IService {
    request: (options: {
        url: string,
        method: string,
        headers?: object,
        jsonBody?: object
    }) => IResponse | IConnectResponse;


    hook: (hook: (url: string, headers: any) => any, guid: string, timeout: number) => string;
    error: {
        stringError: (message: string) => string;
    };
}

export interface IBundle {
    inputData: IIputData;
    authData: IAuthData;
}

interface IMeta {
    key: string;
    name: string;
    description: string;
}

interface IInputFieldBlock {
    key: string;
    name?: string;
    type: "text" | "select" | "multiselect";
    description?: string;
    required?: boolean;
    label?: string;
    choices?: object;
}

interface IInputFieldConnection {
    key: string;
    name?: string;
    type: "password" | "button" | "textPlain";
    description?: string;
    required?: boolean;
    label?: string;
    executeWithRedirect?: (service: IService, bundle: IBundle) => void;
    executeWithSaveFields?: (service: IService, bundle: IBundle) => void;
    executeWithMessage?: (service: IService, bundle: IBundle) => void;
}


interface IBlockExec {
    meta: IMeta;
    inputFields: (IInputFieldBlock | ((service: IService, bundle: IBundle) => any))[];
    execute: (service: IService, bundle: IBundle) => void;
}

interface IConnectionExec {
    meta: IMeta;
    inputFields: IInputFieldConnection[];
    execute: (service: IService, bundle: IBundle) => void;
}

interface IBlock extends IBlockExec { }

interface IConnection extends IConnectionExec { }

export interface IIntegration {
    schema: number;
    meta: IMeta;
    blocks: IBlock[];
    connections: IConnection[];
}