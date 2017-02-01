import * as fs from 'fs-extra';
import * as path from 'path';
import * as sass from 'node-sass';

export class Assets {
    inFolder: string = "./assets/scss";
    outFolder: string = "./.tmp/app/assets/css";
    sassFile: string = this.inFolder + "/index.scss";
    sassOutFile: string = this.outFolder + "/index.css";

    constructor() {
        let _self = this;

        _self.sass();

        /*fs.watch(_self.inFolder, (eventType, filename) => {
            if (filename) _self.sass(); 
        });*/
    }

    private sass() {
        let _self = this;

        sass.render({
            file: _self.sassFile,
            outFile: _self.sassOutFile,
            watch: true
        }, (err: any, result: any) => {
            if(err) throw new Error(err);

            if(!err) {
                _self.mkdirp(_self.outFolder);

                fs.writeFile(_self.sassOutFile, result.css, (err) => {
                });
            }
        });
    }

    private isDir(dpath: string) {
        try {
            return fs.lstatSync(dpath).isDirectory();
        } catch(e) {
            return false;
        }
    }
    private mkdirp (dirname: string) {
        let _self = this;
        let name: Array<String> = path.normalize(dirname).split(path.sep);

        name.forEach((sdir,index) => {
            var pathInQuestion = name.slice(0, index + 1).join(path.sep);
            if((!_self.isDir(pathInQuestion)) && pathInQuestion) fs.mkdirSync(pathInQuestion);
        });
    }
}