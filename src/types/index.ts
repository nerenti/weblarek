export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип для способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс товара
export interface IProduct {
  id: string;          // уникальный идентификатор товара
  description: string; // подробное описание
  image: string;       // ссылка на изображение
  title: string;       // название товара
  category: string;    // категория
  price: number | null;// цена (null = бесплатно или цена не задана)
}

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;   // способ оплаты
  email: string;       // электронная почта
  phone: string;       // номер телефона
  address: string;     // адрес доставки
}

// Ответ сервера при получении списка товаров (GET /product/)
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Данные заказа, отправляемые на сервер (POST /order)
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];      // массив id товаров
}

// Ответ сервера после оформления заказа (POST /order)
export interface IOrderResult {
  id: string;           // идентификатор заказа
  total: number;        // общая стоимость
}