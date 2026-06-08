import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/Events';

/**
 * Модель каталога товаров
 * Отвечает за хранение всех доступных товаров и выбранного для просмотра товара
 */
export class CatalogModel {
  // Массив всех товаров в каталоге
  private products: IProduct[] = [];
  
  // Товар, выбранный для подробного просмотра (или null, если ничего не выбрано)
  private selectedProduct: IProduct | null = null;
  
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  /**
   * Сохраняет массив товаров (например, полученный с сервера)
   * @param products - массив товаров
   */
  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed');
  }

  /**
   * Возвращает массив всех товаров из каталога
   * @returns копия массива товаров
   */
  getProducts(): IProduct[] {
    return this.products;
  }

  /**
   * Возвращает товар по его id
   * @param id - идентификатор товара
   * @returns товар или undefined, если не найден
   */
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  /**
   * Сохраняет товар для детального отображения
   * @param product - товар для просмотра
   */
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('selected-product:changed');
  }

  /**
   * Возвращает сохранённый товар для детального просмотра
   * @returns товар или null, если ничего не выбрано
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}