import React, { useState, useEffect } from 'react';

import CodeEditor from './CodeEditor';
import Preview from './Preview';
import bundle from '../bundler/index';
import { Cell } from '../state/index';
import { useActions } from '../hooks/useActions';

import Resizable from './Resizable';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  // destructure updateCell off the actions object, to use to update redux state with cell contents
  const { updateCell } = useActions();

  // use effect watches for changes in the code window, and if user pauses for a second,
  // it will compile the code
  useEffect(() => {
    const timer = setTimeout(async () => {
      // feed the contents of the code window into the bundler
      const output = await bundle(cell.content);

      // sets the code state to be the text bundled by esBuild
      setCode(output.code);
      setError(output.err);
    }, 1000);

    // clear timer
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => {
              updateCell(cell.id, value);
            }}
          />
        </Resizable>
        <Preview code={code} bundlingError={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
