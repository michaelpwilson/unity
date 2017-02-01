import * as url from 'url';
import * as formidable from 'formidable';

export default class Server {
    _contentType: String;

    constructor() {}

    contentType(contentType: String) {
        switch (contentType) {
            case '.html':
                this._contentType = 'text/html';
                break;
            case '.js':
                this._contentType = 'text/javascript';
                break;
            case '.css':
                this._contentType = 'text/css';
                break;
            case '.json':
                this._contentType = 'application/json';
                break;
            case '.png':
                this._contentType = 'image/png';
                break;      
            case '.jpg':
                this._contentType = 'image/jpg';
                break;
            case '.wav':
                this._contentType = 'audio/wav';
                break;
        }
        return this._contentType;
    }

    on(state: String, onState: Function, _req: any) {
        let send: any = {};
        let rURL: any = this.parseUrl(_req.url);
        let sURL = this.urlToJSON(rURL);
        let body = [];

        if(_req.method == "POST") {
            var form = new formidable.IncomingForm();
        
            form.parse(_req, (err: any, fields: any, files: any) => {
                if(sURL.actions[2] === "create" && state === "create") {
                    return onState(fields);
                } else if(sURL.actions[2] === "destroy" && state === "destroy") {
                    return onState(fields);
                } else if(sURL.actions[2] === "find" && state === "read") {
                    return onState(fields);
                } else if(sURL.actions[2] === "login" && state === "login") {
                    return onState(fields);
                } else if(sURL.actions[2] === "update" && state === "update") {
                    return onState(sURL.send, fields);
                } else if(sURL.actions[2] === "getFriends" && state === "getFriends") {
                    return onState(fields);
                }
            });
        } else {
            if(sURL.actions[2] === "create" && state === "create") {
                return onState(sURL.send);
            } else if(sURL.actions[2] === "destroy" && state === "destroy") {
                return onState(sURL.send);
            } else if(sURL.actions[2] === "find" && state === "read") {
                return onState(sURL.send);
            } else if(sURL.actions[2] === "login" && state === "login") {
                return onState(sURL.send);
            } else if(sURL.actions[2] === "update" && state === "update") {
                return onState(sURL.send);
            } else if(sURL.actions[2] === "including" && state === "including") {
                return onState(sURL.send);
            }
        }

    }

    parseUrl(_url: any): any {
        return url.parse(decodeURIComponent(_url)).path.split("?");
    }
    
    getControllerName(_url: any): any {
        _url = this.parseUrl(_url)[0];

        return _url.split("/")[1];
    }

    urlToJSON(paramsString: String) {
        let data: any = { actions: paramsString[0].split("/"), send: {} };

        if(paramsString.length === 1) return data;    

        paramsString[1].split("&").forEach((param: string) => {
            let _param = param.split("=");
            data.send[_param[0]]  = _param[1];
        });

        return data;
    }
}