export default (type)=>{
    if(type ==="basic") {
        return  String.raw`
        {
            meta: {
            key: "jira_base_connection",
            name: "Подключение по логину/паролю к Jira",
            description: "Подключение к Jira",
            },
            inputFields: [
            {
                key: "connection_login",
                type: "textPlain",
                label: "Логин",
                required: true,
            },
            {
                key: "connection_password",
                type: "password",
                label: "Пароль",
                required: true,
            },
            {
                key: "connection_base_url",
                type: "textPlain",
                label: "base URL",
                required: true,
            },
            ],
            execute: (service, bundle) => {
            return {
                url: bundle.authData.connection_base_url,
                passHash:
                "Basic " +
                service.base64Encode(
                    bundle.authData.connection_login +
                    ":" +
                    bundle.authData.connection_password
                ),
            };
            },
        }
    `
    }
    if(type==="oauth"){
        return String.raw`
        {
            meta: {
            key: "oauth_template",
            name: "Подключение oAuth2 ",
            description: "Подключение по oAuth2"
            },
            inputFields: [
            {
                key: "client_id",
                type: "password",
                label: "Client ID",
                required: true
            },
            {
                key: "client_secret",
                type: "password",
                label: "Client secret",
                required: true
            },
            {
                key: "show_button",
                type: "button",
                label: "Получить redirect URL",
                required: false,
                executeWithSaveFields: (service, bundle) => {
                return { redirect_url: bundle.authData.BASE_URL };
                }
            },
            {
                key: "redirect_url",
                type: "textPlain",
                label: "Redirect URL",
                required: false
            },
            {
                key: "authorize_button",
                type: "button",
                label: "Авторизоваться",
                required: false,
                executeWithRedirect: (service, bundle) => {
                return ("http://example.com");
                },
                executeWithMessage: (service, bundle) => {
                if (bundle.authData.accessToken && bundle.authData.accessToken !== "") return "Успешно авторизован!";
                service.error.stringError("Не удалось авторизоваться!");
                },
                executeWithSaveFields: (service, bundle) => {
                const CLIENT_id = bundle.authData.client_id;
                const CLIENT_secret = bundle.authData.client_secret;
                
                const guid = bundle.authData.redirect_url.match(/\/webhook\/.+/)[0].replace("/webhook/", "");
    
                const AUTH_Code = service.hook(
                    (url:any, headers) => {
                    return url
                        .match(/code=[^&]+&?/)[0]
                        .replace("code=", "")
                        .replace("&", "");
                    },
                    guid,
                    20
                );
    
                if (AUTH_Code === undefined) service.error.stringError("Не удалось получить Authorization Code.");
    
                const exchangeCode = service.request({
                    url: "paste url to change code on token",
                    method: "POST",
                    headers: {
                    ["Content-Type"]: "application/json"
                    },
                    jsonBody: {
                    client_id: CLIENT_id,
                    client_secret: CLIENT_secret,
                    grant_type: "authorization_code",
                    code: AUTH_Code,
                    redirect_uri: bundle.authData.redirect_url
                    }
                });
                var accTok = exchangeCode.response.access_token;
                if (accTok === undefined)
                    service.error.stringError(
                    "Не удалось выполнить обмен Authorization Code на access_token.\\n" + JSON.stringify(exchangeCode.response)
                    );
                return {
                    accessToken: accTok,
                    refreshToken: exchangeCode.response.refresh_token
                };
                }
            },
            {
                key: "test_button",
                type: "button",
                label: "Проверить подключение",
                required: true,
                executeWithMessage: (service, bundle) => {
                if (!bundle.authData.accessToken && bundle.authData.accessToken !== "") return "Не удалось авторизоваться!";
                const req = service.request({
                    url: "paste url to get user info",
                    method: "GET",
                    headers: {
                    Authorization: "Bearer " + bundle.authData.accessToken
                    }
                });
                const status = req.status;
                if (Number(status) >= 200 && Number(status) < 300) return "Успешное подключение! Статус: " + status;
                service.error.stringError("Не удалось подключиться! Статус: " + status + "\\n" + JSON.stringify(req));
                }
            },
            {
                key: "un_authorize_button",
                type: "button",
                label: "Забыть учётную запись",
                required: false,
                executeWithMessage: (service, bundle) => {
                return "Я забыл твой токен.";
                },
                executeWithSaveFields: (service, bundle) => {
                return { accessToken: "", refreshToken: "" };
                }
            }
            ],
            execute: (service, bundle) => {}
        },
        `
    } else {
        return String.raw``
    }
}
