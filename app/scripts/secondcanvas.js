
if (typeof globals !== "undefined") {
	globals.scope2 = this
} else {
	globals = {scope2: this}
}

globals.secondMovie = function (){}

function onFrame(event) {
	TWEEN.update();
	if (typeof globals.secondMovie !== "undefined") {
		globals.secondMovie();
	}
}

var tn = null

function onMouseDown(event) {
	var hitresult = project.hitTest(event.point);
	if (!hitresult || !hitresult.item.name) {return;}
	var hitname = hitresult.item.name.match(/^\w+/)[0];
	if (hitname == 'circle' || hitname == 'label') {
		tn = hitresult.item.parent;
	} else {
		tn = null;
	}
}


function onMouseDrag(event) {
	if (TWEEN.getAll().length > 0) {return;}
	if (tn) {
		tn.position += event.delta;
		tn.data.edges.forEach (function (edge) {
			var tnindex = edge.data.nodes.indexOf(tn)
			var othertnindex = (tnindex+1)%2
			edge.segments[tnindex].point = tn.position;
			edge.segments[othertnindex].point = edge.data.nodes[othertnindex].position;
		});
	} 
}