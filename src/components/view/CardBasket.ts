import { CardBasket as BaseCardBasket } from '../common/CardBasket';

export class CardBasket extends BaseCardBasket {
    constructor(container: HTMLElement, onRemove: () => void) {
        super(container, onRemove);
    }
}