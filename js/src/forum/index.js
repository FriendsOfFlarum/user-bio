import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import 'autolink-js';
import UserCard from 'flarum/forum/components/UserCard';
import UserBio from './components/UserBio';

export * from './components';

export { default as extend } from './extend';

app.initializers.add('fof-user-bio', () => {
  extend(UserCard.prototype, 'infoItems', function (items) {
    let user = this.attrs.user;

    if (!user.attribute('canViewBio')) {
      return;
    }

    items.add('bio', <UserBio user={user} editable={this.attrs.editable} />, -100);
  });
});
