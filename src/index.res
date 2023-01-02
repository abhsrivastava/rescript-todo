open Todo

switch (ReactDOM.querySelector("#myapp")) {
| Some(rootElement) => ReactDOM.render(<Todo />, rootElement)
| None => ()
};