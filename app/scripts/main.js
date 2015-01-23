console.log('\'Allo \'Allo!');

var globals = globals || {}


var spd = 1
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
globals.searched = false

function runSearch(search, plot, node) {
  if (!node) return;
  if (globals.searched) {globals.restoreAllNodes()}
  alledges.forEach(function (edge) {
    edge.remove();
  })
  if (tree.length > 0) {
    tree.reduce(function (a,b){return a.concat(b);}).forEach(function (treenode) {
      if (treenode) {treenode.remove()};
    })
  }
  tree = [];
  alledges = [];
  globals.searched = true;
  tree.forEach( function (level) {
    level.forEach ( function (pos) {
      deleteNode(tree[level][pos]);
    })
  })
  tweenList = [];
  tree = [];
  node.data.level = 0;
  search(node);
  fixpositions(plot);
  playTweenArray(0);
}

restoreAllNodes = function () {
  globals.graphNodes.forEach(function (node) {
    node.children['circle'].fillColor = 'salmon';
    node.data.edges.forEach( function(edge) {
      edge.children['line'].strokeColor = 'maroon';
      edge.children['line'].strokeWidth = 1.6;
      edge.data.examined = false;
    })
    node.data = {status: null,
      edges: node.data.edges}
  })
}


function sub (a,b) {
  return new paper.Point(a.x - b.x, a.y - b.y)
}

function add (a,b) {
  return new paper.Point(a.x + b.x, a.y + b.y)
}

fixpositions = function (plot) {
  var edgeVector,otherEdgeVector
  var collision = true;
  var i = 0;
  while (collision && i < 35) {
    collision = false;
    i++
    console.log(tree);
    for (var height = 0; height < tree.length; height++) {
      for (var pos = 0; pos < tree[height].length; pos++) {
        tn = tree[height][pos]
        if (tn){
          tn.position = plot (height+1, pos+1, tree.length, tree[height].length);
          for (var edgeindex = 0; edgeindex<tn.data.edges.length; edgeindex++) {
            edge = tn.data.edges[edgeindex]
            edge.segments[edge.data.nodes.indexOf(tn)].point = tn.position;
          }
        }
      }
    }
    colloop: for (height = tree.length - 1; height >= 0; height--) {
      for (pos = 0; pos < tree[height].length; pos++) {
        tn = tree[height][pos]
        if (tn){
          for (var edgeindex = 0; edgeindex<tn.data.edges.length; edgeindex++) {
            edge = tn.data.edges[edgeindex]
            edgeVector = sub(edge.segments[1].point, edge.segments[0].point)
            var othertn = otherNode(edge.data.nodes, tn)
            for (var otheredgeindex = 0; otheredgeindex < othertn.data.edges.length; otheredgeindex++) {
              otherEdge = othertn.data.edges[otheredgeindex]
              if (otherEdge !== edge) {
                otherEdgeVector = sub(otherEdge.segments[1].point, otherEdge.segments[0].point)
                console.log(edgeVector, otherEdgeVector)
                if (edgeVector.isColinear(otherEdgeVector)) {
                  collision = true;
                  if (tree[height].indexOf(othertn) > -1) {
                    tree[height].splice(pos,1);
                    if (height = tree.length) {
                      tree.push([tn])
                    } else {
                      tree[height+1].push(tn)
                    }
                  } else {
                    if (Math.random() > 0.5) {
                      tree[height].splice(pos,0,null);
                    }
                    else {
                      tree[height].splice(pos+1,0,null);
                    }
                  }
                  break colloop;
                }
              }
            } 
          }

        }
      }
    }
  }
  alledges.forEach(function(edge) {
    edgeVector = sub(edge.segments[1].point, edge.segments[0].point)
    edge.segments[0].point = add(edge.segments[0].point, edgeVector.normalize(radius))
    edge.segments[1].point = sub(edge.segments[1].point, edgeVector.normalize(radius))
  })
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
  tweenStack.completed++
  if (tweenStack.completed >= tweenStack.tweenArray.length && !tweenStack.fired && tweenStack.id + 1 < tweenList.length) {
    playTweenArray(tweenStack.id + 1);
    tweenStack.fired = true;
  }
}

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
  paper = globals.scope2;
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
  // var tweenArray2 = []
  // for (height = 0; height < tree.length; height++) {
  //   for (pos = 0; pos < tree[height].length; pos++) {
  //     tn = tree[height][pos]
  //     newpos = plotfunction (height+1, pos+1, tree.length, tree[height].length);
  //     if (newpos !== tn.position) {
  //       tweenArray2.push(new TWEEN.Tween(tn.position).to({x: newpos.x, y: newpos.y}, 1000*spd));
  //       tn.data.edges.forEach ( function (edge) {
  //         tweenArray2.push(new TWEEN.Tween(edge.segments[edge.data.nodes.indexOf(tn)].point)
  //           .to({x: newpos.x, y: newpos.y}, 1000*spd));
  //       })
  //     }
  //   }
  // }
  // addTweenArray(tweenArray2)
  addTweenArray(tweenArray)
}


dFsPlot = function (height, pos, treeheight, leveldepth) {  // all 1-indexed
  var x,y;
  if (treeheight <= 5) { x = canvaswidth * ( (height) / 6); }
    else {x = canvaswidth * height / (treeheight + 1);}
  y = canvasheight * pos / (leveldepth + 1);
  return new paper.Point(x, y);
}

createTreeEdge = function (node, parent, newnode) {
  paper = globals.scope2;
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
  if (!newnode) {edge.dashArray = [9,5];}
  edge.sendToBack();
  [tn, ptn].forEach ( function (thistn) {
    thistn.data.edges.push(edge);
  })
  alledges.push(edge)
  tweenArray.push(new TWEEN.Tween(edge).to({opacity: 1}, spd*500));
}

alledges = []


function animateEdgeExamine(edge) {
  edge.data.examined = true;
  tweenArray.push(new TWEEN.Tween(edge.children['line'])
    .to({strokeWidth: 15}, 800*spd))
  tweenArray.push(new TWEEN.Tween(edge.children['line'].strokeColor)
    .to(disc_color, 800*spd))
}

tree = []

function dFs(node) {
  if(node.data.level == 0 && node.data.status != 'discovered') {
    tweenArray = []
    createTreeNode(node, null, dFsPlot);
    node.data.status = 'discovered'
    addTweenArray(tweenArray);
  }
  node.data.edges.forEach(function (edge) {
    var newnode = false
    tweenArray = []
    if (!edge.data.examined) {
      animateEdgeExamine(edge)
      foundNode = otherNode(edge.data.nodes, node)
      if (foundNode.data.status !== 'discovered'){
        newnode = true
        createTreeNode(foundNode, node, dFsPlot);
        foundNode.data.status = 'discovered'
      }
      createTreeEdge(foundNode, node, newnode);
      edge.data.examined = true;
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
    $('#dfs').on('click', function () {
      runSearch (dFs, dFsPlot, globals.graphNodes[globals.selectedNode])
    })
  }, 2000);
  $
})
