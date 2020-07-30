import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';

import getClient from '@client/apollo/index';
import StoreProvider from '@client/store/StoreProvider';
import regSW from './registerServiceWorker';
import App from './App';

regSW();

(async () => {
  const [client] = await getClient(
    async () => client.$token,
  );

  ReactDOM.render(
    (
      <StoreProvider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </StoreProvider>
    ),
    document.getElementById('app'),
  );
})();
