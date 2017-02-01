/// <reference path="typings/index.d.ts" />
import * as http from 'http';
import * as path from 'path';
import * as net from 'net';
import * as url from 'url';
import * as fs from 'fs-extra';
import { Packages } from '@unity/packages';
import { Assets } from '@unity/assets';
import Server from '@unity/server';
import * as io from 'socket.io';


export default class Vegan {
    private _server: Server = new Server();
    private _controller: any;
    private _io: any;
    
    constructor(controller: any) {
        console.log("Loading...");
        new Packages();
        new Assets();

        let data: any = [];
        let _self = this;

        _self._controller = controller;
        
        let app = http.createServer((request, response) => {
            let filePath = './.tmp/app' + request.url;
            let contentType = 'text/html';
            let isAPI = false;

            if (filePath == './.tmp/app/') filePath = './views/layout.html';

            if(filePath.split("?").length === 2 || path.extname(filePath) === "") {
                isAPI = true;
            }

            if(isAPI === true && typeof _self._controller[_self._server.getControllerName(request.url)] === "function") {
                for(let ctrl in _self._controller) {
                    if(ctrl === _self._server.getControllerName(request.url)) {
                        let controller = new _self._controller[ctrl](_self._io);

                        _self._server.on("create", (send: Object) => {
                            controller.create(send, response);
                        }, request);

                        _self._server.on("read", (send: Object) => {
                            controller.read(send, response);
                        }, request);

                        _self._server.on("update", (send: Object, fields: Object) => {
                            controller.update(send, fields, response);
                        }, request);

                        _self._server.on("destroy", (send: Object) => {
                            controller.destroy(send, response);
                        }, request);

                        _self._server.on("login", (send: Object) => {
                            controller.login(send, response);
                        }, request);

                        _self._server.on("getFriends", (send: Object) => {
                            controller.getFriends(send, response);
                        }, request);

                        _self._server.on("including", (send: Object) => {
                            controller.including(send, response);
                        }, request);
                    }
                }
            } else {
                fs.readFile(filePath.split("?")[0], function(error, content) {
                    var extname = path.extname(filePath);

                    if (error) {
                        if(error.code == 'ENOENT') {
                            fs.readFile('./views/layout.html', function(error, content) {
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                response.end(content, 'utf-8');
                            });
                        }
                        else {
                            response.writeHead(500);
                            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                            response.end(); 
                        }
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': _self._server.contentType(extname) });
                        response.end(content, 'utf-8');
                    }
                });
            }
        });

        this._io = io(app);

        app.listen(443);

        this._io.on('connection', (socket: any) => {
            socket.on('room', (room) => {
                socket.join(room);
            });
            socket.on('user.create', (data: any) => {
                var usr = new _self._controller.message(_self._io);

                usr.create(data, (item) => {
                   socket.emit('user.found', item);
                }, true); 
            });
            socket.on('message.find', (data: any) => {
                var msg = new _self._controller.message(_self._io);

                msg.read(data, (item) => {
                   socket.emit('message.found', item);
                }, true);
            });
            socket.on('message.create', (data: any) => {
                var msg = new _self._controller.message(_self._io);

                msg.create(data, (item) => {
                    this._io.sockets.in(data.from + '-' + data.to).emit('message.read', item);
                }, true);
            });
        });

        console.log('Server running at https://jet.chat');
    }
}