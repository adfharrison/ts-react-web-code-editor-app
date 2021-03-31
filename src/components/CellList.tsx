import React, { Fragment } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import CellListItem from './CellListItem';
import AddCell from './AddCell';

const CellList = () => {
  // this selector maps over the order array and returns each cell from the data object in order according to the
  // order in which thier id's appear in the order array. destructure the cells property from the state, and within that, just the order and data props.
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id];
    });
  });

  // map over the rederedCells array to produce a list of the correct text or code components in the correct order
  const renderedCells = cells.map((cell) => {
    if (!cell) {
      return;
    }
    return (
      <Fragment key={cell.id}>
        {/* feed currently iterated cell.id into AddCell to produce AddCell buttons that will insert a new cell in the right place */}

        <CellListItem cell={cell} />
        <AddCell prevCellId={cell.id} />
      </Fragment>
    );
  });
  // render the list of components
  return (
    <div className='cell-list'>
      <AddCell prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
