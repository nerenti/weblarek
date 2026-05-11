import { IApi } from '../../types/index';
import { IProduct, IProductsResponse, IOrder, IOrderResult } from '../../types/index';

/**
 * Класс для коммуникации с сервером «Веб-ларёк»
 * Использует композицию: принимает объект с методами get/post
 */
export class AppApi {
  constructor(protected baseApi: IApi) {}

  /**
   * Получить список всех товаров с сервера
   * GET /product/
   * @returns Promise с массивом товаров
   */
  async getProducts(): Promise<IProduct[]> {
    const response = await this.baseApi.get<IProductsResponse>('/product/');
    return response.items;
  }

  /**
   * Отправить заказ на сервер
   * POST /order
   * @param order - данные заказа (без total)
   * @returns Promise с результатом (id и total)
   */
  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this.baseApi.post<IOrderResult>('/order', order);
  }
}