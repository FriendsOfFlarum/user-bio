import Component from 'flarum/Component';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import classList from 'flarum/utils/classList';
import extractText from 'flarum/utils/extractText';

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
    }

    view() {
        const user = this.attrs.user;
        const editable = user.attribute('canEditBio');
        let content;

        if (this.editing) {
            content = (
                <textarea
                    className="FormControl"
                    placeholder={extractText(app.translator.trans('fof-user-bio.forum.userbioPlaceholder'))}
                    rows="3"
                    oncreate={this.setupTextarea.bind(this)}
                    value={user.bio()}
                />
            );
        } else {
            let subContent;

            if (this.loading) {
                subContent = (
                    <p className="UserBio-placeholder">
                        <LoadingIndicator size="tiny" />
                    </p>
                );
            } else {
                const bioHtml = user.bioHtml();

                if (bioHtml) {
                    subContent = m.trust(bioHtml);
                } else if (editable) {
                    subContent = <p className="UserBio-placeholder">{app.translator.trans('fof-user-bio.forum.userbioPlaceholder')}</p>;
                }
            }

            const canEdit = editable && !this.loading;

            content = (
                <div className="UserBio-content" onclick={canEdit && (() => (this.editing = true))}>
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
                        loading: this.loading,
                    })
                }
            >
                {content}
            </div>
        );
    }

    setupTextarea(vnode) {
        const save = (e) => {
            if (e.shiftKey) return;
            e.preventDefault();

            this.save(vnode.dom.value);
        };

        $(vnode.dom).focus().bind('blur', save).bind('keydown', 'return', save);
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
