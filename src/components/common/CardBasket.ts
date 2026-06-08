import { BaseCard } from './BaseCard';

/**
 * Карточка для корзины (только название, цена, индекс и кнопка удаления)
 */
export class CardBasket extends BaseCard {
    protected _index: HTMLElement | null;
    protected _deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);
        
        this._index = container.querySelector('.basket__item-index');
        this._deleteButton = container.querySelector('.basket__item-delete');
        
        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', onRemove);
        }
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    // price уже есть в BaseCard, но нужно переопределить, если хотим другое поведение
    // В базовом уже "Бесценно", здесь оставляем как есть
}