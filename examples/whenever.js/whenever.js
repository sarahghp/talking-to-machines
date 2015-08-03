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

// console.log(bag);

// Built-in whenever funcs

var timesCalled = {};

function getFuncFromString(str) {
  return _.find(baseArray, function(el){
    return el.name = str;
  });
}

function add(fn, times){
  var times = times || 1,
      fn    = getFuncFromString(fn);
  
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

function defer(check, times, cb) {
  if(timesCalled[check] > times) {
     _.isString(cb) ? getFuncFromString(cb)() : cb();
  }
}

function again(predicate, fn){
  var fn        = _.isString(fn) ? getFuncFromString(fn) : fn,
      predicate = _.isString(predicate) ? _.includes(workingArr, fn) : predicate;
      
  if (predicate){
    fn();
    workingArr.push(fn);
  } else {
    fn();
  }

}

function N(fn) {
 return _.filter(workingArr, function(el){
  return el.name = fn;
 }).length;
}


// Start whenevering!
 
function deStringify(arr) {
  return _.map(arr, function(el){
    eval('var moo = ' + el);
    timesCalled[moo.name] = 0;
    return moo;
  });
}

function run(arr) {

  var length = arr.length;

  if (!length){
    console.log('FIN: THE BAG IS EMPTY');
    return;
  }

  workingArr = arr;

  var num = Math.floor(Math.random() * length),
      chosen = _.pullAt(workingArr, num)[0];

  chosen();
  timesCalled[chosen.name]++;
  run(workingArr);
  
}

// ACTION

var baseArray = deStringify(bag),
    workingArr; // this mutates and is not to be trusted!

run(baseArray.slice()); // call run on a copy of the base array