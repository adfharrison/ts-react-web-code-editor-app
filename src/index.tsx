import ReactDOM from 'react-dom';
import React, { useState } from 'react';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import './css/codeEditor.css';
import './css/syntax.css';

import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import bundle from './bundler/index';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    // feed the contents of the code window into the bundler
    const output = await bundle(input);

    // sets the code state to be the text bundled by esBuild
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue='//your code here'
        onChange={(value) => {
          setInput(value);
        }}
      />

      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
