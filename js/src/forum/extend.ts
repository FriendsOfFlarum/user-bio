import Extend from 'flarum/common/extenders';
import User from 'flarum/common/models/User';

export default [
  new Extend.Model(User) //
    .attribute<string | null>('bio')
    .attribute<string | null>('bioHtml'),
];
