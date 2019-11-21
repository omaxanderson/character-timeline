import fs from 'fs';
import path from 'path';
import colors from 'colors';
import moment from 'moment';

if (process.argv.length < 3) {
   console.log(colors.red('Error: no filename supplied\n'));
   process.exit(0);
}

const d = moment().format('YYYY MM DD HH mm ss').split(' ');;
const [ year, month, day, hour, minute, second ] = d;

const filename = `files/${year}${month}${day}${hour}${minute}${second}_${process.argv[2]}.ts`;

console.log(`migrations/${filename}`);

fs.writeFileSync(path.join(__dirname, filename), 'export default `QUERY`;');
