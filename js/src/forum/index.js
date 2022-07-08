import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import 'autolink-js';
import computed from 'flarum/common/utils/computed';
import UserCard from 'flarum/forum/components/UserCard';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';
import UserBio from './components/UserBio';

export * from './components';

app.initializers.add('fof-user-bio', () => {
  User.prototype.bio = Model.attribute('bio');
  User.prototype.bioHtml = Model.attribute('bioHtml');

  extend(UserCard.prototype, 'infoItems', function (items) {
    let user = this.attrs.user;

    if (!user.attribute('canViewBio')) {
      return;
    }

    items.add('bio', <UserBio user={user} />, -100);
  });
});
