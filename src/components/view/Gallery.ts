import { Component } from '../base/Component';

export class Gallery extends Component<HTMLElement> {
    constructor(container: HTMLElement) {
        super(container);
        // container уже является элементом .gallery, не нужно искать внутри
    }

    set items(cards: HTMLElement[]) {
        // Используем this.container напрямую
        this.container.replaceChildren(...cards);
    }

    render(): HTMLElement {
        return this.container;
    }
}