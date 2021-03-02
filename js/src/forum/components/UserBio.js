import app from 'flarum/common/app';
import Component from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';

/**
 * The `UserBio` component displays a user's bio, optionally letting the user
 * edit it.
 */
export default class UserBio extends Component {
    oninit(vnode) {
        super.oninit(vnode);
        /**
         * Whether or not the bio is currently being edited.
         *
         * @type {Boolean}
         */
        this.editing = false;

        /**
         * Whether or not the bio is currently being saved.
         *
         * @type {Boolean}
         */
        this.loading = false;

        /**
         * The max configured character count the bio may be
         */
        this.bioMaxLength = app.forum.attribute('fof-user-bio.maxLength');

        /**
         * The placeholder shown in the bio textbox when no input is set.
         */
        this.bioPlaceholder =
            app.session && app.session.user && app.session.user.id() === this.attrs.user.id()
                ? // Normal placeholder if they're looking at their own profile
                  app.translator.trans('fof-user-bio.forum.userbioPlaceholder')
                : // Special placeholder if someone else is viewing their profile with edit access
                  app.translator.trans('fof-user-bio.forum.userbioPlaceholderOtherUser', {
                      username: this.attrs.user.username(),
                  });
    }

    view() {
        const user = this.attrs.user;
        const editable = this.attrs.user.attribute('canEditBio');
        let content;

        if (this.editing) {
            content = (
                <textarea
                    className="FormControl"
                    placeholder={extractText(this.bioPlaceholder)}
                    rows="3"
                    maxlength={this.bioMaxLength}
                    value={user.bio()}
                />
            );
        } else {
            let subContent;

            if (this.loading) {
                subContent = <p className="UserBio-placeholder">{LoadingIndicator.component({ size: 'tiny' })}</p>;
            } else {
                const bioHtml = user.bioHtml();

                if (bioHtml) {
                    subContent = m.trust(bioHtml);
                } else if (editable) {
                    subContent = <p className="UserBio-placeholder">{this.bioPlaceholder}</p>;
                }
            }

            content = (
                <div className="UserBio-content" onclick={editable ? this.edit.bind(this) : () => undefined}>
                    {subContent}
                </div>
            );
        }

        return (
            <div
                className={
                    'UserBio ' +
                    classList({
                        editable,
                        editing: this.editing,
                    })
                }
            >
                {content}
            </div>
        );
    }

    /**
     * Edit the bio.
     */
    edit() {
        this.editing = true;
        m.redraw.sync();

        const bio = this;
        const save = function(e) {
            if (e.shiftKey) return;
            e.preventDefault();
            bio.save($(this).val());
        };

        this.$('textarea')
            .focus()
            .bind('blur', save)
            .bind('keydown', 'return', save);
        m.redraw();
    }

    /**
     * Save the bio.
     *
     * @param {String} value
     */
    save(value) {
        const user = this.attrs.user;

        if (user.bio() !== value) {
            this.loading = true;

            user.save({ bio: value })
                .catch(() => {})
                .then(() => {
                    this.loading = false;
                    m.redraw();
                });
        }

        this.editing = false;
        m.redraw();
    }
}
