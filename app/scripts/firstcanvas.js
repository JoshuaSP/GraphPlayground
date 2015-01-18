function toAlpha(num) {
	return (num >= 26 ? String.fromCharCode(Math.floor(num/26)+64) : "") + String.fromCharCode(num%26 + 65);
}

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
		idx: i,
		edges: []
	});
	gn.children['label'].point -= gn.children['label'].bounds.center - point;
	return gn;
}


graphNodes = []

project.currentStyle = {
	strokeColor: '#000000',
	fillColor: 'salmon',
	strokeWidth: 1.6
};

function deleteNode (gn) {
	graphNodes[gn.idx] = null;
	gn.remove();
	gn.edges.forEach (function (edge) {
		edge.remove();
	});
}


var gn = selectedNode = null
function onMouseDown(event) {
	hitresult = project.hitTest(event.point)
	gn = null
	if (!hitresult) {
		var i = 0
		while (graphNodes[i]) {i++;}
		gn = createGraphNode(event.point,i);
		if (i < graphNodes.length) {
			graphNodes[i] = gn;
		}
		else {
			graphNodes.push(gn);
		}
	} else if(['circle','label'].indexOf(hitresult.item.name) != -1) {
		gn = hitresult.item.parent;
		if (event.modifiers.command) {
			deleteNode(gn);
		} else {
			if(graphNodes[selectedNode]) {
				graphNodes[selectedNode].children['circle'].fillColor = 'salmon';
			}
			selectedNode = gn.idx;
			gn.children['circle'].fillColor = 'yellow';
		}
	}
}

var edge = null
var ngn = null
function onMouseDrag(event) {
	if (gn) {
		if (event.modifiers.shift) {
			if (!edge) {
				console.log(gn.position)
				edge = new Path.Line({
					from: gn.position,
					to: event.point,
					strokeColor: 'maroon'
				})
				edge.sendToBack();
			} else {
				edge.segments[1].point = event.point;
			}
		} else {
			gn.position += event.delta;
			gn.edges.forEach (function (edge) {
				edge.segments[edge.nodes.indexOf(gn.idx)].point += event.delta;
			});
		}
	}
}

function onMouseUp(event){
	if (edge) {
		hitresult = project.hitTest(event.point);
		if(['circle','label'].indexOf(hitresult.item.name) != -1) {
			ngn = hitresult.item.parent;
			if ([].concat.apply([],gn.edges.map(function (edge) {
						return edge.segments;
					})).indexOf(ngn.idx) < 0) {
				var finaledge = edge.clone();
				finaledge.segments[1].point = ngn.position;
				finaledge.nodes = [gn.idx, ngn.idx];
				gn.edges.push(finaledge);
				ngn.edges.push(finaledge);
			};
		}
		edge.remove();
		edge = null;
	} else if (gn && !event.point.isInside(view.bounds)) {deleteNode(gn)}
}


