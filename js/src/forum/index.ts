import app from 'flarum/forum/app';
import extendUserCard from './extenders/extendUserCard';

export { default as extend } from './extend';

export * from './components';

app.initializers.add('fof-user-bio', () => {
  extendUserCard();
});
