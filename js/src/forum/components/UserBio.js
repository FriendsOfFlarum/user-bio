import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 8; i++) {
    years.push(currentYear + i);
  }
  return years;
}

/**
 * The `UserBio` component displays a user's bio (students), optionally letting the user
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
    this.selectedYears = new Set();
  }

  getSelectedYearsFromUser() {
    const bio = this.attrs.user.bio() || '';
    return new Set(
      bio.split(',').map(y => y.trim()).filter(y => y.length > 0)
    );
  }

  view() {
    const user = this.attrs.user;
    const editable = this.attrs.editable && user.attribute('canEditBio');
    const years = getYearOptions();
    let content;

    if (this.editing) {
      const currentSelections = this.selectedYears;

      content = (
        <form onsubmit={this.save.bind(this)}>
          <div className="UserBio-checkboxes">
            {years.map(year => (
              <label className="UserBio-checkbox-label">
                <input
                  type="checkbox"
                  value={String(year)}
                  checked={currentSelections.has(String(year))}
                  onchange={this.onCheckboxChange.bind(this)}
                />
                {' '}{year}
              </label>
            ))}
          </div>
          <div className="UserBio-actions">
            <Button className="Button Button--primary" type="submit">
              {app.translator.trans('dcorlette13-flarum-userinfo.forum.profile.save_button')}
            </Button>
            <Button className="Button" type="reset" onclick={this.reset.bind(this)}>
              {app.translator.trans('dcorlette13-flarum-userinfo.forum.profile.cancel_button')}
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
        const bio = user.bio() || '';
        const selectedYears = bio.split(',').map(y => y.trim()).filter(y => y.length > 0);

        if (selectedYears.length > 0) {
          subContent = (
            <ul className="UserBio-year-list">
              {selectedYears.map(year => <li>{year}</li>)}
            </ul>
          );
        } else if (editable) {
          subContent = (
            <p className="UserBio-placeholder">
              {app.translator.trans('dcorlette13-flarum-userinfo.forum.userbioPlaceholder')}
            </p>
          );
        }
      }

      content = (
        <div
          className="UserBio-content"
          onclick={editable ? this.edit.bind(this) : undefined}
          onkeydown={editable ? this.onkeydown.bind(this) : undefined}
          role={editable ? 'button' : undefined}
          tabindex={editable ? '0' : undefined}
          aria-label={editable ? app.translator.trans('dcorlette13-flarum-userinfo.forum.profile.edit_bio_label') : undefined}
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

  onCheckboxChange(e) {
    const year = e.target.value;
    if (e.target.checked) {
      this.selectedYears.add(year);
    } else {
      this.selectedYears.delete(year);
    }
    // Sort numerically for consistent storage order
    this.selectedYears = new Set(
      [...this.selectedYears].sort((a, b) => Number(a) - Number(b))
    );
    m.redraw();
  }

  onkeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.edit(e);
    }
  }

  edit(e) {
    if (e && (e.ctrlKey || e.metaKey)) return;
    if (e) e.preventDefault();
    this.selectedYears = this.getSelectedYearsFromUser();
    this.editing = true;
    m.redraw();
  }

  save(e) {
    e.preventDefault();
    const user = this.attrs.user;
    const value = [...this.selectedYears].join(',');

    this.loading = true;
    this.editing = false;
    m.redraw();

    user
      .save({ bio: value })
      .then(() => {
        this.loading = false;
        m.redraw();
      })
      .catch(() => {
        this.loading = false;
        this.editing = true;
        m.redraw();
      });
  }

  reset(e) {
    e.preventDefault();
    this.editing = false;
    this.selectedYears = this.getSelectedYearsFromUser();
    m.redraw();
  }
}