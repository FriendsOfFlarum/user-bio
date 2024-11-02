import Extend from 'flarum/common/extenders';
import User from 'flarum/common/models/User';

export default [
  new Extend.Model(User) //
    .attribute<string>('bio')
    .attribute<string>('bioHtml'),
];
