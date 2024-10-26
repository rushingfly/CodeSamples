// routes.js
import { lazy } from 'react';

const LazyLoad = lazy(() => import('./pages/LazyLoad'));

// 路由表对象
const routes = [
  {
    path: '/lazy',
    element: <LazyLoad />,
  },
];

export default routes;
