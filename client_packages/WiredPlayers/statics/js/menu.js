﻿const PRICE_PIZZA = 20;
const PRICE_HAMBURGER = 10;
const PRICE_SANDWICH = 5;

let tunningComponents = [];
let tattooZones = [];
let clothesTypes = [];
let selectedOptions = [];
let purchasedAmount = 1;
let multiplier = 0.0;
let selected = undefined;
let drawable = undefined;

$(document).ready(function() {
	i18next.use(window.i18nextXHRBackend).init({
		backend: {
			loadPath: '../i18n/en.json'
		}
	}, function(err, t) {
        jqueryI18next.init(i18next, $);
	});
});

function populateBusinessItems(businessItemsJson, businessName, multiplier) {
	// Initialize the values
	purchasedAmount = 1;
	selected = undefined;

	// Get items to show
	let businessItemsArray = JSON.parse(businessItemsJson);
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Show business name
	header.textContent = businessName;
	
	for(let i = 0; i < businessItemsArray.length; i++) {
		let item = businessItemsArray[i];
		
		let itemContainer = document.createElement('div');
		let imageContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let addSubstractContainer = document.createElement('div');
		let itemImage = document.createElement('img');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		let itemAdd = document.createElement('span');
		let itemSubstract = document.createElement('span');
		
		itemContainer.classList.add('item-row');
		imageContainer.classList.add('item-image');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container', 'hidden');
		amountTextContainer.classList.add('item-amount-desc-container');
		addSubstractContainer.classList.add('item-add-substract-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		itemAdd.classList.add('item-adder');
		itemSubstract.classList.add('item-substract', 'hidden');
		
		itemImage.src = '../img/inventory/' + item.hash + '.png';
		itemDescription.textContent = item.description;
		itemPrice.innerHTML = '<b>' + i18next.t('general.unit-price') + '</b>' + Math.round(item.products * parseFloat(multiplier)) + '$';
		itemAmount.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
		itemAdd.textContent = '+';
		itemSubstract.textContent = '-';
		
		itemContainer.onclick = (function() {
			// Check if the item is not selected
			if(selected !== i) {
				// Check if there was any item selected
				if(selected != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					let previousAmountNode = findFirstChildByClass(previousSelected, 'item-amount-container');
					previousSelected.classList.remove('active-item');
					previousAmountNode.classList.add('hidden');
				}
				
				// Select the item
				let currentSelected = document.getElementsByClassName('item-row')[i];
				let currentAmountNode = findFirstChildByClass(currentSelected, 'item-amount-container');
				currentSelected.classList.add('active-item');
				currentAmountNode.classList.remove('hidden');
				
				// Store the item and initialize the amount
				purchasedAmount = 1;
				selected = i;
				
				// Update the element's text
				itemAmount.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
				document.getElementsByClassName('item-adder')[selected].classList.remove('hidden');
				document.getElementsByClassName('item-substract')[selected].classList.add('hidden');
			}
		});
		
		itemAdd.onclick = (function() {
			// Add one unit
			purchasedAmount++;
			
			let adderButton = document.getElementsByClassName('item-adder')[selected];
			let substractButton = document.getElementsByClassName('item-substract')[selected];
			
			if(purchasedAmount == 10) {
				// Maximum amount reached
				adderButton.classList.add('hidden');
			} else if(substractButton.classList.contains('hidden') === true) {
				// Show the button
				substractButton.classList.remove('hidden');
			}
			
			// Update the amount
			let amountSpan = document.getElementsByClassName('item-amount-description')[selected];
			amountSpan.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
		});
		
		itemSubstract.onclick = (function() {
			// Substract one unit
			purchasedAmount--;
			
			let adderButton = document.getElementsByClassName('item-adder')[selected];
			let substractButton = document.getElementsByClassName('item-substract')[selected];
			
			if(purchasedAmount == 1) {
				// Minimum amount reached
				substractButton.classList.add('hidden');
			} else if(adderButton.classList.contains('hidden') === true) {
				// Show the button
				adderButton.classList.remove('hidden');
			}
			
			// Update the amount
			let amountSpan = document.getElementsByClassName('item-amount-description')[selected];
			amountSpan.innerHTML = '<b>' + i18next.t('general.amount') + '</b>' + purchasedAmount;
		});
		
		content.appendChild(itemContainer);
		itemContainer.appendChild(imageContainer);
		itemContainer.appendChild(infoContainer);
		imageContainer.appendChild(itemImage);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
		itemAmountContainer.appendChild(addSubstractContainer);
		addSubstractContainer.appendChild(itemAdd);
		addSubstractContainer.appendChild(itemSubstract);
	}
	
	// Add option buttons
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Add classes for the buttons
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Add text for the buttons
	purchaseButton.textContent = i18next.t('general.purchase');
	cancelButton.textContent = i18next.t('general.exit');
	
	purchaseButton.onclick = (function() {
		// Check if the user purchased anything
		if(selected != undefined) {
			mp.trigger('purchaseItem', selected, purchasedAmount);
		}
	});
	
	cancelButton.onclick = (function() {
		// Close the purchase window
		mp.trigger('destroyBrowser');
	});
	
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateTunningMenu(tunningComponentsJSON) {
	// Add the title to the menu
	let header = document.getElementById('header');
	header.textContent = i18next.t('tunning.title');
	
	// Get the components list
	tunningComponents = JSON.parse(tunningComponentsJSON);
	
	// Show the main menu
	populateTunningHome();
}

function populateTunningHome() {
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Initialize the options
	selected = undefined;
	drawable = undefined;
	
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < tunningComponents.length; i++) {
		let group = tunningComponents[i];
		
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		
		// Get the classes for each element
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		
		// Add the description
		itemDescription.textContent = i18next.t(group.desc);
		
		itemContainer.onclick = (function() {
			selected = i;
			
			// Show components from this type
			populateTunningComponents();
		});
		
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}
	
	// Create the exit button
	let exitButton = document.createElement('div');
	
	// Add the classes and text for the button
	exitButton.classList.add('single-button', 'cancel-button');
	exitButton.textContent = i18next.t('general.exit');
	
	exitButton.onclick = (function() {
		// Close the menu
		mp.trigger('destroyBrowser');
	});
	
	options.appendChild(exitButton);
}

function populateTunningComponents() {
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < tunningComponents[selected].components.length; i++) {
		let component = tunningComponents[selected].components[i];
		
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		
		// Add the description and price
		itemDescription.textContent = component.desc;
		itemPrice.innerHTML = '<b>' + i18next.t('general.unit-price') + '</b>' + tunningComponents[selected].products + '$';
		
		itemContainer.onclick = (function() {
			if(drawable !== i) {
				// Check if there was any item selected
				if(drawable != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[drawable];
					previousSelected.classList.remove('active-item');
				}
				
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				drawable = i;
				
				// Update the vehicle's tunning
				mp.trigger('addVehicleComponent', tunningComponents[selected].slot, drawable);
			}
		});
		
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}
	
	// Add the buttons
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	purchaseButton.textContent = i18next.t('general.purchase');
	cancelButton.textContent = i18next.t('general.back');;
	
	purchaseButton.onclick = (function() {
		if(selected != undefined) {
			//mp.trigger('purchaseItem', selected, purchasedAmount);
		}
	});
	
	cancelButton.onclick = (function() {
		// Back to the home menu
		populateTunningHome();
	});
	
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateFastfoodOrders(ordersJson, distancesJson) {
	// Get the orders
	let fastfoodOrders = JSON.parse(ordersJson);
	let distances = JSON.parse(distancesJson);
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Add the title to the menu
	header.textContent = i18next.t('fastfood.title');
	
	for(let i = 0; i < fastfoodOrders.length; i++) {
		let order = fastfoodOrders[i];
		
		// Calculate order's price
		let amount = order.pizzas * PRICE_PIZZA + order.hamburgers * PRICE_HAMBURGER + order.sandwitches * PRICE_SANDWICH;
		
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = 'Pedido #' + order.id;
		itemPrice.innerHTML = '<b>Pedido: </b>' + amount + '$';
		itemAmount.innerHTML = '<b>Distancia: </b>' + parseFloat(distances[i] / 1000).toFixed(2) + 'km';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el nuevo índice seleccionado
				selected = i;
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}
	
	// Añadimos los botones
	let deliverButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	deliverButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	deliverButton.textContent = 'Entregar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	deliverButton.onclick = (function() {
		// Entregamos el pedido seleccionado
		if(selected != undefined) {
			mp.trigger('deliverFastfoodOrder', fastfoodOrders[selected].id);
		}
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana de pedidos
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(deliverButton);
	options.appendChild(cancelButton);
}

function populateCrimesMenu(crimesJson, selectedCrimes) {
	// Obtenemos el nodo contenedor
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Añadimos el texto de cabecera y obtenemos la lista de delitos
	let crimesArray = JSON.parse(crimesJson);
	header.textContent = 'Lista de delitos';
	selectedOptions = [];
	
	if(selectedCrimes.length > 0) {
		// Obtenemos los delitos
		let crimes = JSON.parse(selectedCrimes);
		
		for(let i = 0; i < crimes.length; i++) {
			// Añadimos el delito
			selectedOptions.push(crimes[i]);
		}
	}
	
	for(let i = 0; i < crimesArray.length; i++) {
		// Obtenemos el componente
		let crime = crimesArray[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		
		for(let c = 0; c < selectedOptions.length; c++) {
			if(JSON.stringify(crime) === JSON.stringify(selectedOptions[c])) {
				// Marcamos el delito como aplicable
				itemContainer.classList.add('active-item');
				selectedOptions.splice(c, 1);
				selectedOptions.push(crime);
				break;
			}
		}
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = crime.crime;
		itemPrice.innerHTML = '<b>Multa: </b>' + crime.fine + '$';
		itemAmount.innerHTML = '<b>Tiempo: </b>' + crime.jail + 'min.';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selectedOptions.indexOf(crime) === -1) {
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el índice seleccionado
				selectedOptions.push(crime);
			} else {
				// Eliminamos la selección del elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.remove('active-item');
				
				// Eliminamos el índice seleccionado
				selectedOptions.splice(selectedOptions.indexOf(crime), 1);
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}
	
	// Añadimos los botones
	let applyButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	applyButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	applyButton.textContent = 'Inculpar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	applyButton.onclick = (function() {
		// Entregamos el pedido seleccionado
		if(selectedOptions.length > 0) {
			mp.trigger('applyCrimes', JSON.stringify(selectedOptions));
		}
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana de pedidos
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(applyButton);
	options.appendChild(cancelButton);
}

function populateCharacterList(charactersJson) {
	// Obtenemos el nodo contenedor
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Obtenemos la lista de jugadores
	let characters = JSON.parse(charactersJson);
	
	// Añadimos el texto de cabecera
	header.textContent = 'Lista de personajes';
	
	for(let i = 0; i < characters.length; i++) {
		// Obtenemos el componente
		let character = characters[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = character;
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Cargamos el personaje
			mp.trigger('loadCharacter', character);
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}
	
	// Añadimos los botones
	let createButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	createButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	createButton.textContent = 'Crear nuevo';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	createButton.onclick = (function() {
		// Mostramos el menú de creación de personaje
		mp.trigger('showCharacterCreationMenu');
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana de personajes
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(createButton);
	options.appendChild(cancelButton);
}

function populateClothesShopMenu(clothesTypeArray, businessName, priceMultiplier) {
	// Añadimos el título al menú
	let header = document.getElementById('header');
	header.textContent = businessName;
	
	// Obtenemos las listas de prendas
	clothesTypes = JSON.parse(clothesTypeArray);
	multiplier = priceMultiplier;
	
	// Mostramos el menú principal
	populateClothesShopHome();
}

function populateClothesShopHome() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Inicializamos las opciones
	selected = undefined;
	drawable = undefined;
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < clothesTypes.length; i++) {
		// Obtenemos la zona en curso
		let type = clothesTypes[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = i18next.t(type.desc);
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Seleccionamos el elemento pulsado
			selected = i;
			
			// Cargamos la lista de ropa de la zona
			mp.trigger('getClothesByType', i);
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}
	
	// Añadimos el botón
	let exitButton = document.createElement('div');
	
	// Añadimos las clases al botón
	exitButton.classList.add('single-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	exitButton.textContent = 'Salir';
	
	exitButton.onclick = (function() {
		// Salimos del menú
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(exitButton);
}

function populateTypeClothes(typeClothesJson) {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Parseamos el JSON
	let typeClothesArray = JSON.parse(typeClothesJson);
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < typeClothesArray.length; i++) {
		// Obtenemos el componente
		let clothes = typeClothesArray[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let addSubstractContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		let itemAdd = document.createElement('span');
		let itemSubstract = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container', 'hidden');
		amountTextContainer.classList.add('item-amount-desc-container');
		addSubstractContainer.classList.add('item-add-substract-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		itemAdd.classList.add('item-adder');
		itemSubstract.classList.add('item-substract', 'hidden');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = clothes.description;
		itemPrice.innerHTML = '<b>Precio: </b>' + Math.round(clothes.products * multiplier) + '$';
		itemAdd.textContent = '+';
		itemSubstract.textContent = '-';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(drawable !== i) {
				// Miramos si había algún elemento seleccionado
				if(drawable != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[drawable];
					let previousAmountNode = findFirstChildByClass(previousSelected, 'item-amount-container');
					previousSelected.classList.remove('active-item');
					previousAmountNode.classList.add('hidden');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				let currentAmountNode = findFirstChildByClass(currentSelected, 'item-amount-container');
				currentSelected.classList.add('active-item');
				currentAmountNode.classList.remove('hidden');
				
				// Guardamos el nuevo índice seleccionado
				purchasedAmount = 0;
				drawable = i;
				
				// Actualizamos el mensaje de la textura
				itemAmount.innerHTML = '<b>Variante: </b>' + purchasedAmount;
			
				if(purchasedAmount < clothes.textures - 1) {
					// Mostramos el botón de añadir
					document.getElementsByClassName('item-adder')[drawable].classList.remove('hidden');
				} else {
					// Ocultamos el botón de añadir
					document.getElementsByClassName('item-adder')[drawable].classList.add('hidden');
				}
				document.getElementsByClassName('item-substract')[drawable].classList.add('hidden');
				
				// Actualizamos la prenda
				mp.trigger('replacePlayerClothes', drawable, purchasedAmount);
			}
		});
		
		itemAdd.onclick = (function() {
			// Sumamos una unidad
			purchasedAmount++;
			
			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[drawable];
			let substractButton = document.getElementsByClassName('item-substract')[drawable];
			
			if(purchasedAmount == clothes.textures - 1) {
				// Ha llegado al máximo
				adderButton.classList.add('hidden');
			} else if(substractButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				substractButton.classList.remove('hidden');
			}
			
			// Actualizamos la textura
			let amountSpan = document.getElementsByClassName('item-amount-description')[drawable];
			amountSpan.innerHTML = '<b>Variante: </b>' + purchasedAmount;
				
			// Actualizamos la prenda
			mp.trigger('replacePlayerClothes', drawable, purchasedAmount);
		});
		
		itemSubstract.onclick = (function() {
			// Restamos una unidad
			purchasedAmount--;
			
			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[drawable];
			let substractButton = document.getElementsByClassName('item-substract')[drawable];
			
			if(purchasedAmount == 0) {
				// Ha llegado al mínimo
				substractButton.classList.add('hidden');
			} else if(adderButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				adderButton.classList.remove('hidden');
			}
			
			// Actualizamos la textura
			let amountSpan = document.getElementsByClassName('item-amount-description')[drawable];
			amountSpan.innerHTML = '<b>Variante: </b>' + purchasedAmount;
				
			// Actualizamos la prenda
			mp.trigger('replacePlayerClothes', drawable, purchasedAmount);
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
		itemAmountContainer.appendChild(addSubstractContainer);
		addSubstractContainer.appendChild(itemAdd);
		addSubstractContainer.appendChild(itemSubstract);
	}
	
	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Comprar';
	cancelButton.textContent = 'Atrás';
	
	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != undefined) {
			mp.trigger('purchaseClothes', selected, drawable, purchasedAmount);
		}
	});
	
	cancelButton.onclick = (function() {
		// Volvemos al inicio
		populateClothesShopHome();
		
		// Limpiamos la ropa no comprada
		mp.trigger('clearClothes');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateTattooMenu(tattooZoneArray, businessName, priceMultiplier) {
	// Añadimos el título al menú
	let header = document.getElementById('header');
	header.textContent = businessName;
	
	// Obtenemos las listas de tatuajes
	tattooZones = JSON.parse(tattooZoneArray);
	multiplier = priceMultiplier;
	
	// Mostramos el menú principal
	populateTattooHome();
}

function populateTattooHome() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Inicializamos las opciones
	selected = undefined;
	drawable = undefined;
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < tattooZones.length; i++) {
		// Obtenemos la zona en curso
		let zone = tattooZones[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = i18next.t(zone);
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Seleccionamos el elemento pulsado
			selected = i;
			
			// Cargamos la lista de tatuajes de la zona
			mp.trigger('getZoneTattoos', i);
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}
	
	// Añadimos el botón
	let exitButton = document.createElement('div');
	
	// Añadimos las clases al botón
	exitButton.classList.add('single-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	exitButton.textContent = 'Salir';
	
	exitButton.onclick = (function() {
		// Salimos del menú
		mp.trigger('exitTattooShop');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(exitButton);
}

function populateZoneTattoos(zoneTattooJson) {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Parseamos el JSON
	let zoneTattooArray = JSON.parse(zoneTattooJson);
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < zoneTattooArray.length; i++) {
		// Obtenemos el componente
		let tattoo = zoneTattooArray[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = tattoo.name;
		itemPrice.innerHTML = '<b>Precio: </b>' + Math.round(tattoo.price * multiplier) + '$';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(drawable !== i) {
				// Miramos si había algún elemento seleccionado
				if(drawable != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[drawable];
					previousSelected.classList.remove('active-item');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el nuevo índice seleccionado
				drawable = i;
				
				// Actualizamos los tatuajes
				mp.trigger('addPlayerTattoo', drawable);
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}
	
	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Comprar';
	cancelButton.textContent = 'Atrás';
	
	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != undefined) {
			mp.trigger('purchaseTattoo', selected, drawable);
		}
	});
	
	cancelButton.onclick = (function() {
		// Volvemos al inicio
		populateTattooHome();
		
		// Limpiamos los tatuajes no comprados
		mp.trigger('clearTattoos');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateHairdresserMenu(faceOptionsJson, selectedFaceJson, businessName) {
	// Obtenemos la lista de opciones
	let faceOptions = JSON.parse(faceOptionsJson);
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Añadimos la cabecera del menú
	header.textContent = businessName;
	selectedOptions = JSON.parse(selectedFaceJson);
	
	for(let i = 0; i < faceOptions.length; i++) {
		// Obtenemos el objeto en curso
		let face = faceOptions[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let addSubstractContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemAmount = document.createElement('span');
		let itemAdd = document.createElement('span');
		let itemSubstract = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		addSubstractContainer.classList.add('item-add-substract-container');
		itemDescription.classList.add('item-description');
		itemAmount.classList.add('item-amount-description');
		itemAdd.classList.add('item-adder');
		itemSubstract.classList.add('item-substract');
		
		// Miramos si hay que ocultar los controles
		if(selectedOptions[i] == face.minValue) {
			itemSubstract.classList.add('hidden');
		} else if(selectedOptions[i] == face.maxValue) {
			itemAdd.classList.add('hidden');
		}		
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = i18next.t(face.desc);
		itemAmount.innerHTML = '<b>Tipo: </b>' + selectedOptions[i];
		itemAdd.textContent = '+';
		itemSubstract.textContent = '-';
		
		itemAdd.onclick = (function() {
			// Sumamos una unidad
			selectedOptions[i]++;
			
			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[i];
			let substractButton = document.getElementsByClassName('item-substract')[i];
			
			if(selectedOptions[i] == face.maxValue) {
				// Ha llegado al máximo
				adderButton.classList.add('hidden');
			} else if(substractButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				substractButton.classList.remove('hidden');
			}
			
			// Actualizamos el tipo
			let amountSpan = document.getElementsByClassName('item-amount-description')[i];
			amountSpan.innerHTML = '<b>Tipo: </b>' + selectedOptions[i];
			
			// Actualizamos la apariencia
			mp.trigger('updateFacialHair', i, selectedOptions[i]);
		});
		
		itemSubstract.onclick = (function() {
			// Restamos una unidad
			selectedOptions[i]--;
			
			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[i];
			let substractButton = document.getElementsByClassName('item-substract')[i];
			
			if(selectedOptions[i] == face.minValue) {
				// Ha llegado al mínimo
				substractButton.classList.add('hidden');
			} else if(adderButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				adderButton.classList.remove('hidden');
			}
			
			// Actualizamos el tipo
			let amountSpan = document.getElementsByClassName('item-amount-description')[i];
			amountSpan.innerHTML = '<b>Tipo: </b>' + selectedOptions[i];
			
			// Actualizamos la apariencia
			mp.trigger('updateFacialHair', i, selectedOptions[i]);
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
		itemAmountContainer.appendChild(addSubstractContainer);
		addSubstractContainer.appendChild(itemAdd);
		addSubstractContainer.appendChild(itemSubstract);
	}
	
	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	acceptButton.textContent = 'Aceptar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		// Guardamos los cambios
		mp.trigger('applyHairdresserChanges');
	});
	
	cancelButton.onclick = (function() {
		// Cancelamos el peinado y cerramos la ventana de pedidos
		mp.trigger('cancelHairdresserChanges');
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function populateTownHallMenu(townHallOptionsJson) {
	// Obtenemos la lista de opciones
	let townHallOptions = JSON.parse(townHallOptionsJson);
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Añadimos la cabecera del menú
	header.textContent = 'Trámites del ayuntamiento';
	selected = undefined;
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < townHallOptions.length; i++) {
		// Obtenemos el objeto en curso
		let townHall = townHallOptions[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = i18next.t(townHall.desc);
		
		if(townHall.price > 0) {
			// Si tiene precio, lo mostramos
			itemPrice.innerHTML = '<b>Precio: </b>' + townHall.price + '$';
		}
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el nuevo índice seleccionado
				selected = i;
				
				// Cambiamos el texto del botón
				let leftButton = document.getElementsByClassName('accept-button')[0];
				leftButton.textContent = townHall.price > 0 ? 'Pagar' : 'Comprobar';
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}
	
	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	acceptButton.textContent = 'Pagar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		if(selected != undefined) {
			// Ejecutamos la acción seleccionada
			mp.trigger('executeTownHallOperation', selected);
		}
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana del ayuntamiento
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function populateFinesMenu(finesJson) {
	// Obtenemos la lista de opciones
	let finesList = JSON.parse(finesJson);
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	selectedOptions = [];
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < finesList.length; i++) {
		// Obtenemos el objeto en curso
		let fine = finesList[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = fine.reason;
		itemPrice.innerHTML = '<b>Cantidad: </b>' + fine.amount + '$';
		itemAmount.innerHTML = '<b>Fecha: </b>' + fine.date.split(' ')[0];
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selectedOptions.indexOf(fine) === -1) {
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el índice seleccionado
				selectedOptions.push(fine);
			} else {
				// Eliminamos la selección del elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.remove('active-item');
				
				// Eliminamos el índice seleccionado
				selectedOptions.splice(selectedOptions.indexOf(fine), 1);
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}
	
	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	acceptButton.textContent = 'Pagar';
	cancelButton.textContent = 'Atrás';
	
	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		if(selectedOptions.length > 0) {
			// Pagamos las multas del jugador
			mp.trigger('payPlayerFines', JSON.stringify(selectedOptions));
		}
	});
	
	cancelButton.onclick = (function() {
		// Volvemos al índice del ayuntamiento
		mp.trigger('backTownHallIndex');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function populatePoliceControlsMenu(policeControlJson) {
	// Obtenemos la lista de opciones
	let policeControls = JSON.parse(policeControlJson);
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Añadimos la cabecera del menú
	header.textContent = 'Controles policiales';
	
	for(let i = 0; i < policeControls.length; i++) {
		// Obtenemos el objeto en curso
		let control = policeControls[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = control;
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el nuevo índice seleccionado
				selected = i;
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}
	
	// Añadimos los botones
	let acceptButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	acceptButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	acceptButton.textContent = 'Cargar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	acceptButton.onclick = (function() {
		// Procesamos la opción y borramos el navegador
		mp.trigger('proccessPoliceControlAction');
		mp.trigger('destroyBrowser');
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana de controles
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(acceptButton);
	options.appendChild(cancelButton);
}

function populateWardrobeMenu(clothesTypeArray) {
	// Añadimos el título al menú
	let header = document.getElementById('header');
	header.textContent = 'Armario';
	
	// Obtenemos las listas de prendas
	clothesTypes = JSON.parse(clothesTypeArray);
	
	// Mostramos el menú principal
	populateWardrobeHome();
}

function populateWardrobeHome() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Inicializamos las opciones
	selected = undefined;
	drawable = undefined;
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < clothesTypes.length; i++) {
		// Obtenemos la zona en curso
		let type = clothesTypes[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = type.desc;
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Seleccionamos el elemento pulsado
			selected = i;
			
			// Cargamos la lista de ropa de la zona
			mp.trigger('getPlayedPurchasedClothes', i);
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}
	
	// Añadimos el botón
	let exitButton = document.createElement('div');
	
	// Añadimos las clases al botón
	exitButton.classList.add('single-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	exitButton.textContent = 'Salir';
	
	exitButton.onclick = (function() {
		// Salimos del menú
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(exitButton);
}

function populateWardrobeClothes(typeClothesJson) {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Parseamos el JSON
	let typeClothesArray = JSON.parse(typeClothesJson);
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < typeClothesArray.length; i++) {
		// Obtenemos el componente
		let clothes = typeClothesArray[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = clothes.description;
		itemPrice.innerHTML = '<b>Variante: </b>' + clothes.texture;
		itemAdd.textContent = '+';
		itemSubstract.textContent = '-';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(drawable !== i) {
				// Miramos si había algún elemento seleccionado
				if(drawable != undefined) {
					let previousSelected = document.getElementsByClassName('item-row')[drawable];
					previousSelected.classList.remove('active-item');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el nuevo índice seleccionado
				drawable = i;
				
				// Actualizamos la prenda
				mp.trigger('previewPlayerClothes', drawable);
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
		itemAmountContainer.appendChild(addSubstractContainer);
		addSubstractContainer.appendChild(itemAdd);
		addSubstractContainer.appendChild(itemSubstract);
	}
	
	// Añadimos los botones
	let dressButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	dressButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	dressButton.textContent = 'Vestir';
	cancelButton.textContent = 'Atrás';
	
	// Ponemos la función para cada elemento
	dressButton.onclick = (function() {
		// Mandamos la acción de vestirse si ha seleccionado algo
		if(selected != undefined) {
			mp.trigger('changePlayerClothes', selected, drawable);
		}
	});
	
	cancelButton.onclick = (function() {
		// Volvemos al inicio
		populateWardrobeHome();
		
		// Limpiamos la ropa no vestida
		mp.trigger('clearClothes');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(dressButton);
	options.appendChild(cancelButton);
}

function findFirstChildByClass(element, className) {
	let foundElement = undefined, found;
	function recurse(element, className, found) {
		for (let i = 0; i < element.childNodes.length && !found; i++) {
			let el = element.childNodes[i];
			let classes = el.className != undefined? el.className.split(" ") : [];
			for (let j = 0, jl = classes.length; j < jl; j++) {
				if (classes[j] == className) {
					found = true;
					foundElement = element.childNodes[i];
					break;
				}
			}
			if(found)
				break;
			recurse(element.childNodes[i], className, found);
		}
	}
	recurse(element, className, false);
	return foundElement;
}		