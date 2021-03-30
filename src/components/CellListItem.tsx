import React from 'react';
import { Cell } from '../state/index';
import CodeCell from './CodeCell';
import TextEditor from './TextEditor';
import ActionBar from './ActionBar';

interface CellListItemProps {
  cell: Cell;
}
const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  // define the type of element we  will be rendering
  let componentToRender: JSX.Element;
  if (cell.type === 'code') {
    componentToRender = (
      <>
        <div className='action-bar-wrapper'>
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    componentToRender = (
      <>
        <ActionBar id={cell.id} />
        <TextEditor cell={cell} />
      </>
    );
  }

  return <div className='cell-list-item'>{componentToRender}</div>;
};

export default CellListItem;
