import ReactDOM from 'react-dom';
import React from 'react';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import './css/codeEditor.css';
import './css/syntax.css';
import './css/resizable.css';
import './css/preview.css';
import './css/textEditor.css';

import CodeCell from './components/CodeCell';
import TextEditor from './components/TextEditor';

const App: React.FC = () => {
  return (
    <div>
      {/* <CodeCell /> */}
      <TextEditor />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
