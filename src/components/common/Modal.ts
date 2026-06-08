import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

/**
 * Компонент модального окна
 * Не имеет наследников
 */
export class Modal extends Component<{ content: HTMLElement }> {
    protected _closeButton: HTMLButtonElement | null;
    protected _content: HTMLElement | null;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this._closeButton = container.querySelector('.modal__close');
        this._content = container.querySelector('.modal__content');
        
        this.setupEventListeners();
    }

    protected setupEventListeners(): void {
        // Закрытие по клику на крестик
        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => this.close());
        }

        // Закрытие по клику на оверлей
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    protected isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    protected lockScroll(lock: boolean): void {
        if (lock) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.lockScroll(true);
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.lockScroll(false);
        this.clearContent();
        this.events.emit('modal:close');
    }

    set content(value: HTMLElement) {
        if (this._content) {
            this._content.innerHTML = '';
            this._content.appendChild(value);
        }
    }

    protected clearContent(): void {
        if (this._content) {
            this._content.innerHTML = '';
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}