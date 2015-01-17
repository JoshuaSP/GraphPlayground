function toAlpha(num) {
	return (num >= 26 ? String.fromCharCode(Math.floor(num/26)+64) : "") + String.fromCharCode(num%26 + 65);
}

var radius = 16


function GraphNode (point,i) {
	this.point = point;
	this.edges = [];
	this.selected = false;
	this.labelText = toAlpha(i);
	this.circ = new Path.Circle({
			center: point,
			radius: radius
		});
	this.label = new PointText({
			point: point,
			content: this.labelText
		});
	console.log(this.label.bounds.center)
	console.log(this.circ.position)
	this.label.point -= this.label.bounds.center - this.circ.position
	var that = this;
	this.circ.onClick = function (event) {
		if (Key.isDown('command')) {
			this.remove();
			that.label.remove();
			graphNodes[i]=null;
		}
		else {
			that.selected = true;
			this.style = {fillColor: 'yellow'};
			graphNodes.forEach (function(node) {
				console.log (node)
				if (that !== node) {
					node.selected = false
					node.circ.style = {fillColor: 'salmon'};
				}
			});
			console.log(graphNodes)
		}
	}
}

var graphNodes = []

project.currentStyle = {
	strokeColor: '#000000',
	fillColor: 'salmon',
	strokeWidth: 1.6
};


function onMouseDown(event) {
	// Add a segment to the path at the position of the mouse:
	if (!project.hitTest(event.point)) {
		var i = 0
		while (graphNodes[i]) {i++;}
		var newNode = new GraphNode(event.point,i);
		if (i < graphNodes.length) {
			graphNodes[i] = newNode;
		}
		else {
			graphNodes.push(newNode);
		}
		// var circ = new Path.Circle({
		// 	center: event.point,
		// 	radius: 20
		// });
		// circ.onClick = function (event) {this.remove();}
	}
}


