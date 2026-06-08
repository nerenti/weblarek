import { Component } from '../base/Component';

export class Header extends Component<HTMLElement> {
    protected _counter: HTMLElement | null;
    protected _cartIcon: HTMLElement | null;

    constructor(container: HTMLElement, onCartClick: () => void) {
        super(container);
        
        this._counter = container.querySelector('.header__basket-counter');
        this._cartIcon = container.querySelector('.header__basket');
        
        if (this._cartIcon) {
            this._cartIcon.addEventListener('click', onCartClick);
        }
    }

    protected setText(element: HTMLElement | null, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    render(): HTMLElement {
        return this.container;
    }
}