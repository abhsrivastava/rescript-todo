module TodoItem = {
  type t = 
    Complete({content: string, completedOn: Js.Date.t})
    | InComplete({content: string})
    
  let toggle = todo => 
    switch todo {
      | Complete({content}) => InComplete({content: content})
      | InComplete({content}) => Complete({content: content, completedOn: Js.Date.make()})
    }

  let isComplete = todo => 
    switch todo {
      | Complete(_) => true
      | InComplete(_) => false
    }

  @react.component
  let make = (~onToggle, ~todo) => 
    <div> 
      <li>
        <input type_="checkbox" checked={todo->isComplete} onChange={_ => onToggle()} />
        {
          switch todo {
            | InComplete({content}) => content->React.string
            | Complete({content, completedOn}) => 
              <div>
                <s>{content->React.string}</s>
                {React.string("   ")}
                {completedOn->Js.Date.toDateString->React.string}
              </div>
          }
        }
      </li>
    </div>
}

module Todo = {
  type state = {todos: array<TodoItem.t>, input: string}
  let defaultState = {todos: [], input: ""}

  type action = 
    | Add 
    | Remove({id: int})
    | Toggle({id: int})
    | InputChange({value: string})

  let reducer = (state, action) => 
    switch action {
      | Add => {
        input: "",
        todos: state.todos->Js.Array2.concat([InComplete({content: state.input})])}
      | Remove({id}) => {
        ...state, todos: state.todos->Js.Array2.filteri((_, i) => i != id)}
      | Toggle({id}) => {
        ...state, 
        todos: state.todos->Js.Array2.mapi((todo, i) => 
          if id == i {
            todo->TodoItem.toggle
          } else {
            todo
          }
        )}
      | InputChange({value}) => {...state, input: value}
    }

  @react.component
  let make = () => {
    let ({todos, input}, dispatch) = React.useReducer(reducer, defaultState)
    <div>
      <input
        value={input}
        onChange={event => {
          let value = ReactEvent.Form.target(event)["value"]
          {value: value}->InputChange->dispatch
        }} 
        onKeyPress={event => 
          if ReactEvent.Keyboard.key(event) === "Enter" {
            dispatch(Add)
          }}
      />
      {if (todos->Js.Array2.length == 0) {
          <p>{React.string("You have not added any todos yet")}</p>
        } else {
          <ol>
            {todos->Js.Array2.mapi((todo, i) => {
              <div style={ReactDOM.Style.make(~background="steelblue", ~color="white", ~padding="1rem", ~margin="1rem 0", ~fontSize="1.5rem",())}>
              <TodoItem key={i->Js.Int.toString} todo={todo} onToggle={() => dispatch(Toggle({id: i}))} />
              {"   " -> React.string}
              <button onClick={_ => dispatch(Remove({id: i}))}>{React.string("🗑️")}</button>
              </div>
            })->React.array}
          </ol>
        }}
    </div>
  }
}

switch(ReactDOM.querySelector("#myapp")) {
  | Some(rootElement) => ReactDOM.render(<Todo />, rootElement)
  | None => ()
}