import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
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
     * Whether the bio is currently being edited.
     *
     * @type {boolean}
     */
    this.editing = false;

    /**
     * Whether the bio is currently being saved.
     *
     * @type {boolean}
     */
    this.loading = false;

    /**
     * The rows to show in the textarea by default when editing.
     * This is set to 5 by default, but can be overridden by the `--bio-max-lines` CSS variable.
     *
     * @type {string}
     */
    this.textareaRows = '5';

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
    const editable = this.attrs.editable && this.attrs.user.attribute('canEditBio');
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
          rows={this.textareaRows}
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

      const maxLines = app.forum.attribute('fof-user-bio.maxLines') || 5;

      content = (
        <div
          className="UserBio-content"
          // onclick={editable ? this.edit.bind(this) : () => undefined}
          onclick={editable ? this.edit.bind(this) : () => undefined}
          onkeydown={editable ? this.onkeydown.bind(this) : () => undefined}
          style={{ '--bio-max-lines': maxLines }}
          role={editable ? 'button' : undefined}
          tabindex={editable ? '0' : undefined}
          aria-label={editable ? app.translator.trans('fof-user-bio.forum.profile.edit_bio_label') : undefined}
        >
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
        {this.editing && (
          <div className="UserBio-actions">
            <Button className="Button Button--primary" onclick={this.save.bind(this)}>
              {app.translator.trans('fof-user-bio.forum.profile.save_button')}
            </Button>
            <Button className="Button" onclick={this.reset.bind(this)}>
              {app.translator.trans('fof-user-bio.forum.profile.cancel_button')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  onkeydown(e) {
    // Allow keyboard navigation to turn editing mode on
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.edit(e);
    }
  }

  /**
   * Edit the bio.
   * @param {MouseEvent} e
   */
  edit(e) {
    // Maintain the scroll position & cursor position when editing
    const selection = window.getSelection();
    const lineIndex = selection.anchorOffset;
    let lengthBefore = 0;

    for (let prev = selection.anchorNode.previousSibling; prev; prev = prev.previousSibling) {
      lengthBefore += prev.textContent.length;
    }

    const currentScroll = e.target.scrollTop;
    const index = lengthBefore + lineIndex;

    // Show the same number of lines to avoid layout shift
    this.textareaRows = getComputedStyle(e.target).getPropertyValue('--bio-max-lines') || '5';

    this.editing = true;
    m.redraw.sync();

    this.$('textarea').trigger('focus').prop('selectionStart', index).prop('selectionEnd', index).prop('scrollTop', currentScroll);
  }

  /**
   * Save the bio.
   */
  save() {
    const value = this.$('textarea').val();
    const user = this.attrs.user;
    const tempSelector = this.$('textarea').prop('selectionStart');

    // Don't constantly try to save when blurring textarea
    if (this.isDirty()) {
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

    this.editing = false;
    m.redraw();
  }

  reset() {
    // Either nothing changed or we want to confirm the loss of changes
    if (!this.isDirty() || confirm(extractText(app.translator.trans('fof-user-bio.forum.profile.cancel_confirm')))) {
      this.editing = false;
      delete this.tempBio;
      m.redraw();
    }
  }

  isDirty() {
    const value = this.$('textarea').val();
    const user = this.attrs.user;

    return user.bio() !== value;
  }
}
