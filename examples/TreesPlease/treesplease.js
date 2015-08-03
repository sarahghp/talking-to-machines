// Access functions & scope

var specialForms = {
  'if': function (args) { 
    if (evaluate(args[0])){
      return evaluate(args[1]);
    } else {
      return evaluate(args[2]);
    }
  },
  
  'let': function (args){ 
    var flatArgs = _.flatten(args);
    return assignment(flatArgs[0], flatArgs.slice(1));
  },

  'assignment': assignment,

  'var': lookup
};


var builtIn = {
    '+': function(args) { return infix(args)('+')},
    '-': function(args) { return infix(args)('-')},
    '*': function(args) { return infix(args)('*')},
    '<': function(args) { return infix(args)('<')},
    '>': function(args) { return infix(args)('>')},

    '=': function (args) {
      var args = moveOverArgs([], args);
      return eval(args.join('==='));
    },
    
    'print': function (args, scope) {
      var args = moveOverArgs([], args, scope);
      return args.join('');
    }

  }

var scopes = [ builtIn ];

// Utility functions

function moveOverArgs(currentArr, arr, scope) {

  typeof arr[0] === 'object' ? currentArr.push(evaluate(arr[0], scope)) : currentArr.push(arr[0]);
  
  var remainingArr = arr.slice(1);
  if (remainingArr.length > 0) { 
    return moveOverArgs(currentArr, remainingArr, scope);
  } else {
    return currentArr;
  }
}


function infix (args) {
  return function(operator){
    args = moveOverArgs([], args);
    return eval(args.join(operator));
  }
}

function assignment (assign, rest, scoped) {

    // the first expression following 'let' MUST be a binding

    var variable = assign.expressions[0].expressions,
        value = assign.expressions[1];

    // put identity in current scope or create new scope and add

    if (scoped) {
      scopes[scopes.length - 1][variable] = value;
    } else { 
      scopes.push(Object.create(Object.prototype));
      scopes[scopes.length - 1][variable] = value;
    }
      
    // iterate through all assignments before then evaluate other expressions

    if(rest.length && rest[0].operator === 'assignment'){
      return specialForms.assignment(rest[0], rest.slice(1), true);
    } else {
      return moveOverArgs([], rest, scopes.length - 1);
    }
}

function lookup(args, scope){

  var scope = scope;  

  return (function checkScope(check){
    if (check >= 0){
      if (scopes[scope][args]){
        return scopes[scope][args];
      } else {
        scope -= 1;
        return checkScope(scope);
      }
    } else {
    return 'Reference error. There is no variable ' + args + '. '
    }
  })(scope);

}

function resetScopes(){
  scopes = _.dropRight(scopes, scopes.length - 1);
}

// Evaluation

var evaluate = function(ast, scope) {

  // Check first that on recursion we haven't just received a scalar value that can be returned

  if(!(ast && typeof ast === 'object')) {
    return ast;
  }

  // Then set scope & evaluate

  var scope = scope || 0,
      special = specialForms[ast.operator];

  console.log(ast, ast.operator, scope);

  if (special) {
    return special(ast.expressions, scope);
  } else {
    return lookup(ast.operator, scope)(ast.expressions, scope);
  } 

};

// Run function

var run = function(source) {
  var ast = PLT.parser.parse(source);
  resetScopes();
  return evaluate(ast);
};