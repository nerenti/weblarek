import { IProduct } from '../../../types/index';

/**
 * Модель корзины покупателя
 * Отвечает за хранение товаров, выбранных для покупки, и операции над ними
 */
export class CartModel {
  // Массив товаров, добавленных в корзину
  private items: IProduct[] = [];

  /**
   * Возвращает массив товаров, находящихся в корзине
   * @returns копия массива товаров в корзине
   */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * Добавляет товар в корзину
   * Если товар с таким же id уже есть в корзине, он не добавляется повторно
   * @param product - товар для добавления
   */
  addItem(product: IProduct): void {
    // Проверяем, есть ли уже такой товар в корзине
    const exists = this.items.some(item => item.id === product.id);
    if (!exists) {
      this.items.push(product);
    }
  }

  /**
   * Удаляет товар из корзины по его идентификатору
   * @param productId - идентификатор товара для удаления
   */
  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  /**
   * Полностью очищает корзину (удаляет все товары)
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Вычисляет общую стоимость всех товаров в корзине
   * Если у товара price === null, он считается стоимостью 0
   * @returns общая стоимость
   */
  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      const price = item.price ?? 0;
      return total + price;
    }, 0);
  }

  /**
   * Возвращает количество товаров в корзине
   * @returns количество товаров
   */
  getItemCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет, есть ли товар с указанным id в корзине
   * @param productId - идентификатор товара
   * @returns true, если товар есть в корзине, иначе false
   */
  contains(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}