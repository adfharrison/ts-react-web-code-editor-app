import React, { useEffect } from 'react';

import CodeEditor from './CodeEditor';
import Preview from './Preview';

import { Cell } from '../state/index';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';

import Resizable from './Resizable';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // destructure updateCell and createBundle off the actions object, to use to update redux state with cell contents
  const { updateCell, createBundle } = useActions();

  // useTypedSelector is just a selector, and we are fishing out the piece of state that contains
  // the bundles for this particular code cell
  const bundle = useTypedSelector((state) => {
    return state.bundles[cell.id];
  });

  // use effect watches for changes in the code window, and if user pauses for a second,
  // it will compile the code
  useEffect(() => {
    const timer = setTimeout(async () => {
      // feed the contents of the code window into the bundler

      createBundle(cell.id, cell.content);
    }, 1000);

    // clear timer
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content, cell.id, createBundle]);

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
        {bundle && <Preview code={bundle.code} bundlingError={bundle.err} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;
