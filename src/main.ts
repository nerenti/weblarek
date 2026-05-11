import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { CatalogModel } from './components/base/models/CatalogModel';
import { CartModel } from './components/base/models/CartModel';
import { BuyerModel } from './components/base/models/BuyerModel';
import { AppApi } from './components/base/AppApi';
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

buyerModel.setData({ email: 'test@example.com', phone: '+123456789' });
buyerModel.setData({ address: 'ул. Тестовая, д.1' });
buyerModel.setData({ payment: 'card' });
console.log('👤 Данные покупателя:', buyerModel.getData());
console.log('✅ Валидация:', buyerModel.validate());

buyerModel.clear();
console.log('🧹 После очистки:', buyerModel.getData());

// ==================== 2. ЗАПРОС К СЕРВЕРУ ====================
console.log('\n========== ЗАПРОС К СЕРВЕРУ ==========');

// Проверяем, что URL загрузился
console.log(`🌐 Адрес сервера: ${API_URL}`);

// Создаём экземпляр базового Api с URL из constants.ts
const baseApi = new Api(API_URL);

// Создаём экземпляр AppApi
const appApi = new AppApi(baseApi);

// Выполняем запрос на сервер для получения товаров
appApi.getProducts()
  .then(products => {
    console.log('✅ Товары успешно получены с сервера:');
    console.log(products);
    
    // Сохраняем полученные товары в модель каталога (заменяем тестовые данные)
    catalogModel.setProducts(products);
    
    console.log('\n📦 Каталог после сохранения данных с сервера:');
    console.log(catalogModel.getProducts());
    console.log(`📊 Всего товаров в каталоге: ${catalogModel.getProducts().length}`);
  })
  .catch(error => {
    console.error('❌ Ошибка при получении товаров с сервера:', error);
  });