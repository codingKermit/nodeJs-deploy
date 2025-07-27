import fs from 'fs';
import fsPromise from 'fs/promises';

fs.readFile('package.json', console.log);

fsPromise.readFile('package.json')
    .then(()=>{})
    .catch(()=>{})
    .finally(()=>{})