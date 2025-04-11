import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RoutesProject from './router/RoutesProject';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutesProject />
  </StrictMode>,
)
