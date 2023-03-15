import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

const inputDirPath = './res/csv/';
const outputDirPath = './res/ts/';

type Card = {
  id: string;
  source: string;
  nw: string;
  ne: string;
  sw: string;
  se: string;
  goal_info: string;
};

fs.readdir(inputDirPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const allData: Card[] = [];
    if (path.extname(file) !== '.csv') {
      // ignore non-CSV files
      return;
    }

    const inputFilePath = path.join(inputDirPath, file);
    const outputFilePath = path.join(
      outputDirPath,
      `${path.parse(file).name}.ts`,
    );
    const variableName = path
      .parse(file)
      .name.replace(/-/g, '_')
      .replace('.csv', '');

    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on('data', (data) => allData.push(data))
      .on('end', () => {
        const output = JSON.stringify(Array.from(allData));
        fs.writeFile(
          path.join(outputFilePath),
          `/* eslint-disable semi */
      /* eslint-disable eol-last */
      /* eslint-disable object-curly-spacing */
      /* eslint-disable key-spacing */
      /* eslint-disable quote-props */
      /* eslint-disable comma-spacing */
      /* eslint-disable quotes */
      /* eslint-disable no-unused-vars */
      export const ${variableName} = ${output}
      `,
          function (err) {
            if (err) throw err;
            console.log(`${variableName} saved!`);
          },
        );
      });
  });
});
