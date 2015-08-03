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

// Built-in whenever funcs

function add(fn, times){
  var times = times || 1,
      fn    = _.find(baseArray, function(el){
                return el.name = fn;
             });
  
  _.times(times, function(){
    workingArr.push(fn);
  });
}

function remove(fn, times){
  _.times(times, function(){
    var idx = _.findIndex(workingArr, function(el){
      el.name = fn;
    });

    workingArr.splice(idx, 1);
  });
}

function defer(check, times, cb){

}

function again(predicate, fn){

}

function N(fn) {
 return 
}


// Start whenevering!
 
function deStringify(arr) {
  return _.map(arr, function(el){
    eval('var moo = ' + el);
    return moo
  });
}

function run(arr) {

  var length = arr.length;

  if (!length){
    console.log('FIN: THE BAG IS EMPTY');
    return;
  }

  workingArr = arr;

  var num = Math.round(Math.random() * length),
      chosen = _.pullAt(workingArr, num);

  console.log('CHOSEN 0', workingArr, chosen, chosen[0])
  chosen[0]();
  run(workingArr);
  
}

var baseArray = deStringify(bag);
run(baseArray.slice()); // call run on a copy of the base array