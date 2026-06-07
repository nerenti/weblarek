import { Card } from '../common/Card';
import { EventEmitter } from '../base/Events';

export class CardModal extends Card {
    protected _description: HTMLElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        
        this._description = container.querySelector('.card__text');
        
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('preview:toggle');
            });
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    render(): HTMLElement {
        return this.container;
    }
}