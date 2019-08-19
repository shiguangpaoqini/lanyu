import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = DefaultRouter;

let routes = [
  {
    "path": "/home/home",
    "exact": true,
    "component": require('../home/home.js').default
  },
  {
    "path": "/",
    "exact": true,
    "component": require('../index/index.js').default
  },
  {
    "path": "/user/user",
    "exact": true,
    "component": require('../user/user.js').default
  },
  {
    "component": () => React.createElement(require('/Users/a/.config/yarn/global/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
  }
];
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

export default function() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
