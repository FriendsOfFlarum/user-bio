import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('fof-user-bio', () => {
    extend(PermissionGrid.prototype, 'viewItems', (items) => {
        items.add('fof-user-bio-view', {
            icon: 'fas fa-pen',
            label: app.translator.trans('fof-user-bio.admin.permission.view'),
            permission: 'fof-user-bio.view',
            allowGuest: true,
        });
    });
    extend(PermissionGrid.prototype, 'startItems', (items) => {
        items.add('fof-user-bio-editOwn', {
            icon: 'fas fa-pen',
            label: app.translator.trans('fof-user-bio.admin.permission.editOwn'),
            permission: 'fof-user-bio.editOwn',
        });
    });
    extend(PermissionGrid.prototype, 'moderateItems', (items) => {
        items.add('fof-user-bio-editAny', {
            icon: 'fas fa-pen',
            label: app.translator.trans('fof-user-bio.admin.permission.editAny'),
            permission: 'fof-user-bio.editAny',
        });
    });
});
