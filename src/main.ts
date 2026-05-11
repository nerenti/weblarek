import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { AppApi } from './components/communications/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// ==================== 1. ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ====================
console.log('========== ТЕСТ: CatalogModel ==========');

const catalogModel = new CatalogModel();

// Тест с локальными данными из data.ts
catalogModel.setProducts(apiProducts.items);
console.log('✅ Тестовые данные (apiProducts):', catalogModel.getProducts());

// Проверка getProductById
if (apiProducts.items && apiProducts.items.length > 0) {
  const testId = apiProducts.items[0].id;
  console.log(`🔍 Поиск товара по id="${testId}":`, catalogModel.getProductById(testId));
}

// Проверка selectedProduct
if (apiProducts.items && apiProducts.items.length > 0) {
  catalogModel.setSelectedProduct(apiProducts.items[0]);
  console.log('⭐ Выбранный товар:', catalogModel.getSelectedProduct());
}

console.log('\n========== ТЕСТ: CartModel ==========');

const cartModel = new CartModel();

if (apiProducts.items && apiProducts.items.length >= 2) {
  const productA = apiProducts.items[0];
  const productB = apiProducts.items[1];
  
  cartModel.addItem(productA);
  cartModel.addItem(productB);
  console.log('🛒 Товары в корзине:', cartModel.getItems());
  console.log('💰 Общая стоимость:', cartModel.getTotalPrice());
  console.log('🔢 Количество:', cartModel.getItemCount());
  console.log(`🔍 Товар "${productA.id}" в корзине?`, cartModel.contains(productA.id));
  
  cartModel.removeItem(productA.id);
  console.log('🗑️ После удаления:', cartModel.getItems());
  
  cartModel.clear();
  console.log('🧹 После очистки:', cartModel.getItems());
}

console.log('\n========== ТЕСТ: BuyerModel ==========');

const buyerModel = new BuyerModel();

//Тест с валидными данными
buyerModel.setData({ email: 'test@example.com', phone: '+123456789' });
buyerModel.setData({ address: 'ул. Тестовая, д.1' });
buyerModel.setData({ payment: 'card' });
console.log('👤 Данные покупателя:', buyerModel.getData());
console.log('✅ Валидация:', buyerModel.validate());

buyerModel.clear();
console.log('🧹 После очистки:', buyerModel.getData());

//Тест с невалидными данными
console.log('❌ Валидация', buyerModel.validate());


// ==================== 2. ЗАПРОС К СЕРВЕРУ ====================
console.log('\n========== ЗАПРОС К СЕРВЕРУ ==========');

console.log(`🌐 Адрес сервера: ${API_URL}`);

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// Выполняем запрос на сервер для получения товаров
appApi.getProducts()
  .then(response => {
    console.log('✅ Ответ сервера (полный объект):', response);
    
    // Извлекаем массив товаров из ответа
    const products = response.items;
    console.log('📦 Массив товаров, извлечённый из ответа:', products);
    
    // Сохраняем полученные товары в модель каталога
    catalogModel.setProducts(products);
    
    console.log('\n📦 Каталог после сохранения данных с сервера:');
    console.log(catalogModel.getProducts());
    console.log(`📊 Всего товаров в каталоге: ${catalogModel.getProducts().length}`);
  })
  .catch(error => {
    console.error('❌ Ошибка при получении товаров с сервера:', error);
  });