import * as ReactDOM from 'react-dom/client';
import './assets/app.scss';
global.Buffer = global.Buffer || require('buffer').Buffer;
import 'babel-polyfill';

import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <App />
);
