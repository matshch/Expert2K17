import './custom/data-grid-fix';
import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import fetchPatch from './custom/fetch';
import { routes } from './routes';
import configureStore from './configureStore';
import DocumentTitle from 'react-document-title';

export default createServerRenderer(params => {
    fetchPatch(params.data.cookie);
    return new Promise<RenderResult>((resolve, reject) => {
        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory());
        store.dispatch(replace(urlAfterBasename));

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext: any = {};
        const app = (
            <Provider store={ store }>
                <StaticRouter basename={ basename } context={ routerContext } location={ params.location.path } children={ routes } />
            </Provider>
        );
        renderToString(app);

        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }
        
        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {
            var render = renderToString(app);
            var title = (DocumentTitle as any).rewind();
            resolve({
                html: render,
                globals: { initialReduxState: store.getState(), title }
            });
        }, reject); // Also propagate any errors back into the host application
    });
});
