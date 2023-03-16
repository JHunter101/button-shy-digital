"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const inputDirPath = './res/csv/';
const outputDirPath = './res/ts/';
fs.readdir(inputDirPath, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach((file) => {
        const allData = [];
        if (path.extname(file) !== '.csv') {
            // ignore non-CSV files
            return;
        }
        const inputFilePath = path.join(inputDirPath, file);
        const outputFilePath = path.join(outputDirPath, `${path.parse(file).name}.ts`);
        const variableName = path
            .parse(file)
            .name.replace(/-/g, '_')
            .replace('.csv', '');
        fs.createReadStream(inputFilePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => allData.push(data))
            .on('end', () => {
            const output = JSON.stringify(Array.from(allData));
            fs.writeFile(path.join(outputFilePath), `/* eslint-disable semi */
      /* eslint-disable eol-last */
      /* eslint-disable object-curly-spacing */
      /* eslint-disable key-spacing */
      /* eslint-disable quote-props */
      /* eslint-disable comma-spacing */
      /* eslint-disable quotes */
      /* eslint-disable no-unused-vars */
      export const ${variableName} = ${output}
      `, function (err) {
                if (err)
                    throw err;
                console.log(`${variableName} saved!`);
            });
        });
    });
});
