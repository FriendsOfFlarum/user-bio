import 'autolink-js';
import app from 'flarum/forum/app';
import addBioToUserCard from './extenders/addBioToUserCard';

export * from './components';
export { default as extend } from './extend';

app.initializers.add('fof-user-bio', () => {
  addBioToUserCard();
});
