import app from 'flarum/forum/app';
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
            username: this.attrs.user.displayName(),
          });
  }

  view() {
    const user = this.attrs.user;
    const editable = this.attrs.user.attribute('canEditBio');
    let content;

    if (this.editing) {
      const tempBio = this.tempBio;
      const value = tempBio ?? user.bio();

      const focusIfErrored = (vnode) => {
        const textarea = vnode.dom;

        textarea.value = value;

        if (tempBio !== undefined) {
          textarea.value = tempBio;
          textarea.focus();

          if (this.tempSelector !== undefined) {
            textarea.selectionStart = this.tempSelector;
            textarea.selectionEnd = this.tempSelector;

            delete this.tempSelector;
          }
        }
      };

      content = (
        <textarea
          className="FormControl"
          placeholder={extractText(this.bioPlaceholder)}
          rows="3"
          maxlength={this.bioMaxLength}
          oncreate={focusIfErrored}
        />
      );
    } else {
      let subContent;

      if (this.loading) {
        subContent = (
          <p className="UserBio-placeholder">
            <LoadingIndicator />
          </p>
        );
      } else {
        const bioHtml = user.bioHtml();

        if (bioHtml) {
          subContent = m.trust(bioHtml);
        } else if (user.bio()) {
          subContent = m.trust('<p>' + $('<div/>').text(user.bio()).html().replace(/\n/g, '<br>').autoLink({ rel: 'nofollow ugc' }) + '</p>');
        } else if (editable) {
          subContent = <p className="UserBio-placeholder">{this.bioPlaceholder}</p>;
        }
      }

      const maxLines = app.forum.attribute('fof-user-bio.maxLines');

      content = (
        <div className="UserBio-content" onclick={editable ? this.edit.bind(this) : () => undefined} style={{ '--bio-max-lines': maxLines }}>
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
    const save = function (e) {
      if (e.shiftKey) return;
      e.preventDefault();

      bio.save(e.target.value, e.type === 'blur');
    };

    this.$('textarea').trigger('focus').on('blur', save).bind('keydown', 'return', save);
    m.redraw();
  }

  /**
   * Save the bio.
   *
   * @param {String} value
   */
  save(value, wasBlurred) {
    const user = this.attrs.user;
    const tempSelector = this.$('textarea').prop('selectionStart');

    const shouldIgnore = wasBlurred && value === this.tempBio;

    // Don't constantly try to save when blurring textarea
    if (!shouldIgnore && user.bio() !== value) {
      this.loading = true;

      user
        .save({ bio: value })
        .catch(() => {
          this.tempBio = value;
          this.tempSelector = tempSelector;
          this.edit();
        })
        .then(() => {
          this.loading = false;
          delete this.tempBio;
          m.redraw();
        });
    }

    if (shouldIgnore) {
      delete this.tempBio;
    }

    this.editing = false;
    m.redraw();
  }
}
