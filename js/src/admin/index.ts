import app from 'flarum/admin/app';

app.initializers.add('dcorlette13-flarum-userinfo', () => {
  app.registry
    .for('dcorlette13-flarum-userinfo')
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('dcorlette13-flarum-userinfo.admin.permission.view'),
        permission: 'dcorlette13-flarum-userinfo.view',
        allowGuest: true,
      },
      'view'
    )
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('dcorlette13-flarum-userinfo.admin.permission.editOwn'),
        permission: 'dcorlette13-flarum-userinfo.editOwn',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('dcorlette13-flarum-userinfo.admin.permission.editAny'),
        permission: 'dcorlette13-flarum-userinfo.editAny',
      },
      'moderate'
    )
    .registerSetting({
      label: app.translator.trans('dcorlette13-flarum-userinfo.admin.setting.bioLimit'),
      setting: 'dcorlette13-flarum-userinfo.maxLength',
      type: 'number',
      placeholder: 200,
    })
    .registerSetting({
      label: app.translator.trans('dcorlette13-flarum-userinfo.admin.setting.maxLines'),
      setting: 'dcorlette13-flarum-userinfo.maxLines',
      type: 'number',
      placeholder: 5,
      min: 5,
    })
    .registerSetting({
      label: app.translator.trans('dcorlette13-flarum-userinfo.admin.setting.allowFormatting'),
      help: app.translator.trans('dcorlette13-flarum-userinfo.admin.setting.allowFormatting_help'),
      setting: 'dcorlette13-flarum-userinfo.allowFormatting',
      type: 'boolean',
    });
});
