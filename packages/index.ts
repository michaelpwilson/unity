import * as fs from 'fs-extra';

export class Packages {
    modules: Array<String> = [
        "core-js/client/shim.min.js",
        "@angular/core/bundles/core.umd.js",
        "@angular/common/bundles/common.umd.js",
        "@angular/compiler/bundles/compiler.umd.js",
        "@angular/platform-browser/bundles/platform-browser.umd.js",
        "@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
        "@angular/http/bundles/http.umd.js",
        "@angular/router/bundles/router.umd.js",
        "@angular/forms/bundles/forms.umd.js",
        "rxjs",
        "systemjs/dist/system.src.js",
        "zone.js/dist/zone.js",
        "reflect-metadata/Reflect.js",
        "socket.io-client/dist/socket.io.min.js",
        "moment/min/moment.min.js"
    ];

    constructor() {
        this.modules.forEach((module) => {
            if(!fs.existsSync('./.tmp/app/modules/' + module)) {
              return fs.copySync('./node_modules/' + module, './.tmp/app/modules/' + module);
            }
            return;
        });

        this.fonts();
    }

    fonts() {
        if(!fs.existsSync('./.tmp/app/assets/fonts')) {
            return fs.copySync('./node_modules/font-awesome/fonts', './.tmp/app/assets/fonts');
        }
    }
}