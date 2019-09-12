const TOASTH = '-56px';

const animProps = {
	hidden: {opacity: 0, marginBottom: TOASTH, transform: 'scale(0.6)'},
	visible: {opacity: 1, marginBottom: 0, transform: 'scale(1)'}
};


function animate (el, from, to, options = {}) {
	const dflt = {duration: 300, easing: 'ease-out', fill: 'forwards'};
	const opts = Object.assign({}, dflt, options);

	return new Promise (resolve => {
		const anim = el.animate([from, to], opts);
		anim.oncancel = resolve;
		anim.onfinish = resolve;
	});
}


function createElem (html) {
	return (new DOMParser()).parseFromString(html, 'text/html').body.firstChild;
}


function getWrapper () {
	let el = document.querySelector('.toast-wrapper');
	if (!el) {
		el = createElem('<div class="toast-wrapper"></div>');
		document.body.appendChild(el);
	}
	return el;
}


// new Toast(msg, 'info');
// new Toast(msg, 'warning');
// new Toast(msg, 'error');

class Toast {
	constructor (msg = '', type = 'info') {
		this.toast = createElem(`<div class="toast toast-${type}">${msg}</div>`);
		this.toast.addEventListener('click', () => this.hide(0));
		getWrapper().appendChild(this.toast);
		this.show();
	}

	show () {
		animate(this.toast, animProps.hidden, animProps.visible).then(() => this.hide());
	}

	_hide () {
		animate(this.toast, animProps.visible, animProps.hidden).then(() => this.toast.remove());
	}

	hide (delay = 2000) {
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(this._hide.bind(this), delay);
	}
}


export default Toast;
