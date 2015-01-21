globals.checker = function () {
	var check = {
		circ: new paper.Path.Circle({
			radius: 15,
			center: new paper.Point (100,100)
		}),
		circ2: new paper.Path.Circle({
			radius: 20,
			center: new paper.Point (150,75)
		})
	}
	// tween = new TWEEN.tween(check.circ.position);
	// tween.to({x: 200}, 2500);
	// tween.start();
}



function toAlpha(num) {
	return (num >= 26 ? String.fromCharCode(Math.floor(num/26)+64) : "") + String.fromCharCode(num%26 + 65);
}

function onFrame(event) {
	// TWEEN.update();
}

settings.hitTolerance = 6
//
var radius = 16

function createGraphNode(point,i) {
	var gn = new Group ({
		position: point,
		children: [
			new Path.Circle({
				center: point,
				radius: radius,
				fillColor: 'salmon',
				name: 'circle'
			}),
			new PointText({
				position: point,
				content: toAlpha(i),
				name: 'label'
			})],
		data: {
			edges: []
		}
	});
	gn.children['label'].point -= gn.children['label'].bounds.center - point;
	return gn;
}

isWeighted = true
graphNodes2 = []

project.currentStyle = {
	strokeColor: '#000000',
	fillColor: 'salmon',
	strokeWidth: 1.6
};

function deleteNode (gn) {
	for (var i = gn.data.edges.length - 1; i > -1;i--){
		gn.data.edges[i].remove()
		gn.data.edges[i] = null
	};
	graphNodes[graphNodes.indexOf(gn)] = null;
	gn.remove();
}

function deleteEdge (edge) {
	for (var i = 0; i < 2; i++){
		edge.data.nodes[i].data.edges.splice(edge.data.nodes[i].data.edges.indexOf(edge),1)
	}
	edge.remove();
}