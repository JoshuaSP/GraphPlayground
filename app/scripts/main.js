console.log('\'Allo \'Allo!');

// var scope = new paper.PaperScope()

// paper.setup('canvas1')
// paper.setup('canvas2')

// var view_1 = scope.View._viewsById['canvas1'];
// scope.setup(canvas1);
// var view_2 = scope.View._viewsById['canvas2'];
// scope.setup(canvas2);

var proc_color = 'darkturquoise'
var disc_color = 'gold'

var tweenList

function runSearch(search, node) {
	graphNodes1.forEach( function (gn) {
		restoreNode(gn);
	})
	graphNodes2.forEach( function (gn) {
		deleteNode(gn);
	})
	tweenList = [];
	search(node);
	tweenList.shift().start();
}

function addTween (tween) {
	tweenList.push(tween.onComplete(nextTween()))
}

function nextTween () {
	if (tweenList.length > 0) tweenList.shift().start();
}

function otherNode (nodelist, node) {
	return nodelist[(nodelist.indexOf(node)+1)%2]
}

function dFs(node) {
	node.data.edges.forEach(function (edge) {
		if (!edge.data.created) {
			edge.data.created = true;
		}
	})
}

// function checker() {
// 	// pscope2.activate();
// 	var check = {
// 		circ: new paper.Path.Circle({
// 			radius: 15,
// 			center: new paper.Point (100,100)
// 		}),
// 		circ2: new paper.Path.Circle({
// 			radius: 20,
// 			center: new paper.Point (150,75)
// 		})
// 	}
// 	tween = new TWEEN.tween(check.circ.position);
// 	tween.to({x: 200}, 2500);
// 	tween.start();
// }
globals = {}

$('document').ready( function () {
	// console.log(checker)
	setTimeout( function() {
		pscope1 = paper.PaperScope.get(1);
		pscope2 = paper.PaperScope.get(2);
		pscope1.activate()
		$('#dfs').on('click', function () {
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
		})
	}, 2000);
})
