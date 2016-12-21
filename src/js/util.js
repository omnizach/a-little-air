function rangify(value, def) {
  return value === null ? def : Array.isArray(value) ? value : [+value, +value];
}

module.exports = {
	rangify: rangify
};