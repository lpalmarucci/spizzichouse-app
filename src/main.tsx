import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import './index.css';
import './i18n.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.ts';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from 'react-auth-kit';
import { ToastProvider } from './context/Toast.context.tsx';
import { ThemeProvider } from './context/Theme.context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(

  <ErrorBoundary fallback={<h1>Something went wronngs</h1>}>
    <NextUIProvider>
      <AuthProvider
        authType="cookie"
        authName={'_auth'}
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === 'https:'}
      >
        <ThemeProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </NextUIProvider>
  </ErrorBoundary>

);
