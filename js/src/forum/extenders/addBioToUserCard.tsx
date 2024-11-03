import { extend } from 'flarum/common/extend';
import UserCard from 'flarum/forum/components/UserCard';
import UserBio from './../components/UserBio';

import type Mithril from 'mithril';
import type ItemList from 'flarum/common/utils/ItemList';
import type User from 'flarum/common/models/User';

export default function addBioToUserCard() {
  extend(UserCard.prototype, 'infoItems', function (items: ItemList<Mithril.Children>) {
    const user: User = (this as any).attrs.user;

    if (!user.canViewBio()) return;

    items.add('bio', <UserBio user={user} editable={(this as any).attrs.editable} />, -100);
  });
}
