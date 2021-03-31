import ReactDOM from 'react-dom';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Provider } from 'react-redux';
import { store } from './state/index';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import './css/codeEditor.css';
import './css/syntax.css';
import './css/resizable.css';
import './css/preview.css';
import './css/textEditor.css';
import './css/actionBar.css';
import './css/cellListItem.css';
import './css/addCell.css';
import './css/codeCell.css';

import CellList from './components/CellList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CellList />
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
