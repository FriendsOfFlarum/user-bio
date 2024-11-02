import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';

import type Mithril from 'mithril';
import type User from 'flarum/common/models/User';
import type { NestedStringArray } from '@askvortsov/rich-icu-message-formatter';

export interface UserBioAttrs extends ComponentAttrs {
  user: User;
  editable: boolean;
}

export default class UserBio extends Component<UserBioAttrs> {
  editing: boolean = false;
  loading: boolean = false;
  textareaRows: string = '5';
  bioMaxLength: number = 200;
  bioPlaceholder: string | NestedStringArray = '';
  tempBio: unknown;
  tempSelector: number | undefined;

  oninit(vnode: Mithril.Vnode<UserBioAttrs>): void {
    super.oninit(vnode);

    /**
     * The max configured character count the bio may be
     */
    this.bioMaxLength = app.forum.attribute<number>('fof-user-bio.maxLength');

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

  view(): Mithril.Children {
    const user = this.attrs.user;
    const editable = this.attrs.editable && this.attrs.user.canEditBio();

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
        <form onsubmit={this.save.bind(this)}>
          <textarea
            className="FormControl"
            placeholder={extractText(this.bioPlaceholder)}
            rows={this.textareaRows}
            maxlength={this.bioMaxLength}
            oncreate={focusIfErrored}
          />
          <div className="UserBio-actions">
            <Button className="Button Button--primary" type="submit">
              {app.translator.trans('fof-user-bio.forum.profile.save_button')}
            </Button>
            <Button className="Button" type="reset" onclick={this.reset.bind(this)}>
              {app.translator.trans('fof-user-bio.forum.profile.cancel_button')}
            </Button>
          </div>
        </form>
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

      const maxLines = app.forum.attribute<number>('fof-user-bio.maxLines') || 5;

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
      </div>
    );
  }

  onkeydown(e: KeyboardEvent): void {
    // Allow keyboard navigation to turn editing mode on
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.edit(e);
    }
  }

  /**
   * Edit the bio.
   */
  edit(e: PointerEvent | KeyboardEvent | SubmitEvent): void {
    // If the click is special, do not switch to editing mode.
    // e.g. allows for Ctrl+Click to open a link in a new tab
    if ((e as KeyboardEvent).ctrlKey || (e as KeyboardEvent).metaKey) return;

    e.preventDefault();

    // Maintain the scroll position & cursor position when editing
    const selection = window.getSelection();
    const lineIndex = selection?.anchorOffset;

    // Sometimes, links are clicked and the anchorNode is either null or the UserBio-content itself
    const clickedNode = !selection?.anchorNode || !e.target.className.includes('UserBio') ? e.target : selection.anchorNode;
    const lengthBefore = this.countTextLengthBefore(clickedNode);

    const currentScroll = e.currentTarget.scrollTop;
    const index = lengthBefore + lineIndex;

    // Show the same number of lines to avoid layout shift
    this.textareaRows = getComputedStyle(e.currentTarget).getPropertyValue('--bio-max-lines') || '5';

    this.editing = true;
    m.redraw.sync();

    this.$('textarea').trigger('focus').prop('selectionStart', index).prop('selectionEnd', index).prop('scrollTop', currentScroll);
  }

  /**
   * Save the bio.
   */
  save(e: SubmitEvent): void {
    e.preventDefault();

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

  reset(e: PointerEvent): void {
    // Don't want to actually reset the form
    e.preventDefault();

    // Either nothing changed or we want to confirm the loss of changes
    if (!this.isDirty() || confirm(extractText(app.translator.trans('fof-user-bio.forum.profile.cancel_confirm')))) {
      this.editing = false;
      delete this.tempBio;
      m.redraw();
    }
  }

  isDirty(): boolean {
    const value = this.$('textarea').val();
    const user = this.attrs.user;

    return user.bio() !== value;
  }

  countTextLengthBefore(anchorNode: Node): number {
    if (!anchorNode || (anchorNode instanceof HTMLElement && anchorNode.className.includes('UserBio'))) return 0;

    let length = 0;

    if (anchorNode.previousSibling) {
      for (let prev = anchorNode.previousSibling; prev; prev = prev.previousSibling) {
        length += prev.textContent.length;
      }
    }

    // We need to recursively call this function if the anchorNode is not a direct child of UserBio-content
    return length + this.countTextLengthBefore(anchorNode.parentNode);
  }
}
