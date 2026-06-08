import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { AppApi } from './components/communications/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IOrder } from './types/index';
import { TPayment } from './types/index';

// Компоненты представления
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/common/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardModal } from './components/view/CardModal';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/common/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// Брокер событий
const events = new EventEmitter();

// Модели данных
// Модели данных - передаём events
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// API
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);

// Компоненты представления
const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;

const header = new Header(headerContainer, () => {
    events.emit('basket:open');
});

const gallery = new Gallery(galleryContainer);

const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalContainer, events);

// Темплейты
const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// Создаем экземпляры компонентов (один раз)
const basketElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement, () => {
    events.emit('order:open');
});

const orderFormElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
const orderForm = new OrderForm(orderFormElement, events);

const contactsFormElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormElement, events);

const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const success = new Success(successElement, () => {
    modal.close();
});

const previewCardElement = cardPreviewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const previewCard = new CardModal(previewCardElement, events);

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Загрузка товаров с сервера
api.getProducts()
    .then(response => {
        catalogModel.setProducts(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

// 1. Обработка изменения каталога (событие от модели)
events.on('catalog:changed', () => {
    const products = catalogModel.getProducts();
    const cards = products.map(product => {
        const cardElement = cardCatalogTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, () => {
            events.emit('card:select', { id: product.id });
        });
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = CDN_URL + product.image;
        
        if (product.price === null) {
            card.buttonText = 'Недоступно';
            card.buttonDisabled = true;
        } else {
            card.buttonText = 'Купить';
            card.buttonDisabled = false;
        }
        
        return card.render();
    });
    gallery.items = cards;
});

// 2. Выбор карточки для просмотра
events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        catalogModel.setSelectedProduct(product);
    }
});

// 3. Обработка выбора товара для просмотра (событие от модели)
events.on('selected-product:changed', () => {
    const product = catalogModel.getSelectedProduct();
    if (!product) return;
    
    const isInCart = cartModel.contains(product.id);
    
    previewCard.title = product.title;
    previewCard.description = product.description;
    previewCard.price = product.price;
    previewCard.category = product.category;
    previewCard.image = CDN_URL + product.image;
    
    if (product.price === null) {
        previewCard.buttonText = 'Недоступно';
        previewCard.buttonDisabled = true;
    } else {
        previewCard.buttonText = isInCart ? 'Удалить из корзины' : 'Купить';
        previewCard.buttonDisabled = false;
    }
    
    modal.content = previewCard.render();
    modal.open();
});

// 4. Обработчик кнопки в модальном окне
events.on('preview:toggle', () => {
    const selectedProduct = catalogModel.getSelectedProduct();
    if (!selectedProduct || selectedProduct.price === null) return;
    
    const isInCart = cartModel.contains(selectedProduct.id);
    
    if (isInCart) {
        cartModel.removeItem(selectedProduct.id);
    } else {
        cartModel.addItem(selectedProduct);
    }
    
    modal.close();
});

// 5. Обработка изменения корзины (событие от модели)
events.on('cart:changed', () => {
    const count = cartModel.getItemCount();
    const total = cartModel.getTotalPrice();
    const items = cartModel.getItems();
    
    header.counter = count;
    
    if (items.length === 0) {
        basket.items = [];
        basket.buttonState = false;
    } else {
        const cardElements = items.map((item, index) => {
            const cardElement = cardBasketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
            const card = new CardBasket(cardElement, () => {
                cartModel.removeItem(item.id);
            });
            card.index = index + 1;
            card.title = item.title;
            card.price = item.price;
            return card.render();
        });
        basket.items = cardElements;
        basket.buttonState = true;
    }
    basket.total = total;
});

// 6. Открытие корзины
events.on('basket:open', () => {
    modal.content = basket.render();
    modal.open();
});

// 7. Обработчики событий форм (только эмитят события)
events.on('order:payment', (data: { payment: TPayment }) => {
    buyerModel.setData({ payment: data.payment });
});

events.on('order:address', (data: { address: string }) => {
    buyerModel.setData({ address: data.address });
});

events.on('contacts:email', (data: { email: string }) => {
    buyerModel.setData({ email: data.email });
});

events.on('contacts:phone', (data: { phone: string }) => {
    buyerModel.setData({ phone: data.phone });
});

// 8. Обработчик изменения данных покупателя (событие от модели)
events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const allErrors = buyerModel.validate();
    
    // Обновляем форму заказа (первый шаг)
    const step1Errors = {
        address: allErrors.address,
        payment: allErrors.payment
    };
    const isStep1Valid = !step1Errors.address && !step1Errors.payment;
    
    orderForm.address = buyerData.address;
    if (buyerData.payment) {
        orderForm.setPaymentActive(buyerData.payment);
    }
    orderForm.valid = isStep1Valid;
    orderForm.errors = step1Errors.address || step1Errors.payment || '';
    
    // Обновляем форму контактов (второй шаг)
    const step2Errors = {
        email: allErrors.email,
        phone: allErrors.phone
    };
    const isStep2Valid = !step2Errors.email && !step2Errors.phone;
    
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = isStep2Valid;
    contactsForm.errors = step2Errors.email || step2Errors.phone || '';
});

// 9. Открытие формы заказа (только открываем, данные уже в форме из buyer:changed)
events.on('order:open', () => {
    modal.content = orderForm.render();
    modal.open();
});

// 10. Переход к форме контактов
events.on('order:next', () => {
    const buyerData = buyerModel.getData();
    const allErrors = buyerModel.validate();
    
    const step1Errors = {
        address: allErrors.address,
        payment: allErrors.payment
    };
    const isStep1Valid = !step1Errors.address && !step1Errors.payment;
    
    if (isStep1Valid && buyerData.address && buyerData.payment) {
        // Открываем вторую форму
        modal.content = contactsForm.render();
        // Оставляем модалку открытой
    }
});

// 11. Отправка заказа
events.on('contacts:pay', () => {
    submitOrder();
});

// 12. Отправка заказа на сервер
async function submitOrder() {
    const buyerData = buyerModel.getData();
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    
    const order: IOrder = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        items: items.map(item => item.id),
        total: total
    };
    
    try {
        const result = await api.postOrder(order);
        success.total = result.total;
        modal.content = success.render();
        
        cartModel.clear();
        buyerModel.clear();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
}

// 13. Закрытие модального окна
events.on('modal:close', () => {
    modal.close();
});