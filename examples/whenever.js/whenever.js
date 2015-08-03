var _     = require('lodash'),
    fs    = require('fs'),
    path  = require('path'),
    PEG   = require('pegjs'),
    cli  = require('commander');

cli
  .version('0.0.1')
  .description('Compile your whenever files by passing the path to the file')
  .parse(process.argv);

// Find the files
var file = fs.readFileSync(cli.args[0]);



// Use the grammar to make a parser

var grammar = fs.readFileSync(__dirname + '/lib/grammar.txt').toString(),
    parser  = PEG.buildParser(grammar),
    bag     = parser.parse(file.toString());

console.log(bag);

// Parse the files we found and send them to bag file ... run bag file