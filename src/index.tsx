import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  // function to initialise esBuild, using the esbuild.wasm in public dir. assign it to ref
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };
  // start service jsut once, on initial render
  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    // makes sure esBuild service has started
    if (!ref.current) {
      return;
    }
    // use transform method of esBuild stored in ref, feed in textarea content, and some options
    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });
    setCode(result.code);
  };
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
