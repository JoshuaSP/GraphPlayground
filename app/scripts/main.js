var globals = globals || {}

paper.install(window)

var proc_color = {red: 0, green: 0.808, blue: 0.82}
var node_disc_color = {red: 0, green: 0.82, blue: 0.424}
var disc_color = {red: 0.725, green: 0.427, blue: 0.949}
var selected_edge_color = {red: 0.322, green: 0.835, blue: 0.408}

var tweenList
globals.searched = false

function runSearch(search, node, plot) {
  if (search !== salesman && !node) {
    $('#selectnode').modal('show');
    return;
  }
  if (globals.searched) {restoreAllNodes()}
  alledges.forEach(function (edge) {
    edge.remove();
  })
  if (tree.length > 0) {
    for (var i = 0; i < tree.length; i++) {
      if (Array.isArray(tree[i])) {
        tree[i].forEach ( function (tn) {
          if (tn) {tn.remove();}
        })
      } else {
        if (tree[i]) {tree[i].remove();}
      }
    }
  }
  tree = [];
  alledges = [];
  globals.searched = true;
  tweenList = [];
  tree = [];
  if (node) {node.data.level = 0;}
  search(node);
  fixpositions(plot);
  if (tweenList.length > 0) {playTweenArray(0);}
}

restoreAllNodes = function () {
  globals.graphNodes.forEach(function (node) {
    if (node) {
      if (globals.graphNodes.indexOf(node) == globals.selectedNode) {
        node.children['circle'].fillColor = 'yellow';
      } else {
        node.children['circle'].fillColor = 'salmon';
      }
      node.data.edges.forEach( function(edge) {
        edge.children['line'].strokeColor = 'maroon';
        edge.children['line'].strokeWidth = 1.6;
        edge.data.examined = false;
      })
      node.data = {
        status: null,
        edges: node.data.edges,
        dist: Infinity
      }
    }
  })
}

clearNodes = function () {
  globals.graphNodes.forEach ( function (gn) {
    if (gn) {deleteNode(gn);}
  })
  graphNodes = [];
}


function sub (a,b) {
  return new paper.Point(a.x - b.x, a.y - b.y)
}

function add (a,b) {
  return new paper.Point(a.x + b.x, a.y + b.y)
}

function scalartimes (a,b) {
  return new paper.Point(a.x * b, a.y * b)
}

