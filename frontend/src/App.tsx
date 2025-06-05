import { RouterProvider } from 'react-router-dom';

import AppRouter from './routes/router';
import { ConfigProvider, ThemeConfig } from 'antd';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const theme: ThemeConfig = {
  token: {
    fontFamily: 'Roboto, sans-serif',
    colorText: '#000000',
    colorBorder: '#000000',
  },
};

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <RouterProvider router={AppRouter} />
      </ConfigProvider>
    </Provider>
  );
};

export default App;
