function root() {
	return '/plans';
}

function list( siteName = ':site' ) {
	return root() + `/${ siteName }`;
}

export default {
	list
};
