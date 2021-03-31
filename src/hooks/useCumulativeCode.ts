import { useTypedSelector } from './useTypedSelector';

export const useCumulativCode = (cellid: string) => {
  // this is a function to gather up all the previous cell's codes so we have access to them
  return useTypedSelector((state) => {
    // destructure data and order off state.cells
    // remember data has type and content properties
    const { data, order } = state.cells;
    // create an array of all the cell's data strings
    const orderedCells = order.map((id) => {
      return data[id];
    });

    //this is our show function, basically console.log. putting it here means every cell has access to it
    // we are importing react slightly differently, so that users may import it themselves in future too.
    // however we need react here so that the show function can render JSX

    const showFunc = `
    import _React from 'react'
    import _ReactDOM from 'react-dom' 
   var show = (value) => {
     const root = document.querySelector('#root')
     if(typeof value === 'object'){
       if(value.$$typeof && value.props){
        _ReactDOM.render(value, root)
       } else {
         root.innerHTML = JSON.stringify(value);
       }
      
     } else {
        root.innerHTML = value;
     }
    
   }
  `;

    // create a no-op version of showFunc

    const showFuncNoOp = 'var show = ()=>{}';

    // create a new array of only all the code cell's code
    const cumCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        // if we are at the current cell, we want the working show function, otherwise disable it for previous cells
        if (c.id === cellid) {
          cumCode.push(showFunc);
        } else {
          cumCode.push(showFuncNoOp);
        }
        cumCode.push(c.content);
      }
      // break out when we have hit the current cell
      if (c.id === cellid) {
        break;
      }
    }
    return cumCode;
  }).join('\n');
};
