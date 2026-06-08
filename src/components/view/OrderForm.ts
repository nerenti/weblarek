import { Form } from '../common/Form';
import { TPayment } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class OrderForm extends Form {
    protected _cardButton: HTMLButtonElement | null;
    protected _cashButton: HTMLButtonElement | null;
    protected _address: HTMLInputElement | null;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container);
        
        this._cardButton = container.querySelector('button[name=card]');
        this._cashButton = container.querySelector('button[name=cash]');
        this._address = container.querySelector('[name=address]');
        
        // Только эмитим события, не меняем себя
        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => {
                events.emit('order:payment', { payment: 'card' });
            });
        }
        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => {
                events.emit('order:payment', { payment: 'cash' });
            });
        }
        if (this._address) {
            this._address.addEventListener('input', () => {
                events.emit('order:address', { address: this._address?.value || '' });
            });
        }
        
        container.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit('order:next');
        });
    }

    /**
     * Устанавливает активную кнопку оплаты (вызывается из презентера)
     */
    setPaymentActive(value: TPayment) {
        if (value === 'card' && this._cardButton && this._cashButton) {
            this._cardButton.classList.add('button_alt-active');
            this._cashButton.classList.remove('button_alt-active');
        } else if (value === 'cash' && this._cardButton && this._cashButton) {
            this._cashButton.classList.add('button_alt-active');
            this._cardButton.classList.remove('button_alt-active');
        }
    }

    set address(value: string) {
        if (this._address) {
            this._address.value = value;
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}