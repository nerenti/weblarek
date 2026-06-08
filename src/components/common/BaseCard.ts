import { Component } from '../base/Component';

/**
 * Базовый класс для всех карточек
 * Содержит только общие для всех карточек поля: название и цена
 */
export abstract class BaseCard extends Component<object> {
    protected _title: HTMLElement | null = null;
    protected _price: HTMLElement | null = null;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
    }

    protected setText(element: HTMLElement | null, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}