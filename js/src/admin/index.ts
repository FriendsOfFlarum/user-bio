import app from 'flarum/admin/app';

app.initializers.add('fof-user-bio', () => {
  app.extensionData
    .for('fof-user-bio')
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('fof-user-bio.admin.permission.view'),
        permission: 'fof-user-bio.view',
        allowGuest: true,
      },
      'view'
    )
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('fof-user-bio.admin.permission.editOwn'),
        permission: 'fof-user-bio.editOwn',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('fof-user-bio.admin.permission.editAny'),
        permission: 'fof-user-bio.editAny',
      },
      'moderate'
    )
    .registerSetting({
      label: app.translator.trans('fof-user-bio.admin.setting.bioLimit'),
      setting: 'fof-user-bio.maxLength',
      type: 'number',
      placeholder: 200,
    })
    .registerSetting({
      label: app.translator.trans('fof-user-bio.admin.setting.maxLines'),
      setting: 'fof-user-bio.maxLines',
      type: 'number',
      placeholder: 5,
      min: 5,
    })
    .registerSetting({
      label: app.translator.trans('fof-user-bio.admin.setting.allowFormatting'),
      help: app.translator.trans('fof-user-bio.admin.setting.allowFormatting_help'),
      setting: 'fof-user-bio.allowFormatting',
      type: 'boolean',
    });
});