fixpositions = function (plot) {
  if (!plot) {return;}
  var edgeVector,otherEdgeVector
  var collision = true;
  var i = 0;
  while (collision && i < 35) {
    collision = false;
    i++
    for (var height = 0; height < tree.length; height++) {
      for (var pos = 0; pos < tree[height].length; pos++) {
        tn = tree[height][pos]
        if (tn){
          tn.position = plot (height+1, pos+1, tree.length, tree[height].length);
          tn.position.x += tn.data.poschange;
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
                if (edgeVector.isColinear(otherEdgeVector)) {
                  if (tree[height].indexOf(othertn) > -1) {
                    collision = true;
                    tn.data.poschange += Math.floor(Math.random()*2) * radius * 5 - radius * 2.5;
                  } else {
                    collision = true;
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

otherNode = function (nodepair, node) {
  return nodepair[(nodepair.indexOf(node)+1)%2]
}

var canvaswidth = 700;
var canvasheight = 225;
var unpoint = new paper.Point (100,100);
var radius = 16;

function createTreeNode(node, parent) {
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
      edges: [],
      poschange: 0,
      parent: parent
    }
  });

  node.data.treenode = tn;
  if ( level+1 > tree.length ) {
    tree.push([tn]);
  } else {tree[level].push(tn);}
  tn.children['label'].point.x -= tn.children['label'].bounds.center.x - tn.position.x;
  tn.children['label'].point.y -= tn.children['label'].bounds.center.y - tn.position.y;
  tweenArray.push(new TWEEN.Tween(tn).to({opacity: 1}, 500))
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
  tweenArray.push(new TWEEN.Tween(edge).to({opacity: 1}, 150));
  return edge;
}

alledges = []


function animateEdgeExamine(edge) {
  edge.data.examined = true;
  tweenArray.push(new TWEEN.Tween(edge.children['line'])
    .to({strokeWidth: 6}, 400))
  tweenArray.push(new TWEEN.Tween(edge.children['line'].strokeColor)
    .to(disc_color, 400))
}

tree = []

function dFs(node) {
  if(node.data.level == 0 && node.data.status != 'discovered') {
    tweenArray = []
    colorflip(node, node_disc_color)
    createTreeNode(node, null);
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
        createTreeNode(foundNode, node);
        colorflip(foundNode, node_disc_color)
        foundNode.data.status = 'discovered'
      }
      createTreeEdge(foundNode, node, newnode);
      edge.data.examined = true;
      if (tweenArray.length > 0) addTweenArray(tweenArray);
      if (newnode) {dFs(foundNode);}
    }
  })
  tweenArray = []
  colorflip(node, proc_color)
  var i = 0
  tweenArray.push(new TWEEN.Tween(i).to(1, 350))
  addTweenArray(tweenArray);
}

function bFs(node) {
  var bFsQ = [];
  tweenArray = []
  colorflip(node, node_disc_color)
  createTreeNode(node, null);
  addTweenArray(tweenArray);
  while (true) {
    node.data.edges.forEach(function (edge) {
      var newnode = false
      tweenArray = []
      if (!edge.data.examined) {
        animateEdgeExamine(edge)
        foundNode = otherNode(edge.data.nodes, node)
        if (foundNode.data.status == null){
          newnode = true
          createTreeNode(foundNode, node);
          colorflip(foundNode, node_disc_color)
          foundNode.data.status = 'discovered'
          bFsQ.push(foundNode)
        }
        createTreeEdge(foundNode, node, newnode);
        edge.data.examined = true;
        if (tweenArray.length > 0) addTweenArray(tweenArray);
      }
    })
    tweenArray = [];
    colorflip(node, proc_color);
    // node.status = 'processed'
    var i = 0;
    tweenArray.push(new TWEEN.Tween(i).to(1, 350));
    addTweenArray(tweenArray);
    if (bFsQ.length == 0) {
      break;
    } else {
      node = bFsQ.shift();
    }
  }
  reorderTree();
}

reorderTree = function () {
  for (var i = 0; i < tree.length; i++) {
    var newindices = tree[i];
    for (var j = 1; j < tree[i].length; j++) {
      for (var k = 0; k < j; k++) {
        if (tree[i-1].indexOf(tree[i][j].data.parent) < tree[i-1].indexOf(tree[i][k].data.parent)) {
          newindices[j] = tree[i][k];
          newindices[k] = tree[i][j];
        }
      }
    }
    tree[i] = newindices
  }
}


function prim (node) {
  node.data.parent = null;
  while (true) {
    tweenArray = []
    node.data.status = 'intree'
    if (node.data.parent) {
      tweenArray.push(new TWEEN.Tween(node.data.edges.filter( function (edge) {
        return otherNode(edge.data.nodes, node) == node.data.parent;
      })[0].children['line']
      .strokeColor).to(selected_edge_color, 400))
    }
    addTweenArray(tweenArray)
    colorflip(node, proc_color)
    createTreeNode(node, node.data.parent)
    if (node.data.parent) {
      createTreeEdge(node, node.data.parent, true);
    }
    addTweenArray(tweenArray)
    node.data.edges.forEach(function (edge) {
      foundNode = otherNode(edge.data.nodes, node)
      if (!edge.data.examined && foundNode.data.status != 'intree') {
        tweenArray = []
        animateEdgeExamine(edge)
        colorflip(foundNode, node_disc_color)
        addTweenArray(tweenArray)
        foundNode.data.status = 'examined'
        if (parseInt(edge.children[1].content) < foundNode.data.dist) {
          foundNode.data.dist = parseInt(edge.children[1].content)
          foundNode.data.parent = node
        }
      }
    })
    var mapped = globals.graphNodes.map ( function (gn){
      if (!gn || gn.data.status == 'intree') {
        return Infinity;
      } else {
        return gn.data.dist;
      }
    })
    var mindist = Math.min.apply(Math, mapped);
    if (mindist == Infinity) {return;}
    node = globals.graphNodes[mapped.indexOf(mindist)];
  }
  reorderTree();
}


colorflip = function (node, color) {
  tweenArray.push (new TWEEN.Tween(node.children['circle'].fillColor).to(color, 150))
}

allEdges = function () {
  globals.graphNodes.forEach ( function (gn) {
    if (gn) {
      var already = gn.data.edges.map ( function (edge) {
        return otherNode(edge.data.nodes, gn);
      })
      var remaining = globals.graphNodes.filter ( function (remgn) {
        return already.indexOf(remgn) == -1 && gn != remgn && remgn;
      })
      paper = globals.scope1;
      remaining.forEach( function (remgn) {
        edge = new paper.Group({
          children: [
            new paper.Path.Line({
              from: gn.position,
              to: remgn.position,
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
              data: {
                auto: true,
              }
            })
          ],
          data: {
            nodes: [gn, remgn],
            gen: true
          }
        });
        edge.sendToBack();
        gn.data.edges.push(edge);
        remgn.data.edges.push(edge);
        updateEdgeWeight(edge);
      })
    }
  })
}

updateEdgeWeight = function (edge){
  var line = edge.children[0]
  var weight = edge.children[1]
  var difVector = sub(line.segments[0].point, line.segments[1].point);
  weight.position = add(line.position, difVector.normalize(10).rotate(90));
  if (weight.data.auto){
    weight.content = Math.ceil(difVector.length).toString();
  }
}

globals.secondmovie = function () {
}

function tempd (x) {
   return  9.9716068299164007e-001 * Math.pow(x,0)
        +  6.5306859581671045e-004 * Math.pow(x,1)
        + -6.1561325086651448e-005 * Math.pow(x,2)
        +  2.8538236777371032e-006 * Math.pow(x,3)
        + -6.4636309495877896e-008 * Math.pow(x,4)
        +  5.7302975738943019e-010 * Math.pow(x,5);
}

salesman = function () {
  // alledges = [];
  allEdges();
  // tn = [];
  paper = globals.scope2;
  tweenArray = [];
  globals.graphNodes.forEach( function (gn) {
    if (gn) {
      var tn = new Group ({
        position: gn.position,
        children: [
          new Path.Circle({
            center: gn.position,
            radius: radius,
            fillColor: 'salmon',
            strokeWidth: 1.6,
            strokeColor: 'black',
            name: 'circle'
          }),
          new PointText({
            position: gn.position,
            content: gn.children['label'].content,
            name: 'label'
          })],
        data: {
          edges: [],
          graphnode: gn
        }
      });
      tn.children['label'].point.x -= tn.children['label'].bounds.center.x - tn.position.x;
      tn.children['label'].point.y -= tn.children['label'].bounds.center.y - tn.position.y;
      gn.data.treenode = tn;
      tree.push(tn);
    }
  })

  var steps = tree.length;

  agacencyMatrix = new Array (steps);
  for (var i = 0; i < steps; i++) {
    agacencyMatrix[i] = new Array (steps);
    for (var j = 0; j < steps; j++) {
      agacencyMatrix[i][j] = {
        edge: null,
        dist: null
      }
    }
  }
  for (var i = 0; i < steps - 1; i++) {
    for (var j = i + 1; j < steps; j++) {
      agacencyMatrix[i][j].edge = agacencyMatrix[j][i].edge = createTreeEdge(tree[i].data.graphnode, tree[j].data.graphnode, true)
      agacencyMatrix[j][i].dist = agacencyMatrix[i][j].dist = parseInt(tree[i].data.graphnode.data.edges.filter(function (edge) {
        return otherNode(edge.data.nodes, tree[i].data.graphnode) == tree[j].data.graphnode;
      })[0].children[1].content)
    }
  }

  currentTour = new Array (steps);
  for (var i = 0; i < steps; i++) {
    currentTour[i] = i;
  }
  shuffleArray(currentTour);
  var temp = 1.0;
  var tempdec = tempd(steps);
  
  var k, flips, checkcost, currentcost, startcost, delta, tmp, flip1, flip2
  startTour = []

  tweenList = [];

  globals.secondMovie = function () {

    console.log(temp *= Math.pow(tempdec,annealframe));

    for (var i = 0; i < steps; i++) {
      tree[i].children['circle'].fillColor.red = 1 - (1 - temp * temp * temp) * 0.569;
      tree[i].children['circle'].fillColor.green = 0.549 - (1 - temp * temp * temp) * 0.118;
      tree[i].children['circle'].fillColor.blue = 0.412 + (1 - temp * temp * temp) * 0.188;
    }

    startcost = function () {return tourCost(currentTour)}();
    currentcost = startcost;
    startTour = currentTour.slice(0,steps);

    for (var i = 0; i < annealframe; i++) {

      flip1 = Math.floor(Math.random() * steps)
      flip2 = Math.floor(Math.random() * steps)

      tmp = currentTour[flip1];
      currentTour[flip1] = currentTour[flip2];
      currentTour[flip2] = tmp;

      delta = function(){ return tourCost(currentTour)}() - currentcost;

      if ( (delta < 0) || (Math.pow(Math.E, 0.1*(-delta)/temp) > Math.random()) ) {
        currentcost += delta;
      } else {
        currentTour[flip2] = currentTour[flip1];
        currentTour[flip1] = tmp;
      }
    }

    if (currentcost < startcost) {
      temp /= tempdec
    }

    for (var i = 0; i < steps; i++) {
      agacencyMatrix[ startTour[i] ][ startTour[(i + 1) % steps] ].edge.opacity = 0;
      agacencyMatrix[ currentTour[i] ][ currentTour[(i + 1) % steps] ].edge.opacity = 1;
    }
  }
}


tourCost = function(tour) {
  var sum = 0
  for (var i = 0; i < tour.length; i++) {
    sum += agacencyMatrix[ tour[i] ][ tour[(i + 1) % tour.length] ].dist
  }
  return sum;
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

var visible = true

toggleweight = function () {
  globals.graphNodes.forEach ( function (gn) {
    if (gn) {
      gn.data.edges.forEach( function (edge) {
        edge.children[1].opacity = visible ? 0 : 1
      })
    }
  })
  visible = !visible
}

clearEdges = function () {
  globals.graphNodes.forEach ( function (gn) {
    if (gn) {
      for (var i = gn.data.edges.length - 1; i >= 0; i--){
        var edge = gn.data.edges[i];
        if (edge.data.gen) {deleteEdge(edge);}
      }
    }
  })
  if (globals.searched) {
    TWEEN.removeAll();
    restoreAllNodes();
    globals.secondMovie = function () {};
    globals.searched = false;
  }
}

var annealframe = 1;

$('document').ready( function () {
  var speedSlider = $('input.slider').slider({
    orientation: 'vertical',
    min: 1,
    max: 10,
    step: 0.1,
    tooltip: 'hide',
    value: 5,
    reversed: true
  })
  speedSlider.css('visibility', 'visible')
  speedSlider.on("slide", function (slideEvt) {
    TWEEN.speed(slideEvt.value/3);
    annealframe = slideEvt.value * 2 - 1;
  })

  

  setTimeout( function() {
    $('#dfs').on('click', function () {
      runSearch (dFs, globals.graphNodes[globals.selectedNode], dFsPlot)
    })
    $('#prim').on('click', function () {
      runSearch (prim, globals.graphNodes[globals.selectedNode], dFsPlot)
    })
    $('#bfs').on('click', function () {
      runSearch (bFs, globals.graphNodes[globals.selectedNode], dFsPlot)
    })
    $('#salesman').on('click', function () {
      runSearch (salesman, globals.graphNodes[globals.selectedNode], null);
    })
    $('#alledges').on('click', function () {
      allEdges()
    })
    $('#clearedges').on('click', function () {
      clearEdges();
    })
    $('#toggleweight').on('click', function () {
      toggleweight();
    })
    $('#clear').on('click', function () {
      clearNodes()
    })
    $('#instruction').on('click', function () {
      $('#instructions').modal('show');
    })
  }, 2000);
  $
})
