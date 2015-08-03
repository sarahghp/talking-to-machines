# whenever.js

An adaptation and implementation of [Whenever](http://www.dangermouse.net/esoteric/whenever.html) into Javascript.

## Using Whenever

Whenever is an esolang playing with the idea of control flow. How do you write a program when statements are called out of sync?

In Whenever, functions are added to an execution bag and then executed in random order. That's pretty much it. Functions are removed from the bag on execution unless otherwise directed by in-built functions (see below).

### Writing a Program

#### Statements
The base of a whenever.js program is the simple statement. This is an argument-less function declaration (not assignment!):

```
function name() { ... }
```

When this statement is executed, the function will run. If you would like access to global variables, you can take advantage of the non-strict environment in which whenever runs and use assignment without `var`:

```
~~var~~ variable = value;
```

#### Built-in Functions

Whenever.js includes most Whenever standard functions (except U()). In this case, they are called as normal Javascript functions within a statement. For instance:

```js
// create monsters statement
function monsters() {
	console.log('OH NO MONSTERS RUN!!!!');
}

// add six more copies of the monster statement to the bag
function addMonsters() {
	add(monsters, 6);
}
```

##### Add
```js
add(functionName, #oftimes)
```

Adds given number of copies to the execution bag.

##### Remove
```js
remove(functionName, #oftimes)
```

Removes given number of copies from execution bag. If the number is greater than number of copies, it will leave 0.

##### Defer
```js
defer(functionToBeExecutedFirst, #numberoftimestoexecute, function(){})
```

Defer will refrain from running the callback until the named function has been executed the given number of times.

##### Again
```js
again(predicate, function(){})
```

If the predicate given to again is true, the callback statement is executed but remains in the bag, to be executed again some time later. If the argument is false, the statement is executed and removed from the to-do list as normal.

The predicate can be simply the name of a function as well as other boolean options. Writing the following, for instance, would execute `monster` as long as 'teeth` has not been executed and removed:

```js
function keepMonstersGoing() {
	again(teeth, monster)
}
```


##### N
```js
N(functionName)
```

Will return the number of times the named function has been executed.

### Running the Program
Whenever.js executes via command-line. Compile by running 

```
node ./whenever.js <path/to/file/name.we>
```