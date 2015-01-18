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
		idx: i
	});
	gn.children['label'].point -= gn.children['label'].bounds.center - point;
	return gn;
}


var graphNodes = []

project.currentStyle = {
	strokeColor: '#000000',
	fillColor: 'salmon',
	strokeWidth: 1.6
};


var gn = selectedNode = null
function onMouseDown(event) {
	hitresult = project.hitTest(event.point)
	gn = null
	if (!hitresult) {
		var i = 0
		while (graphNodes[i]) {i++;}
		var newNode = createGraphNode(event.point,i);
		if (i < graphNodes.length) {
			graphNodes[i] = newNode;
		}
		else {
			graphNodes.push(newNode);
		}
	} else if(['circle','label'].indexOf(hitresult.item.name) != -1) {
		gn = hitresult.item.parent;
		if (event.modifiers.command) {
			graphNodes[gn.idx] = null;
			gn.remove();
		} else {
			if(graphNodes[selectedNode]) {
				graphNodes[selectedNode].children['circle'].fillColor = 'salmon';
			}
			selectedNode = gn.idx;
			gn.children['circle'].fillColor = 'yellow';
		}
	}
}

function onMouseDrag(event) {
	if (gn) {
		gn.position += event.delta;
	}
}


