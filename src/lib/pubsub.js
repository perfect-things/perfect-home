const _cache = {};

function fire (topic, ...args) {
	if (!_cache[topic]) return;
	_cache[topic].forEach(cb => {
		if (typeof cb === 'function') cb.apply(cb, args);
	});
}

function on (topic, callback) {
	if (!_cache[topic]) _cache[topic] = [];
	_cache[topic].push(callback);
}

function off (topic, callback) {
	const cached = _cache[topic];
	callback = callback.toString();
	if (!cached) return;

	const idx = cached.findIndex(fn => fn.toString() === callback);
	if (idx > -1) cached.splice(idx, 1);
}


export {
	on,
	off,
	fire
};
