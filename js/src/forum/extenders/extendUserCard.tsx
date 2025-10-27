import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import UserCard from 'flarum/forum/components/UserCard';
import UserBio from '../components/UserBio';
import User from 'flarum/common/models/User';
import type Mithril from 'mithril';

export default function extendUserCard() {
  extend(UserCard.prototype, 'infoItems', function (items: ItemList<Mithril.Children>) {
    // @TODO: fix typing here after `UserCard` is typed properly
    // @ts-ignore
    const user = this.attrs.user as User;
    // @ts-ignore
    const canEdit = this.attrs.editable as boolean;

    if (!user.attribute('canViewBio')) {
      return;
    }

    items.add('bio', <UserBio user={user} editable={canEdit} />, -100);
  });
}
