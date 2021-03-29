import React, { useState, useEffect, useRef } from 'react';

import CodeEditor from './CodeEditor';
import Preview from './Preview';
import bundle from '../bundler/index';

import Resizable from './Resizable';
import { ResizableBox } from 'react-resizable';

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // use effect watches for changes in the code window, and if user pauses for a second,
  // it will compile the code
  useEffect(() => {
    const timer = setTimeout(async () => {
      // feed the contents of the code window into the bundler
      const output = await bundle(input);

      // sets the code state to be the text bundled by esBuild
      setCode(output.code);
      setError(output.err);
    }, 1000);

    // clear timer
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue='//your code here'
            onChange={(value) => {
              setInput(value);
            }}
          />
        </Resizable>
        <Preview code={code} bundlingError={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
