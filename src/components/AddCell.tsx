import React from 'react';
import { useActions } from '../hooks/useActions';

interface AddCellProps {
  prevCellId: string | null;
}
// component is to be rendered before/  after every list item. the buttons call
// the insertCellBefore action with either 'text' or 'code'
const AddCell: React.FC<AddCellProps> = ({ prevCellId }) => {
  const { insertCellAfter } = useActions();

  return (
    <div className='add-cell'>
      <div className='add-buttons'>
        <button
          className='button is-rounded is-primary is-small'
          onClick={() => {
            insertCellAfter(prevCellId, 'code');
          }}
        >
          <span className='icon is-small'>
            <i className='fas fa-plus'></i>
          </span>
          <span> Code</span>
        </button>
        <button
          className='button is-rounded is-primary is-small'
          onClick={() => {
            insertCellAfter(prevCellId, 'text');
          }}
        >
          <span className='icon is-small'>
            <i className='fas fa-plus'></i>
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className='divider'></div>
    </div>
  );
};

export default AddCell;
