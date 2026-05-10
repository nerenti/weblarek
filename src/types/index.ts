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