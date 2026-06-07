import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

/**
 * Компонент модального окна
 * Не имеет наследников
 */
export class Modal extends Component<{}> {
    protected modal: HTMLElement;
    protected content: HTMLElement;
    protected closeButton: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        // Находим элементы внутри модального окна
        this.modal = container;
        this.content = container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = container.querySelector('.modal__close') as HTMLElement;

        // Устанавливаем обработчики событий
        this.setupEventListeners();
    }

    protected setupEventListeners(): void {
        // Закрытие по клику на оверлей
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Закрытие по клику на крестик
        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    /**
     * Открывает модальное окно
     */
    open(): void {
        this.modal.classList.add('modal_active');
        this.events.emit('modal:open');
        this.lockScroll(true);
    }

    /**
     * Закрывает модальное окно
     */
    close(): void {
        this.modal.classList.remove('modal_active');
        this.events.emit('modal:close');
        this.lockScroll(false);
        this.clearContent();
    }

    /**
     * Устанавливает содержимое модального окна
     * @param content - HTML-элемент для отображения
     */
    setContent(content: HTMLElement): void {
        this.clearContent();
        this.content.appendChild(content);
    }

    /**
     * Очищает содержимое модального окна
     */
    protected clearContent(): void {
        while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
        }
    }

    /**
     * Проверяет, открыто ли модальное окно
     */
    protected isOpen(): boolean {
        return this.modal.classList.contains('modal_active');
    }

    /**
     * Блокирует/разблокирует скролл страницы
     * @param lock - true = блокировать, false = разблокировать
     */
    protected lockScroll(lock: boolean): void {
        if (lock) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    render(data?: {}): HTMLElement {
        return this.container;
    }
}