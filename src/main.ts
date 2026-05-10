import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { CatalogModel } from './components/base/models/CatalogModel';
import { CartModel } from './components/base/models/CartModel';
import { BuyerModel } from './components/base/models/BuyerModel';

// ==================== 1. ТЕСТИРОВАНИЕ КАТАЛОГА ТОВАРОВ (CatalogModel) ====================
console.log('========== ТЕСТ: CatalogModel ==========');

const catalogModel = new CatalogModel();

// Проверка: сохранение массива товаров
console.log('1. Сохраняем товары из apiProducts.items в модель каталога');
catalogModel.setProducts(apiProducts.items);

// Проверка: получение всех товаров
console.log('2. Получаем массив всех товаров:');
console.log(catalogModel.getProducts());

// Проверка: получение товара по id (существующий id)
console.log('3. Ищем товар с id = "1" (если есть в ваших данных):');
const productById = catalogModel.getProductById('1');
console.log(productById);

// Проверка: получение товара по несуществующему id
console.log('4. Ищем товар с несуществующим id = "999":');
const notFoundProduct = catalogModel.getProductById('999');
console.log(notFoundProduct); // должно быть undefined

// Проверка: сохранение выбранного товара для подробного просмотра
if (apiProducts.items && apiProducts.items.length > 0) {
  const firstProduct = apiProducts.items[0];
  console.log('5. Сохраняем выбранный товар для детального просмотра:');
  console.log('   Выбранный товар:', firstProduct.title);
  catalogModel.setSelectedProduct(firstProduct);
  
  // Проверка: получение выбранного товара
  console.log('6. Получаем выбранный товар из модели:');
  console.log(catalogModel.getSelectedProduct());
}

console.log('\n');

// ==================== 2. ТЕСТИРОВАНИЕ КОРЗИНЫ (CartModel) ====================
console.log('========== ТЕСТ: CartModel ==========');

const cartModel = new CartModel();

// Проверка: начальное состояние (пустая корзина)
console.log('1. Начальное состояние корзины:');
console.log('   Товары:', cartModel.getItems());
console.log('   Количество:', cartModel.getItemCount());
console.log('   Общая стоимость:', cartModel.getTotalPrice());

// Проверка: добавление товаров в корзину
if (apiProducts.items && apiProducts.items.length >= 2) {
  const productA = apiProducts.items[0];
  const productB = apiProducts.items[1];
  
  console.log('2. Добавляем товар:', productA.title);
  cartModel.addItem(productA);
  
  console.log('3. Добавляем товар:', productB.title);
  cartModel.addItem(productB);
  
  console.log('4. Товары в корзине после добавления:');
  console.log(cartModel.getItems());
  console.log('   Количество:', cartModel.getItemCount());
  console.log('   Общая стоимость:', cartModel.getTotalPrice());
  
  // Проверка: повторное добавление того же товара (не должно дублироваться)
  console.log('5. Пытаемся добавить уже существующий товар ещё раз:', productA.title);
  cartModel.addItem(productA);
  console.log('   Товары в корзине (дубликата не должно быть):');
  console.log(cartModel.getItems());
  console.log('   Количество:', cartModel.getItemCount());
  
  // Проверка: наличие товара в корзине (contains)
  console.log('6. Проверяем наличие товара в корзине по id:');
  console.log(`   Товар с id="${productA.id}" в корзине?`, cartModel.contains(productA.id));
  console.log(`   Товар с id="fake-id" в корзине?`, cartModel.contains('fake-id'));
  
  // Проверка: удаление товара из корзины
  console.log('7. Удаляем товар:', productA.title);
  cartModel.removeItem(productA.id);
  console.log('   Товары в корзине после удаления:');
  console.log(cartModel.getItems());
  console.log('   Количество:', cartModel.getItemCount());
  console.log('   Общая стоимость:', cartModel.getTotalPrice());
  
  // Проверка: очистка корзины
  console.log('8. Очищаем корзину полностью');
  cartModel.clear();
  console.log('   Товары в корзине после очистки:', cartModel.getItems());
  console.log('   Количество:', cartModel.getItemCount());
  console.log('   Общая стоимость:', cartModel.getTotalPrice());
}

console.log('\n');

// ==================== 3. ТЕСТИРОВАНИЕ ДАННЫХ ПОКУПАТЕЛЯ (BuyerModel) ====================
console.log('========== ТЕСТ: BuyerModel ==========');

const buyerModel = new BuyerModel();

// Проверка: начальное состояние
console.log('1. Начальное состояние данных покупателя:');
console.log(buyerModel.getData());

// Проверка: валидация пустых данных
console.log('2. Валидация пустых данных:');
console.log('   Ошибки:', buyerModel.validate());

// Проверка: частичное сохранение данных (setData с частичным объектом)
console.log('3. Сохраняем только email и телефон:');
buyerModel.setData({ email: 'test@example.com', phone: '+123456789' });
console.log('   Текущие данные:', buyerModel.getData());

console.log('4. Сохраняем только адрес (остальные поля остаются прежними):');
buyerModel.setData({ address: 'ул. Тестовая, д.1' });
console.log('   Текущие данные:', buyerModel.getData());

console.log('5. Сохраняем способ оплаты:');
buyerModel.setData({ payment: 'card' });
console.log('   Текущие данные:', buyerModel.getData());

// Проверка: валидация после частичного заполнения
console.log('6. Валидация после частичного заполнения:');
console.log('   Ошибки:', buyerModel.validate());

// Проверка: полное заполнение данных
console.log('7. Полностью заполняем все поля:');
buyerModel.setData({
  payment: 'cash',
  email: 'full@example.com',
  phone: '+987654321',
  address: 'ул. Полная, д.99'
});
console.log('   Текущие данные:', buyerModel.getData());

// Проверка: валидация полностью заполненных данных (должна вернуть пустой объект)
console.log('8. Валидация полностью заполненных данных:');
const validationErrors = buyerModel.validate();
console.log('   Ошибки:', validationErrors);
console.log('   Все поля валидны?', Object.keys(validationErrors).length === 0);

// Проверка: очистка данных покупателя
console.log('9. Очищаем данные покупателя:');
buyerModel.clear();
console.log('   Данные после очистки:', buyerModel.getData());
console.log('   Валидация после очистки:', buyerModel.validate());

console.log('\n');
console.log('========== ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ ==========');