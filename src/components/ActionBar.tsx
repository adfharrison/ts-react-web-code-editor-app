import React from 'react';
import { useActions } from '../hooks/useActions';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  // destructure moveCell and deleteCell off the actions object, to use to update redux state useing these methods
  const { moveCell, deleteCell } = useActions();
  return (
    <div className='action-bar'>
      <button
        onClick={() => {
          moveCell(id, 'up');
        }}
        className='button is-primary is-small'
      >
        <span className='icon'>
          <i className='fas fa-arrow-up' />
        </span>
      </button>

      <button
        onClick={() => {
          moveCell(id, 'down');
        }}
        className='button is-primary is-small'
      >
        <span className='icon'>
          <i className='fas fa-arrow-down' />
        </span>
      </button>
      <button
        onClick={() => {
          deleteCell(id);
        }}
        className='button is-primary is-small'
      >
        <span className='icon'>
          <i className='fas fa-times' />
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
