import { IBuyer, TPayment, ValidationErrors } from '../../types/index';
import { EventEmitter } from '../base/Events';

/**
 * Модель данных покупателя
 * Отвечает за хранение и валидацию данных, вводимых при оформлении заказа
 */
export class BuyerModel {
  // Выбранный способ оплаты (null, если не выбран)
  private payment: TPayment | null = null;
  
  // Адрес электронной почты
  private email: string = '';
  
  // Номер телефона
  private phone: string = '';
  
  // Адрес доставки
  private address: string = '';
  
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  /**
   * Сохраняет данные покупателя (частично или полностью)
   * @param data - объект с любым набором полей IBuyer
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events.emit('buyer:changed');
  }

  /**
   * Возвращает полные данные покупателя
   * @returns объект IBuyer (незаполненные поля — пустые строки или null)
   */
  getData(): IBuyer {
    return {
      payment: this.payment,     
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  /**
   * Очищает все данные покупателя (сбрасывает в начальное состояние)
   */
  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit('buyer:changed');
  }

  /**
   * Проверяет валидность каждого поля, сохранённого в модели
   */
  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (this.payment === null) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    if (!this.address.trim()) {
      errors.address = 'Необходимо указать адрес';
    }

    return errors;
  }
}