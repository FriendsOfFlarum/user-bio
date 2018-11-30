import { extend } from 'flarum/extend';
import 'autolink-js'
import computed from 'flarum/utils/computed';
import UserCard from 'flarum/components/UserCard';
import User from 'flarum/models/User';
import Model from 'flarum/Model';
import UserBio from './components/UserBio';

app.initializers.add('fof-user-bio', () => {
    User.prototype.bio = Model.attribute('bio');
    User.prototype.bioHtml = computed('bio', bio => bio ? '<p>' + $('<div/>').text(bio).html().replace(/\n/g, '<br>').autoLink({rel: 'nofollow'}) + '</p>' : '');

    extend(UserCard.prototype, 'infoItems', function(items) {
        let user = this.props.user;
        items.add('bio',
            UserBio.component({
                user,
                editable: this.props.editable
            })
        );
    });
});
