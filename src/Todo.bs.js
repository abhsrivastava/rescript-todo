// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("rescript/lib/js/curry.js");
var React = require("react");
var ReactDom = require("react-dom");

function toggle(todo) {
  if (todo.TAG === /* Complete */0) {
    return {
            TAG: /* InComplete */1,
            content: todo.content
          };
  } else {
    return {
            TAG: /* Complete */0,
            content: todo.content,
            completedOn: new Date()
          };
  }
}

function isComplete(todo) {
  if (todo.TAG === /* Complete */0) {
    return true;
  } else {
    return false;
  }
}

function Todo$TodoItem(Props) {
  var onToggle = Props.onToggle;
  var todo = Props.todo;
  var tmp;
  tmp = todo.TAG === /* Complete */0 ? React.createElement("div", undefined, React.createElement("s", undefined, todo.content), "   ", todo.completedOn.toDateString()) : todo.content;
  return React.createElement("div", undefined, React.createElement("li", undefined, React.createElement("input", {
                      checked: isComplete(todo),
                      type: "checkbox",
                      onChange: (function (param) {
                          Curry._1(onToggle, undefined);
                        })
                    }), tmp));
}

var TodoItem = {
  toggle: toggle,
  isComplete: isComplete,
  make: Todo$TodoItem
};

var defaultState_todos = [];

var defaultState = {
  todos: defaultState_todos,
  input: ""
};

function reducer(state, action) {
  if (typeof action === "number") {
    return {
            todos: state.todos.concat([{
                    TAG: /* InComplete */1,
                    content: state.input
                  }]),
            input: ""
          };
  }
  switch (action.TAG | 0) {
    case /* Remove */0 :
        var id = action.id;
        return {
                todos: state.todos.filter(function (param, i) {
                      return i !== id;
                    }),
                input: state.input
              };
    case /* Toggle */1 :
        var id$1 = action.id;
        return {
                todos: state.todos.map(function (todo, i) {
                      if (id$1 === i) {
                        return toggle(todo);
                      } else {
                        return todo;
                      }
                    }),
                input: state.input
              };
    case /* InputChange */2 :
        return {
                todos: state.todos,
                input: action.value
              };
    
  }
}

function Todo$Todo(Props) {
  var match = React.useReducer(reducer, defaultState);
  var dispatch = match[1];
  var match$1 = match[0];
  var todos = match$1.todos;
  return React.createElement("div", undefined, React.createElement("input", {
                  value: match$1.input,
                  onKeyPress: (function ($$event) {
                      if ($$event.key === "Enter") {
                        return Curry._1(dispatch, /* Add */0);
                      }
                      
                    }),
                  onChange: (function ($$event) {
                      var value = $$event.target.value;
                      Curry._1(dispatch, {
                            TAG: /* InputChange */2,
                            value: value
                          });
                    })
                }), todos.length === 0 ? React.createElement("p", undefined, "You have not added any todos yet") : React.createElement("ol", undefined, todos.map(function (todo, i) {
                        return React.createElement(Todo$TodoItem, {
                                    onToggle: (function (param) {
                                        Curry._1(dispatch, {
                                              TAG: /* Toggle */1,
                                              id: i
                                            });
                                      }),
                                    todo: todo,
                                    key: i.toString()
                                  });
                      })));
}

var Todo = {
  defaultState: defaultState,
  reducer: reducer,
  make: Todo$Todo
};

var rootElement = document.querySelector("#myapp");

if (!(rootElement == null)) {
  ReactDom.render(React.createElement(Todo$Todo, {}), rootElement);
}

exports.TodoItem = TodoItem;
exports.Todo = Todo;
/* rootElement Not a pure module */