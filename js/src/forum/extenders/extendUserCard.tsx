import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import UserCard from 'flarum/forum/components/UserCard';
import UserBio from '../components/UserBio';
import type Mithril from 'mithril';

export default function extendUserCard() {
  extend(UserCard.prototype, 'infoItems', function (items: ItemList<Mithril.Children>) {
    const user = this.attrs.user;

    if (!user.attribute('canViewBio')) {
      return;
    }

    items.add('bio', <UserBio user={user} editable={this.attrs.editable} />, -100);
  });
}
