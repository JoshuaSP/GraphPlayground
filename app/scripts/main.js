console.log('\'Allo \'Allo!');


var spd = 3
paper.install(window)
// var scope = new paper.PaperScope()

// paper.setup('canvas1')
// paper.setup('canvas2')

// var view_1 = scope.View._viewsById['canvas1'];
// scope.setup(canvas1);
// var view_2 = scope.View._viewsById['canvas2'];
// scope.setup(canvas2);

var proc_color = {hue: 181, saturation: 1.0, brightness: 0.82}
var disc_color = {hue: 51, saturation: 1.0, brightness: 1.0}

var tweenList
searched = false

function runSearch(search, node) {
  if (!node) return;
  if (searched) {globals.graphNodes.forEach( function (gn) {
    restoreNode(gn);
  })}
  tree.forEach( function (level) {
    level.forEach ( function (pos) {
      deleteNode(tree[level][pos]);
    })
  })
  tweenList = [];
  tree = [];
  node.data.level = 0;
  search(node);
  debugger;
  playTweenArray(0);
}

deleteNode = function (){

}

function addTweenArray (tweenArray) {
  var tweenStack = {
    tweenArray: tweenArray,
    id: tweenList.length,
    completed: 0,
    fired: false
  }
  tweenStack.tweenArray.forEach( function (tween) {
    tween.onComplete(function () {
      return completeTween(tweenStack);
    })
  })
  tweenList.push(tweenStack);
}


function completeTween (tweenStack) {
  // console.log(TWEEN.getAll())
  // debugger;

  console.log(tweenStack)
  tweenStack.completed++
  if (tweenStack.completed >= tweenStack.tweenArray.length && !tweenStack.fired && tweenList.length > 0) {
    playTweenArray(tweenStack.id + 1);
    tweenStack.fired = true;
  }
}

// function nextTweenArray () {
//   var tweenStack = tweenList.shift();
//   tweenStack.tweenArray.forEach (function (tween) {
//     tween.start();
//   })
// }

playTweenArray = function (id) {
  tweenList[id].tweenArray.forEach (function (tween) {
    tween.start();
  })
}

function otherNode (nodepair, node) {
  return nodepair[(nodepair.indexOf(node)+1)%2]
}

var canvaswidth = 700;
var canvasheight = 225;
var unpoint = new paper.Point (100,100);
var radius = 16;

function createTreeNode(node, parent, plotfunction) {
  var newpos
  var level = parent ? parent.data.level + 1 : 0;
  node.data.level = level;
  paper = pscope2;
  var tn = new Group ({
    opacity: 0,
    position: unpoint,
    children: [
      new Path.Circle({
        center: unpoint,
        radius: radius,
        fillColor: 'salmon',
        strokeWidth: 1.6,
        strokeColor: 'black',
        name: 'circle'
      }),
      new PointText({
        position: unpoint,
        content: node.children['label'].content,
        name: 'label'
      })],
    data: {
      edges: []
    }
  });

  node.data.treenode = tn;
  if ( level+1 > tree.length ) {
    tree.push([tn]);
  } else {tree[level].push(tn);}
  console.log( tn.position = plotfunction(level+1, tree[level].length, tree.length, tree[level].length))
  tn.children['label'].point.x -= tn.children['label'].bounds.center.x - tn.position.x;
  tn.children['label'].point.y -= tn.children['label'].bounds.center.y - tn.position.y;
   // debugger;
  tweenArray.push(new TWEEN.Tween(tn).to({opacity: 1}, 500 * spd))
  var tweenArray2 = []
  for (height = 0; height < tree.length; height++) {
    for (pos = 0; pos < tree[height].length; pos++) {
      tn = tree[height][pos]
      newpos = plotfunction (height+1, pos+1, tree.length, tree[height].length);
      if (newpos !== tn.position) {
        tweenArray2.push(new TWEEN.Tween(tn.position).to({x: newpos.x, y: newpos.y}, 1000*spd));
        tn.data.edges.forEach ( function (edge) {
          tweenArray2.push(new TWEEN.Tween(edge.segments[edge.data.nodes.indexOf(tn)].point)
            .to({x: newpos.x, y: newpos.y}, 1000*spd));
        })
      }
    }
  }
  addTweenArray(tweenArray2)
  addTweenArray(tweenArray)
}


dFsPlot = function (height, pos, treeheight, leveldepth) {  // all 1-indexed
  var x,y;
  if (treeheight <= 5) { x = canvaswidth * ( (height) / 6); }
    else {x = canvaswidth * height / (treeheight + 1);}
  y = canvasheight * pos / (leveldepth + 1);
  return new paper.Point(x, y);
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
  edge.sendToBack();
  [tn, ptn].forEach ( function (thistn) {
    thistn.data.edges.push(edge);
  })
  tweenArray.push(new TWEEN.Tween(edge).to({opacity: 1}, spd*500));
}



function animateEdgeExamine(edge) {
  edge.data.examined = true;
  tweenArray.push(new TWEEN.Tween(edge.children['line'])
    .to({strokeWidth: 15}, 800*spd))
  tweenArray.push(new TWEEN.Tween(edge.children['line'].strokeColor)
    .to(disc_color, 800*spd))
}

tree = []

function dFs(node) {
  if(node.data.level == 0) {
    tweenArray = []
    createTreeNode(node, null, dFsPlot);
    node.data.status = 'discovered'
    addTweenArray(tweenArray);
  }
  node.data.edges.forEach(function (edge) {
    tweenArray = []
    if (!edge.data.examined) {
      animateEdgeExamine(edge)
      foundNode = otherNode(edge.data.nodes, node)
      if (foundNode.data.status != 'discovered'){
        foundNode.data.status = 'discovered'
        createTreeNode(foundNode, node, dFsPlot);
      }
      createTreeEdge(foundNode, node, dFsPlot);
      if (tweenArray.length > 0) addTweenArray(tweenArray);
      dFs(foundNode);
    }
  })
  tweenArray = [new TWEEN.Tween(node.children['circle'].fillColor).to(proc_color, 400*spd)];
  addTweenArray(tweenArray);
}




$('document').ready( function () {
  // console.log(checker)
  setTimeout( function() {
    pscope1 = paper.PaperScope.get(1);
    pscope2 = paper.PaperScope.get(2);
    $('#dfs').on('click', function () {
      runSearch (dFs, globals.graphNodes[globals.selectedNode])
    })
  }, 2000);
  $
})
