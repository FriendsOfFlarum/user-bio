import app from 'flarum/app';

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
                icon: 'fas pa-pen',
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
        );
});
