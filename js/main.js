"use strict"
window.addEventListener('DOMContentLoaded', function() {

	//Tabs

	const tabHeaderItems = document.querySelector('.tabheader__items'),
		tabContent = document.querySelectorAll('.tabcontent');


	tabHeaderItems.addEventListener('click', (event) => {
		if (event.target && event.target.matches('.tabheader__item')) {
			document.querySelectorAll('.tabheader__item_active').forEach((e) => {
				e.classList.remove('tabheader__item_active');
			});
			event.target.classList.add('tabheader__item_active')
			document.querySelectorAll('.tabheader__item').forEach((e, i) => {
				if (e.classList.contains('tabheader__item_active')) {
					tabContent.forEach(e => {
						e.classList.remove('tabcontent_active');
					})
					tabContent[i].classList.add('tabcontent_active');
				}
			})
		}
	});

	// Timer

	let deadline = "2023-07-05";

	function getDifferenceTime(time) {
		let days, hours, minutes, seconds;
		const t = Date.parse(time) - Date.parse(new Date());

		if (t <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			days = Math.floor(t / (1000 * 60 * 60 * 24));
			hours = Math.floor((t / (1000 * 60 * 60)) % 24);
			minutes = Math.floor((t / 1000 / 60) % 60);
			seconds = Math.floor((t / 1000) % 60);
		}

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	};

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`
		} else {
			return num
		}
	}

	function setTime(selector, time) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateTime, 1000);

		updateTime()

		function updateTime() {
			const t = getDifferenceTime(time);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval)
			}
		}
	};

	setTime('.timer', deadline)


	// Modal 

	const modalBtns = document.querySelectorAll('[data-modal]'),
		modalClose = document.querySelectorAll('.modal__close'),
		modalContent = document.querySelector('.modal-main'),
		modalThanks = this.document.querySelector('.modal-thanks');


	function toCloseModal() {
		modalContent.classList.remove('show');
		modalThanks.classList.remove('show');
		document.body.style.overflow = '';
	};

	function toOpenModal() {
		modalContent.classList.add('show');
		document.body.style.overflow = 'hidden';
	};

	modalBtns.forEach(e => {
		e.addEventListener('click', toOpenModal)
	});

	modalClose.forEach(item => {
		item.addEventListener('click', toCloseModal);
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === "Escape" && window.getComputedStyle(modalContent).display === "block" || window.getComputedStyle(modalThanks).display === "block") {
			toCloseModal();
		}
	});

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
			toOpenModal();
			window.removeEventListener('scroll', showModalByScroll)
		}
	}; 

	window.addEventListener('scroll', showModalByScroll)


	// Menu 

	class MenuItem {
		constructor(img, alt, menu, descr, price, parentSelector, ...classes) {
			this.img = img;
			this.alt = alt;
			this.menu = menu;
			this.descr = descr;
			this.classes = classes;
			this.price = price;
			this.parent = document.querySelector(parentSelector);
		}

		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				element.classList.add('menu__item')
			} else {
				this.classes.forEach(className => {
					element.classList.add(className)
				})
			}
			element.innerHTML = `
				<img src='${this.img}' alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.menu}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
			`;
			this.parent.append(element);
		}
	};

	new MenuItem(
		"img/tabs/vegy.jpg",
		"vegy",
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		229,
		".menu .container",
		"menu__item",
	).render();

	new MenuItem(
		"img/tabs/post.jpg",
		"post",
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		550,
		".menu .container"
	).render();

	new MenuItem(
		"img/tabs/elite.jpg",
		"elite",
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		430,
		".menu .container"
	).render();

	// Forms 

	const forms = document.querySelectorAll('form');

	forms.forEach(item => {
		postData(item)
	})

	function postData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const formData = new FormData(form);

			fetch('server.php', {
				method: "POST",
				body: formData
			})
			.then(data => data.text())
			.then(data => {
				console.log(data);
				modalContent.classList.remove('show')
				modalThanks.classList.add('show')
			}).catch(() => {
				console.log('error')
			}).finally(() => {
				form.reset();
				setTimeout(() => {
					toCloseModal();
				}, 3000)
			})
		})
	};
});

