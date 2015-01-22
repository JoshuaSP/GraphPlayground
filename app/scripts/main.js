console.log('\'Allo \'Allo!');

var spd = 1
paper.install(window)
// var scope = new paper.PaperScope()

// paper.setup('canvas1')
// paper.setup('canvas2')

// var view_1 = scope.View._viewsById['canvas1'];
// scope.setup(canvas1);
// var view_2 = scope.View._viewsById['canvas2'];
// scope.setup(canvas2);

var proc_color = {hue: 181, saturation: 1.0, brightness: 0.82)
var disc_color = {hue: 51, saturation: 1.0, brightness: 1.0}

var tweenList
searched = false

function runSearch(search, node) {
	if !node break;
	if (searched) {graphNodes1.forEach( function (gn) {
		restoreNode(gn);
	})}
	graphNodes2.forEach( function (gn) {
		deleteNode(gn);
	})
	tweenList = [];
	tree = [];
	node.data.level = 0;
	search(node);
	nextTweenArray();
}

function addTweenArray (tweenArray) {
	tweenArray.forEach( function (tween) {
		tween.onComplete(completeTween(tweenArray.length))
	})
	tweenList.push(tweenArray);
}

var completed = 0

function completeTween (tweens) {
	completed++
	if (completed >= tweens && tweenList.length > 0) {
		completed = 0;
		nextTweenArray();
	}
}

function nextTweenArray () {
	tweenArray = tweenList.shift();
	tweenArray.forEach (function (tween) {
		tween.start();
	})
}

function otherNode (nodepair, node) {
	return nodepair[(nodelist.indexOf(node)+1)%2]
}

var canvaswidth = 700
var canvasheight = 200
var unpoint = new paper.Point (0,0)

function createTreeNode(node, parent, plotfunction) {
	var newpos, heightchanged = false
	var level = parent.data.level + 1;
	paper = pscope2;
	var tn = new Group ({
		opacity: 0,
		position: unpoint,
		children: [
			new Path.Circle({
				center: unpoint,
				radius: radius,
				fillColor: 'salmon',
				name: 'circle'
			}),
			new PointText({
				position: unpoint,
				content: node.children['label'].content,
				name: 'label'
			})],
		data: {
			edges: [],
			level: level 
		}
	});
	node.data.treenode = tn;
	if (level > tree.length) {
		tree.push([tn]);
	}	else {tree[level].push(tn);}
	tn.position = plotfunction (level+1, tree[level].length, tree.length, tree[level].length)
	tn.children['label'].point -= tn.children['label'].bounds.center - tn.position;
	tweenArray.push(new TWEEN.Tween(tn).to({opacity: 1}, 500 * spd))
	for (height = 0; height < tree.length, height++) {
		for (pos = 0; pos < tree[height].length, pos++) {
			tn = tree[height][pos]
			newpos = plotfunction (height+1, pos+1, tree.length, tree[level].length);
			if (newpos !== tn.position) {
				tweenArray.push(new TWEEN.Tween(tn.position).to({x: newpos.x, y: newpos.y}, 1000*spd);
				tn.data.edges.forEach ( function (edge) {
					tweenArray.push(new TWEEN.Tween(edge.segments[edge.data.nodes.indexOf(tn)].point)
						.to({x: nepos.x, y: newpos.y}, 1000*spd))
				})
			}
		}
	}
}

createTreeEdge = function (node, parent) {
	paper = pscope2;
	var tn = node.data.treenode;
	var ptn = parent.data.treenode; 
	var edge = new paper.Path.Line({
		opacity: 0,
		from: tn.position,
		to: ptn.position,
		strokeColor: 'maroon',
		strokeWidth: 1.6,
		data: {
			nodes: [tn, ptn]
		}
	});
	[tn, ptn].forEach ( function (thistn) {
		thistn.data.edges.push(edge);
	})
	tweenArray.push(new TWEEN.Tween(edge).to({opacity: 1}, spd*500));
}


dFsPlot = function (height, pos, treeheight, leveldepth) {
	var x,y
	if (treeheight <= 5) { x = canvaswidth * ( (level) / 6); }
		else {x = canvaswidth * level / (treeheight + 1);}
	y = canvasheight * (pos / leveldepth + 1);
	return new paper.Point(x, y);
}


function animateEdgeExamine(edge) {
	edge.data.examined = true;
	tweenArray.push(new TWEEN.Tween(edge.children['line'])
		.to({strokeWidth: 3.5}, 0.4))
	tweenArray.push(new TWEEN.Tween(edge.children['line'].strokeColor)
		.to(disc_color, 400*spd))
}

var tree = []

function dFs(node) {
	if(node.data.level == 0) {
		tweenArray = []
		createTreeNode(node, null, true);
		addTweenArray(tweenArray);
	}
	node.data.edges.forEach(function (edge) {
		tweenArray = []
		if (!edge.data.examined) {
			animateEdgeExamine(edge)
			foundNode = otherNode(edge.nodes, node)
			if (foundNode.data.status != 'discovered'){
				foundNode.data.status = 'discovered'
				createTreeNode(foundNode, node, dFsPlot);
			}
			createTreeEdge(foundNode, node);
			if (tweenArray.length > 0) addTweenArray(tweenArray);
			dFs(foundNode);
		}
	})
	tweenArray = [new TWEEN.Tween(node.fillColor).to(proc_color, 400*spd)];
	addTweenArray(tweenArray);
}


globals = {}

$('document').ready( function () {
	// console.log(checker)
	setTimeout( function() {
		pscope1 = paper.PaperScope.get(1);
		pscope2 = paper.PaperScope.get(2);
		$('#dfs').on('click', function () {
			runSearch (dFs, gn[selectedNode])
		})
	}, 2000);
})
