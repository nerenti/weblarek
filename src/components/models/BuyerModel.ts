import { IBuyer, TPayment, ValidationErrors } from '../../types/index';

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

  /**
   * Сохраняет данные покупателя (частично или полностью)
   * @param data - объект с любым набором полей IBuyer
   * @example
   * buyerModel.setData({ email: 'user@example.com' }); // обновит только email
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
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
  }

  /**
   * Проверяет валидность каждого поля, сохранённого в модели
   * Поле считается валидным, если оно не пустое:
   * - строки не должны быть пустыми
   * - payment не должен быть null
   * @returns объект с ошибками: ключ = поле, значение = текст ошибки.
   *          Если поле валидно, оно отсутствует в возвращаемом объекте.
   * @example
   * // Возвращает { payment: 'Не выбран вид оплаты', email: 'Укажите email' }
   * // если payment === null и email === ''
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