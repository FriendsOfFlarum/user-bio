/**
 * The `UserBio` component displays a user's bio, optionally letting the user
 * edit it.
 */
export default class UserBio extends Component<any, undefined> {
    constructor();
    oninit(vnode: any): void;
    /**
     * Whether the bio is currently being edited.
     *
     * @type {boolean}
     */
    editing: boolean | undefined;
    /**
     * Whether the bio is currently being saved.
     *
     * @type {boolean}
     */
    loading: boolean | undefined;
    /**
     * The rows to show in the textarea by default when editing.
     * This is set to 5 by default, but can be overridden by the `--bio-max-lines` CSS variable.
     *
     * @type {string}
     */
    textareaRows: string | undefined;
    /**
     * The max configured character count the bio may be
     */
    bioMaxLength: unknown;
    /**
     * The placeholder shown in the bio textbox when no input is set.
     */
    bioPlaceholder: string | any[] | undefined;
    view(): JSX.Element;
    onkeydown(e: any): void;
    /**
     * Edit the bio.
     * @param {MouseEvent} e
     */
    edit(e: MouseEvent): void;
    /**
     * Save the bio.
     */
    save(e: any): void;
    tempBio: string | number | string[] | undefined;
    tempSelector: any;
    reset(e: any): void;
    isDirty(): boolean;
    /**
     *
     * @param {Node} anchorNode
     * @returns {number}
     */
    countTextLengthBefore(anchorNode: Node): number;
}
import Component from "flarum/common/Component";
