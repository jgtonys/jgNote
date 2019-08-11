const fs = window.require('fs');
const path = window.require('path');
const remote = require('electron').remote;
const appPath = remote.app.getAppPath();

let data = "";

if (process.env.NODE_ENV !== 'development') {
  data = fs.readFileSync(path.join(appPath,'../../../github.json'));
}
else {
  data = fs.readFileSync(path.join(__static,'../devSettingFiles/github.json'))
}

const json = data.toString('utf8');
let settings = JSON.parse(json);

console.log(settings);

export const con = settings;
