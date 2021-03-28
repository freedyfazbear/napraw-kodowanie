/*
 * Source:
 * https://gist.github.com/CezaryDanielNowak/357e526b759e4614b859
 *
 * Why do I need it:
 * When using NapiProjekt or OpenSubtitles on non-polish Windows machine,
 * subtitles has wrong encoding and are hard to read.
 * 
 * How to use:
 * - save fix.js somewhere on your drive
 * - copy subtitles.(txt/srt) to the same directory
 * - run `node fix.js`. Now use subtitles.(txt/srt) file is fixed.
 * - orig_subtitles.(txt/srt) is a backup, just in case.
 */

var fs = require('fs');
var path = require('path');

function walk(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function(name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    }
  });
}

var findReplace = {
  'ñ': 'ń',
  '³': 'ł',
  '¿': 'ż',
  'Ÿ': 'ź',
  '¯': 'Ż',
  '£': "Ł",
  '': "ź",
  'æ': 'ć',
  'ê': 'ę',
  '¿': 'ż',
  '¹': 'ą',
  'Œ': 'Ś',
  'œ': 'ś',
  '¥': 'Ą'
};

walk('./', function(filePath, stat) {
  if (['txt', 'srt'].indexOf(filePath.substr(-3)) !== -1 && filePath.substr(0, 5) !== 'orig_') {
    var contents = fs.readFileSync(filePath, 'utf8')

    Object.keys(findReplace).forEach(function(key) {
      const val = findReplace[key];
      contents = contents.replace(new RegExp('[' + key + ']', 'g'), val);
    });

    fs.renameSync(filePath, 'orig_' + filePath); 

    console.log('[ write ' + filePath + ' ]');
    fs.writeFileSync(filePath, contents); //write as UTF8
  }
});


console.log('[ DONE ]');