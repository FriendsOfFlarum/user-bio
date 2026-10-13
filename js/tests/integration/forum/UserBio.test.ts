import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import { jest } from '@jest/globals';
import app from 'flarum/forum/app';
import type User from 'flarum/common/models/User';
import RequestError from 'flarum/common/utils/RequestError';
import extend from '../../../src/forum/extend';
import UserBio from '../../../src/forum/components/UserBio';

beforeAll(() => {
  bootstrapForum();
  app.bootExtensions({ 'fof-user-bio': { extend } });
  app.boot();

  app.store.pushPayload({
    data: { type: 'users', id: '1', attributes: { bio: 'Old bio', canEditBio: true } },
  });
});

afterEach(() => jest.restoreAllMocks());

// Jest fails the test if a rejection goes unhandled, which Node reports only
// once the microtask queue has drained.
const settle = () => new Promise((resolve) => setTimeout(resolve, 10));

/** The bio on a profile its owner can edit, opened for editing. */
function editBio(): HTMLElement {
  const user = app.store.getById<User>('users', '1')!;
  const root = document.createElement('div');
  document.body.appendChild(root);

  m.mount(root, { view: () => m(UserBio, { user, editable: true }) });

  root.querySelector<HTMLElement>('.UserBio-content')!.click();

  return root;
}

describe('saving a bio', () => {
  test('that fails, reopens the editor with what was written', async () => {
    const root = editBio();
    const user = app.store.getById<User>('users', '1')!;
    jest.spyOn(user, 'save').mockImplementation(() => Promise.reject(new RequestError(422, '', { url: '/api/users/1' } as any, {} as any)));

    root.querySelector('textarea')!.value = 'New bio';
    root.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));

    await settle();

    expect(root.querySelector('textarea')?.value).toBe('New bio');
    expect(root.querySelector('.LoadingIndicator')).toBeNull();
  });
});
