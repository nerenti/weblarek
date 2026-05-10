import { IProduct } from '../../../types/index.ts';

/**
 * Модель каталога товаров
 * Отвечает за хранение всех доступных товаров и выбранного для просмотра товара
 */
export class CatalogModel {
  // Массив всех товаров в каталоге
  private products: IProduct[] = [];
  
  // Товар, выбранный для подробного просмотра (или null, если ничего не выбрано)
  private selectedProduct: IProduct | null = null;

  /**
   * Сохраняет массив товаров (например, полученный с сервера)
   * @param products - массив товаров
   */
  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  /**
   * Возвращает массив всех товаров из каталога
   * @returns копия массива товаров
   */
  getProducts(): IProduct[] {
    return [...this.products];
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
  }

  /**
   * Возвращает сохранённый товар для детального просмотра
   * @returns товар или null, если ничего не выбрано
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}