import React, { useEffect } from 'react';

import CodeEditor from './CodeEditor';
import Preview from './Preview';

import { Cell } from '../state/index';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useCumulativCode } from '../hooks/useCumulativeCode';

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

  const cumulativeCode = useCumulativCode(cell.id);

  // use effect watches for changes in the code window, and if user pauses for a second,
  // it will compile the code
  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    const timer = setTimeout(async () => {
      // feed the contents of the code window into the bundler

      createBundle(cell.id, cumulativeCode);
    }, 1000);

    // clear timer
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

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

        {!bundle || bundle.loading ? (
          <div className='progress-wrapper'>
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading...
              </progress>
            </div>
          </div>
        ) : (
          <Preview code={bundle.code} bundlingError={bundle.err} />
        )}
      </div>
    </Resizable>
  );
};

export default CodeCell;
