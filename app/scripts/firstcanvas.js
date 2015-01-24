globals = {}

function toAlpha(num) {
	return (num >= 26 ? String.fromCharCode(Math.floor(num/26)+64) : "") + String.fromCharCode(num%26 + 65);
}

function onFrame(event) {
	TWEEN.update();
}

globals.scope1 = this

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
				strokeWidth: 1.1,
				name: 'label'
			})],
		data: {
			edges: [],
			status: null
		}
	});
	gn.children['label'].point -= gn.children['label'].bounds.center - point;
	return gn;
}

globals.isWeighted = true
globals.graphNodes = []

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
	globals.graphNodes[globals.graphNodes.indexOf(gn)] = null;
	gn.remove();
}

function deleteEdge (edge) {
	for (var i = 0; i < 2; i++){
		edge.data.nodes[i].data.edges.splice(edge.data.nodes[i].data.edges.indexOf(edge),1)
	}
	edge.remove();
}


var selector = gn = weight = eedge = globals.selectedNode = modif = null
function onMouseDown(event) {
	if (globals.searched) {
		TWEEN.removeAll();
		restoreAllNodes();
		globals.searched = false;
		return;
	}
	hitresult = project.hitTest(event.point)
	modif = event.modifiers.clone()
	gn = selector = eedge = weight = null;
	if (!hitresult) {
		var i = 0
		while (globals.graphNodes[i]) {i++;}
		gn = createGraphNode(event.point,i);
		if (i < globals.graphNodes.length) {
			globals.graphNodes[i] = gn;
		}
		else {
			globals.graphNodes.push(gn);
		}
	} else {
		switch (hitresult.item.name.match(/^\w+/)[0]){
			case 'circle':
			case 'label':
				gn = hitresult.item.parent;
				if (event.modifiers.command) {
					deleteNode(gn);
				} else {
					if(globals.graphNodes[globals.selectedNode]) {
						globals.graphNodes[globals.selectedNode].children['circle'].fillColor = 'salmon';
					}
					globals.selectedNode = globals.graphNodes.indexOf(gn);
					gn.children['circle'].fillColor = 'yellow';
				}
				break;
			case 'line':
				eedge = hitresult.item;
				if (event.modifiers.command) {
					deleteEdge(eedge.parent)
				}
				break;
			case 'weight':
				weight = hitresult.item;
				if (event.modifiers.command) {
					deleteEdge(weight.parent)
				}
				if (event.modifiers.shift) {
					weight.data.auto = true;
					weight.strokeColor = 'peru';
					updateEdgeWeight(weight.parent);
				}
				break;
		}
	}
}


function updateEdgeWeight(edge){
	var line = edge.children[0]
	var weight = edge.children[1]
	var difVector = line.segments[0].point - line.segments[1].point;
	weight.position = line.position + difVector.normalize(10).rotate(90);
	if (weight.data.auto){
		weight.content = Math.ceil(difVector.length).toString();
	}
}


var edge = null
var ngn = null
function onMouseDrag(event) {
	if (gn) {
		if (modif.shift) {
			if (!edge) {
				edge = new Group({
					children: [
						new Path.Line({
							from: gn.position,
							to: event.point,
							strokeColor: 'maroon',
							name: 'line'
						}),
						new PointText({
							position: gn.position,
							fontSize: 9,
							font: 'courier new',
							name: 'weight',
							strokeColor: 'peru',
							strokeWidth: 1,
							data: {auto: true}
						})
					],
					data: {nodes: []}
				});
				edge.sendToBack();
			} else {
				edge.children[0].segments[1].point = event.point;
				updateEdgeWeight(edge);
			}
		} else {
			gn.position += event.delta;
			gn.data.edges.forEach (function (edge) {
				edge.children[0].segments[edge.data.nodes.indexOf(gn)].point += event.delta;
				updateEdgeWeight(edge);
			});
		}
	} else if (weight) {
		weight.data.auto = false;
		weight.strokeColor = '#bd1616';
		weight.content = Math.max((parseInt(weight.content) - event.delta.y),0).toString();
	}
}

function onMouseUp(event){
	if (edge) {
		hitresult = project.hitTest(event.point);
		if(['circle','label'].indexOf(hitresult.item.name) != -1) {
			ngn = hitresult.item.parent;
			if ([].concat.apply([],gn.data.edges.map(function (edge) {
						return edge.data.nodes;
					})).indexOf(ngn) < 0 && ngn !== gn) {
				var finaledge = edge.clone();
				finaledge.children[0].segments[1].point = ngn.position;
				finaledge.data.nodes = [gn, ngn];
				updateEdgeWeight(finaledge);
				gn.data.edges.push(finaledge);
				ngn.data.edges.push(finaledge);
			};
		}
		edge.remove();
		edge = null;
	} else if (gn && !event.point.isInside(view.bounds)) {deleteNode(gn)}
}


