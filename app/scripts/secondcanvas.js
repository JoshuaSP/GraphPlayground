
if (globals) {
	globals.scope2 = this
} else {
	globals = {scope2: this}
}

function onFrame(event) {
	TWEEN.update();
}

