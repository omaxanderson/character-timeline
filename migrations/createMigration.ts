import fs from 'fs';
import path from 'path';
import colors from 'colors';

if (process.argv.length < 3) {
   console.log(colors.red('Error: no filename supplied\n'));
   process.exit(0);
}


const d = new Date();
const filename = `files/${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}_${process.argv[2]}.ts`;

console.log(`migrations/${filename}`);

fs.writeFileSync(path.join(__dirname, filename), 'export default `QUERY`;');
