import React, {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom'

import { withTranslation } from 'react-i18next';
import MainRouter from './routes/routes';
import MainLoading from './components/Loading/mainLoading'

function TheApp() {
  return (
    <BrowserRouter>      
      <MainRouter />
    </BrowserRouter>
  );
}

const AppWithTrans =  withTranslation()(TheApp);


export default function App() {
  return (
    <Suspense fallback={<MainLoading />}>
      <AppWithTrans />
    </Suspense>
  );
}
