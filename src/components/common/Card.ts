import { BaseCard } from './BaseCard';
import { categoryMap } from '../../utils/constants';

/**
 * Карточка с кнопкой и категорией (для каталога и модального окна)
 */
export class Card extends BaseCard {
    protected _image: HTMLImageElement | null = null;
    protected _category: HTMLElement | null = null;
    protected _button: HTMLButtonElement | null = null;

    constructor(container: HTMLElement) {
        super(container);
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
    }

    protected setImage(element: HTMLImageElement | null, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            if (categoryClass) {
                this._category.className = `card__category ${categoryClass}`;
            }
        }
    }

    // Переопределяем price, чтобы управлять кнопкой
    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this._button.disabled = true;
                this._button.textContent = 'Недоступно';
            }
        } else {
            this.setText(this._price, `${value} синапсов`);
            // Не сбрасываем buttonText здесь — это делает презентер
            if (this._button) {
                this._button.disabled = false;
            }
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    get button(): HTMLButtonElement | null {
        return this._button;
    }
}