function toAlpha(a){return(a>=26?String.fromCharCode(Math.floor(a/26)+64):"")+String.fromCharCode(a%26+65)}function onFrame(){TWEEN.update()}function createGraphNode(a,b){var c=new Group({position:a,children:[new Path.Circle({center:a,radius:radius,fillColor:"salmon",name:"circle"}),new PointText({position:a,content:toAlpha(b),strokeWidth:1.1,name:"label"})],data:{edges:[],status:null,dist:1/0}});return c.children.label.point-=c.children.label.bounds.center-a,c}function onMouseDown(a){if(globals.searched)return TWEEN.removeAll(),restoreAllNodes(),globals.secondMovie=function(){},void(globals.searched=!1);if(hitresult=project.hitTest(a.point),modif=a.modifiers.clone(),gn=selector=edge=eedge=weight=null,hitresult){if(!hitresult.item.name)return;switch(hitresult.item.name.match(/^\w+/)[0]){case"circle":case"label":gn=hitresult.item.parent,modif.command?(deleteNode(gn),gn=null):(globals.graphNodes[globals.selectedNode]&&(globals.graphNodes[globals.selectedNode].children.circle.fillColor="salmon"),globals.selectedNode=globals.graphNodes.indexOf(gn),gn.children.circle.fillColor="yellow");break;case"line":eedge=hitresult.item,a.modifiers.command&&deleteEdge(eedge.parent);break;case"weight":weight=hitresult.item,a.modifiers.command&&deleteEdge(weight.parent),a.modifiers.shift&&(weight.data.auto=!0,weight.strokeColor="peru",updateEdgeWeight(weight.parent))}}else{for(var b=0;globals.graphNodes[b];)b++;gn=createGraphNode(a.point,b),b<globals.graphNodes.length?globals.graphNodes[b]=gn:globals.graphNodes.push(gn)}}function onMouseDrag(a){gn?modif.shift?edge?(edge.children[0].segments[1].point=a.point,updateEdgeWeight(edge)):(edge=new Group({children:[new Path.Line({from:gn.position,to:a.point,strokeColor:"maroon",name:"line"}),new PointText({position:gn.position,fontSize:9,font:"courier new",name:"weight",strokeColor:"peru",strokeWidth:1,data:{auto:!0}})],data:{nodes:[]}}),edge.sendToBack()):(gn.position+=a.delta,gn.data.edges.forEach(function(b){b.children[0].segments[b.data.nodes.indexOf(gn)].point+=a.delta,updateEdgeWeight(b)})):weight&&(weight.data.auto=!1,weight.strokeColor="#bd1616",weight.content=Math.max(parseInt(weight.content-a.delta.y),0).toString())}function onMouseUp(a){if(edge){if(hitresult=project.hitTest(a.point),-1!==["circle","label"].indexOf(hitresult.item.name)&&(ngn=hitresult.item.parent,[].concat.apply([],gn.data.edges.map(function(a){return a.data.nodes})).indexOf(ngn)<0&&ngn!==gn)){var b=edge.clone();b.children[0].segments[1].point=ngn.position,b.data.nodes=[gn,ngn],updateEdgeWeight(b),gn.data.edges.push(b),ngn.data.edges.push(b)}edge.remove(),edge=null}else gn&&!a.point.isInside(view.bounds)&&deleteNode(gn)}function onFrame(){TWEEN.update(),globals.secondMovie()}function onMouseDown(a){var b=project.hitTest(a.point);if(b&&b.item.name){var c=b.item.name.match(/^\w+/)[0];tn="circle"===c||"label"===c?b.item.parent:null}}function onMouseDrag(a){TWEEN.getAll().length>0||tn&&(tn.position+=a.delta,tn.data.edges.forEach(function(a){var b=a.data.nodes.indexOf(tn),c=(b+1)%2;a.segments[b].point=tn.position,a.segments[c].point=a.data.nodes[c].position}))}function runSearch(a,b,c){if(a!==salesman&&!b)return void $("#selectnode").modal("show");if(globals.searched&&restoreAllNodes(),alledges.forEach(function(a){a.remove()}),tree.length>0)for(var d=0;d<tree.length;d++)Array.isArray(tree[d])?tree[d].forEach(function(a){a&&a.remove()}):tree[d]&&tree[d].remove();tree=[],alledges=[],globals.searched=!0,tweenList=[],tree=[],b&&(b.data.level=0),a(b),fixpositions(c),tweenList.length>0&&playTweenArray(0)}function sub(a,b){return new paper.Point(a.x-b.x,a.y-b.y)}function add(a,b){return new paper.Point(a.x+b.x,a.y+b.y)}function scalartimes(a,b){return new paper.Point(a.x*b,a.y*b)}function addTweenArray(a){var b={tweenArray:a,id:tweenList.length,completed:0,fired:!1};b.tweenArray.forEach(function(a){a.onComplete(function(){return completeTween(b)})}),tweenList.push(b)}function completeTween(a){a.completed++,a.completed>=a.tweenArray.length&&!a.fired&&a.id+1<tweenList.length&&(playTweenArray(a.id+1),a.fired=!0)}function createTreeNode(a,b){var c=b?b.data.level+1:0;a.data.level=c,paper=globals.scope2;var d=new Group({opacity:0,position:unpoint,children:[new Path.Circle({center:unpoint,radius:radius,fillColor:"salmon",strokeWidth:1.6,strokeColor:"black",name:"circle"}),new PointText({position:unpoint,content:a.children.label.content,name:"label"})],data:{edges:[],poschange:0,parent:b}});a.data.treenode=d,c+1>tree.length?tree.push([d]):tree[c].push(d),d.children.label.point.x-=d.children.label.bounds.center.x-d.position.x,d.children.label.point.y-=d.children.label.bounds.center.y-d.position.y,tweenArray.push(new TWEEN.Tween(d).to({opacity:1},500)),addTweenArray(tweenArray)}function animateEdgeExamine(a){a.data.examined=!0,tweenArray.push(new TWEEN.Tween(a.children.line).to({strokeWidth:6},400)),tweenArray.push(new TWEEN.Tween(a.children.line.strokeColor).to(disc_color,400))}function dFs(a){0==a.data.level&&"discovered"!=a.data.status&&(tweenArray=[],colorflip(a,node_disc_color),createTreeNode(a,null),a.data.status="discovered",addTweenArray(tweenArray)),a.data.edges.forEach(function(b){var c=!1;tweenArray=[],b.data.examined||(animateEdgeExamine(b),foundNode=otherNode(b.data.nodes,a),"discovered"!==foundNode.data.status&&(c=!0,createTreeNode(foundNode,a),colorflip(foundNode,node_disc_color),foundNode.data.status="discovered"),createTreeEdge(foundNode,a,c),b.data.examined=!0,tweenArray.length>0&&addTweenArray(tweenArray),c&&dFs(foundNode))}),tweenArray=[],colorflip(a,proc_color);var b=0;tweenArray.push(new TWEEN.Tween(b).to(1,350)),addTweenArray(tweenArray)}function bFs(a){var b=[];for(tweenArray=[],colorflip(a,node_disc_color),createTreeNode(a,null),addTweenArray(tweenArray);;){a.data.edges.forEach(function(c){var d=!1;tweenArray=[],c.data.examined||(animateEdgeExamine(c),foundNode=otherNode(c.data.nodes,a),null==foundNode.data.status&&(d=!0,createTreeNode(foundNode,a),colorflip(foundNode,node_disc_color),foundNode.data.status="discovered",b.push(foundNode)),createTreeEdge(foundNode,a,d),c.data.examined=!0,tweenArray.length>0&&addTweenArray(tweenArray))}),tweenArray=[],colorflip(a,proc_color);var c=0;if(tweenArray.push(new TWEEN.Tween(c).to(1,350)),addTweenArray(tweenArray),0==b.length)break;a=b.shift()}reorderTree()}function prim(a){for(a.data.parent=null;;){tweenArray=[],a.data.status="intree",a.data.parent&&tweenArray.push(new TWEEN.Tween(a.data.edges.filter(function(b){return otherNode(b.data.nodes,a)==a.data.parent})[0].children.line.strokeColor).to(selected_edge_color,400)),addTweenArray(tweenArray),colorflip(a,proc_color),createTreeNode(a,a.data.parent),a.data.parent&&createTreeEdge(a,a.data.parent,!0),addTweenArray(tweenArray),a.data.edges.forEach(function(b){foundNode=otherNode(b.data.nodes,a),b.data.examined||"intree"==foundNode.data.status||(tweenArray=[],animateEdgeExamine(b),colorflip(foundNode,node_disc_color),addTweenArray(tweenArray),foundNode.data.status="examined",parseInt(b.children[1].content)<foundNode.data.dist&&(foundNode.data.dist=parseInt(b.children[1].content),foundNode.data.parent=a))});var b=globals.graphNodes.map(function(a){return a&&"intree"!=a.data.status?a.data.dist:1/0}),c=Math.min.apply(Math,b);if(1/0==c)return;a=globals.graphNodes[b.indexOf(c)]}reorderTree()}function tempd(a){return.9971606829916401*Math.pow(a,0)+.0006530685958167105*Math.pow(a,1)+-6156132508665145e-20*Math.pow(a,2)+28538236777371032e-22*Math.pow(a,3)+-6.46363094958779e-8*Math.pow(a,4)+5.730297573894302e-10*Math.pow(a,5)}function shuffleArray(a){for(var b=a.length-1;b>0;b--){var c=Math.floor(Math.random()*(b+1)),d=a[b];a[b]=a[c],a[c]=d}return a}globals={},globals.scope1=this,settings.hitTolerance=6;var radius=16;globals.isWeighted=!0,globals.graphNodes=[],project.currentStyle={strokeColor:"#000000",fillColor:"salmon",strokeWidth:1.6},deleteNode=function(a){for(var b=a.data.edges.length-1;b>-1;b--)deleteEdge(a.data.edges[b]);globals.graphNodes[globals.graphNodes.indexOf(a)]=null,a.remove()},deleteEdge=function(a){for(var b=0;2>b;b++)a.data.nodes[b].data.edges.splice(a.data.nodes[b].data.edges.indexOf(a),1);a.remove()};var selector,gn,weight,eedge,modif;globals.selectedNode=null,updateEdgeWeight=function(a){var b=a.children[0],c=a.children[1],d=b.segments[0].point-b.segments[1].point;c.position=b.position+d.normalize(10).rotate(90),c.data.auto&&(c.content=Math.ceil(d.length).toString())};var edge=null,ngn=null;globals?globals.scope2=this:globals={scope2:this},globals.secondMovie=function(){};var tn=null,globals=globals||{};paper.install(window);var proc_color={red:0,green:.808,blue:.82},node_disc_color={red:0,green:.82,blue:.424},disc_color={red:.725,green:.427,blue:.949},selected_edge_color={red:.322,green:.835,blue:.408},tweenList;globals.searched=!1,restoreAllNodes=function(){globals.graphNodes.forEach(function(a){a&&(a.children.circle.fillColor=globals.graphNodes.indexOf(a)==globals.selectedNode?"yellow":"salmon",a.data.edges.forEach(function(a){a.children.line.strokeColor="maroon",a.children.line.strokeWidth=1.6,a.data.examined=!1}),a.data={status:null,edges:a.data.edges,dist:1/0})})},clearNodes=function(){globals.graphNodes.forEach(function(a){a&&deleteNode(a)}),graphNodes=[]},fixpositions=function(a){if(a){for(var b,c,d=!0,e=0;d&&35>e;){d=!1,e++;for(var f=0;f<tree.length;f++)for(var g=0;g<tree[f].length;g++)if(tn=tree[f][g]){tn.position=a(f+1,g+1,tree.length,tree[f].length),tn.position.x+=tn.data.poschange;for(var h=0;h<tn.data.edges.length;h++)edge=tn.data.edges[h],edge.segments[edge.data.nodes.indexOf(tn)].point=tn.position}a:for(f=tree.length-1;f>=0;f--)for(g=0;g<tree[f].length;g++)if(tn=tree[f][g])for(var h=0;h<tn.data.edges.length;h++){edge=tn.data.edges[h],b=sub(edge.segments[1].point,edge.segments[0].point);for(var i=otherNode(edge.data.nodes,tn),j=0;j<i.data.edges.length;j++)if(otherEdge=i.data.edges[j],otherEdge!==edge&&(c=sub(otherEdge.segments[1].point,otherEdge.segments[0].point),b.isColinear(c))){tree[f].indexOf(i)>-1?(d=!0,tn.data.poschange+=Math.floor(2*Math.random())*radius*5-2.5*radius):(d=!0,Math.random()>.5?tree[f].splice(g,0,null):tree[f].splice(g+1,0,null));break a}}}alledges.forEach(function(a){b=sub(a.segments[1].point,a.segments[0].point),a.segments[0].point=add(a.segments[0].point,b.normalize(radius)),a.segments[1].point=sub(a.segments[1].point,b.normalize(radius))})}},playTweenArray=function(a){tweenList[a].tweenArray.forEach(function(a){a.start()})},otherNode=function(a,b){return a[(a.indexOf(b)+1)%2]};var canvaswidth=700,canvasheight=225,unpoint=new paper.Point(100,100),radius=16;dFsPlot=function(a,b,c,d){var e,f;return e=5>=c?canvaswidth*(a/6):canvaswidth*a/(c+1),f=canvasheight*b/(d+1),new paper.Point(e,f)},createTreeEdge=function(a,b,c){paper=globals.scope2;var d=a.data.treenode,e=b.data.treenode,f=new paper.Path.Line({opacity:0,from:d.position,to:e.position,strokeColor:"maroon",strokeWidth:1.6,data:{nodes:[d,e]}});return c||(f.dashArray=[9,5]),f.sendToBack(),[d,e].forEach(function(a){a.data.edges.push(f)}),alledges.push(f),tweenArray.push(new TWEEN.Tween(f).to({opacity:1},150)),f},alledges=[],tree=[],reorderTree=function(){for(var a=0;a<tree.length;a++){for(var b=tree[a],c=1;c<tree[a].length;c++)for(var d=0;c>d;d++)tree[a-1].indexOf(tree[a][c].data.parent)<tree[a-1].indexOf(tree[a][d].data.parent)&&(b[c]=tree[a][d],b[d]=tree[a][c]);tree[a]=b}},colorflip=function(a,b){tweenArray.push(new TWEEN.Tween(a.children.circle.fillColor).to(b,150))},allEdges=function(){globals.graphNodes.forEach(function(a){if(a){var b=a.data.edges.map(function(b){return otherNode(b.data.nodes,a)}),c=globals.graphNodes.filter(function(c){return-1==b.indexOf(c)&&a!=c&&c});paper=globals.scope1,c.forEach(function(b){edge=new paper.Group({children:[new paper.Path.Line({from:a.position,to:b.position,strokeColor:"maroon",name:"line"}),new PointText({position:a.position,fontSize:9,font:"courier new",name:"weight",strokeColor:"peru",strokeWidth:1,data:{auto:!0}})],data:{nodes:[a,b],gen:!0}}),edge.sendToBack(),a.data.edges.push(edge),b.data.edges.push(edge),updateEdgeWeight(edge)})}})},updateEdgeWeight=function(a){var b=a.children[0],c=a.children[1],d=sub(b.segments[0].point,b.segments[1].point);c.position=add(b.position,d.normalize(10).rotate(90)),c.data.auto&&(c.content=Math.ceil(d.length).toString())},globals.secondmovie=function(){},salesman=function(){allEdges(),paper=globals.scope2,tweenArray=[],globals.graphNodes.forEach(function(a){if(a){var b=new Group({position:a.position,children:[new Path.Circle({center:a.position,radius:radius,fillColor:"salmon",strokeWidth:1.6,strokeColor:"black",name:"circle"}),new PointText({position:a.position,content:a.children.label.content,name:"label"})],data:{edges:[],graphnode:a}});b.children.label.point.x-=b.children.label.bounds.center.x-b.position.x,b.children.label.point.y-=b.children.label.bounds.center.y-b.position.y,a.data.treenode=b,tree.push(b)}});var a=tree.length;agacencyMatrix=new Array(a);for(var b=0;a>b;b++){agacencyMatrix[b]=new Array(a);for(var c=0;a>c;c++)agacencyMatrix[b][c]={edge:null,dist:null}}for(var b=0;a-1>b;b++)for(var c=b+1;a>c;c++)agacencyMatrix[b][c].edge=agacencyMatrix[c][b].edge=createTreeEdge(tree[b].data.graphnode,tree[c].data.graphnode,!0),agacencyMatrix[c][b].dist=agacencyMatrix[b][c].dist=parseInt(tree[b].data.graphnode.data.edges.filter(function(a){return otherNode(a.data.nodes,tree[b].data.graphnode)==tree[c].data.graphnode})[0].children[1].content);currentTour=new Array(a);for(var b=0;a>b;b++)currentTour[b]=b;shuffleArray(currentTour);var d,e,f,g,h,i,j=1,k=tempd(a);startTour=[],tweenList=[],globals.secondMovie=function(){console.log(j*=Math.pow(k,annealframe));for(var b=0;a>b;b++)tree[b].children.circle.fillColor.red=1-.569*(1-j*j*j),tree[b].children.circle.fillColor.green=.549-.118*(1-j*j*j),tree[b].children.circle.fillColor.blue=.412+.188*(1-j*j*j);e=function(){return tourCost(currentTour)}(),d=e,startTour=currentTour.slice(0,a);for(var b=0;annealframe>b;b++)h=Math.floor(Math.random()*a),i=Math.floor(Math.random()*a),g=currentTour[h],currentTour[h]=currentTour[i],currentTour[i]=g,f=function(){return tourCost(currentTour)}()-d,0>f||Math.pow(Math.E,.1*-f/j)>Math.random()?d+=f:(currentTour[i]=currentTour[h],currentTour[h]=g);e>d&&(j/=k);for(var b=0;a>b;b++)agacencyMatrix[startTour[b]][startTour[(b+1)%a]].edge.opacity=0,agacencyMatrix[currentTour[b]][currentTour[(b+1)%a]].edge.opacity=1}},tourCost=function(a){for(var b=0,c=0;c<a.length;c++)b+=agacencyMatrix[a[c]][a[(c+1)%a.length]].dist;return b};var visible=!0;toggleweight=function(){globals.graphNodes.forEach(function(a){a&&a.data.edges.forEach(function(a){a.children[1].opacity=visible?0:1})}),visible=!visible},clearEdges=function(){globals.graphNodes.forEach(function(a){if(a)for(var b=a.data.edges.length-1;b>=0;b--){var c=a.data.edges[b];c.data.gen&&deleteEdge(c)}}),globals.searched&&(TWEEN.removeAll(),restoreAllNodes(),globals.secondMovie=function(){},globals.searched=!1)};var annealframe=1;$("document").ready(function(){var a=$("input.slider").slider({orientation:"vertical",min:1,max:10,step:.1,tooltip:"hide",value:5,reversed:!0});a.css("visibility","visible"),a.on("slide",function(a){TWEEN.speed(a.value/3),annealframe=2*a.value-1}),setTimeout(function(){$("#dfs").on("click",function(){runSearch(dFs,globals.graphNodes[globals.selectedNode],dFsPlot)}),$("#prim").on("click",function(){runSearch(prim,globals.graphNodes[globals.selectedNode],dFsPlot)}),$("#bfs").on("click",function(){runSearch(bFs,globals.graphNodes[globals.selectedNode],dFsPlot)}),$("#salesman").on("click",function(){runSearch(salesman,globals.graphNodes[globals.selectedNode],null)}),$("#alledges").on("click",function(){allEdges()}),$("#clearedges").on("click",function(){clearEdges()}),$("#toggleweight").on("click",function(){toggleweight()}),$("#clear").on("click",function(){clearNodes()}),$("#instruction").on("click",function(){$("#instructions").modal("show")})},2e3),$}),void 0===Date.now&&(Date.now=function(){return(new Date).valueOf()});var TWEEN=TWEEN||function(){var a=[];return{REVISION:"14",getAll:function(){return a},removeAll:function(){a=[]},add:function(b){a.push(b)},remove:function(b){var c=a.indexOf(b);-1!==c&&a.splice(c,1)},update:function(b){if(0===a.length)return!1;var c=0;for(b=void 0!==b?b:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now(),b=(b-this._speedChangeStartAbsolute)*this._speed+this._speedChangeStartRelative;c<a.length;)a[c].update(b)?c++:a.splice(c,1);return!0},_speed:1,_speedChangeStartAbsolute:0,_speedChangeStartRelative:0,speed:function(a){var b="undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now();this._speedChangeStartRelative+=(b-this._speedChangeStartAbsolute)*this._speed,this._speedChangeStartAbsolute=b,this._speed=a}}}();TWEEN.Tween=function(a){var b=a,c={},d={},e={},f=1e3,g=0,h=!1,i=!1,j=!1,k=0,l=null,m=TWEEN.Easing.Linear.None,n=TWEEN.Interpolation.Linear,o=[],p=null,q=!1,r=null,s=null,t=null;for(var u in a)c[u]=parseFloat(a[u],10);this.to=function(a,b){return void 0!==b&&(f=b),d=a,this},this.start=function(a){TWEEN.add(this),i=!0,q=!1,void 0==a?(a="undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now(),l=(a-TWEEN._speedChangeStartAbsolute)*TWEEN._speed+TWEEN._speedChangeStartRelative,l+=k*TWEEN._speed):(l=a,l+=k*TWEEN._speed);for(var f in d){if(d[f]instanceof Array){if(0===d[f].length)continue;d[f]=[b[f]].concat(d[f])}c[f]=b[f],c[f]instanceof Array==!1&&(c[f]*=1),e[f]=c[f]||0}return this},this.stop=function(){return i?(TWEEN.remove(this),i=!1,null!==t&&t.call(b),this.stopChainedTweens(),this):this},this.stopChainedTweens=function(){for(var a=0,b=o.length;b>a;a++)o[a].stop()},this.delay=function(a){return k=a,this},this.repeat=function(a){return g=a,this},this.yoyo=function(a){return h=a,this},this.easing=function(a){return m=a,this},this.interpolation=function(a){return n=a,this},this.chain=function(){return o=arguments,this},this.onStart=function(a){return p=a,this},this.onUpdate=function(a){return r=a,this},this.onComplete=function(a){return s=a,this},this.onStop=function(a){return t=a,this},this.update=function(a){var i;if(l>a)return!0;q===!1&&(null!==p&&p.call(b),q=!0);var t=(a-l)/f;t=t>1?1:t;var u=m(t);for(i in d){var v=c[i]||0,w=d[i];w instanceof Array?b[i]=n(w,u):("string"==typeof w&&(w=v+parseFloat(w,10)),"number"==typeof w&&(b[i]=v+(w-v)*u))}if(null!==r&&r.call(b,u),1==t){if(g>0){isFinite(g)&&g--;for(i in e){if("string"==typeof d[i]&&(e[i]=e[i]+parseFloat(d[i],10)),h){var x=e[i];e[i]=d[i],d[i]=x}c[i]=e[i]}return h&&(j=!j),l=a,l+=k*TWEEN._speed,!0}null!==s&&s.call(b);for(var y=0,z=o.length;z>y;y++)o[y].start(a);return!1}return!0}},TWEEN.Easing={Linear:{None:function(a){return a}},Quadratic:{In:function(a){return a*a},Out:function(a){return a*(2-a)},InOut:function(a){return(a*=2)<1?.5*a*a:-.5*(--a*(a-2)-1)}},Cubic:{In:function(a){return a*a*a},Out:function(a){return--a*a*a+1},InOut:function(a){return(a*=2)<1?.5*a*a*a:.5*((a-=2)*a*a+2)}},Quartic:{In:function(a){return a*a*a*a},Out:function(a){return 1- --a*a*a*a},InOut:function(a){return(a*=2)<1?.5*a*a*a*a:-.5*((a-=2)*a*a*a-2)}},Quintic:{In:function(a){return a*a*a*a*a},Out:function(a){return--a*a*a*a*a+1},InOut:function(a){return(a*=2)<1?.5*a*a*a*a*a:.5*((a-=2)*a*a*a*a+2)}},Sinusoidal:{In:function(a){return 1-Math.cos(a*Math.PI/2)},Out:function(a){return Math.sin(a*Math.PI/2)},InOut:function(a){return.5*(1-Math.cos(Math.PI*a))}},Exponential:{In:function(a){return 0===a?0:Math.pow(1024,a-1)},Out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},InOut:function(a){return 0===a?0:1===a?1:(a*=2)<1?.5*Math.pow(1024,a-1):.5*(-Math.pow(2,-10*(a-1))+2)}},Circular:{In:function(a){return 1-Math.sqrt(1-a*a)},Out:function(a){return Math.sqrt(1- --a*a)},InOut:function(a){return(a*=2)<1?-.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)}},Elastic:{In:function(a){var b,c=.1,d=.4;return 0===a?0:1===a?1:(!c||1>c?(c=1,b=d/4):b=d*Math.asin(1/c)/(2*Math.PI),-(c*Math.pow(2,10*(a-=1))*Math.sin(2*(a-b)*Math.PI/d)))},Out:function(a){var b,c=.1,d=.4;return 0===a?0:1===a?1:(!c||1>c?(c=1,b=d/4):b=d*Math.asin(1/c)/(2*Math.PI),c*Math.pow(2,-10*a)*Math.sin(2*(a-b)*Math.PI/d)+1)},InOut:function(a){var b,c=.1,d=.4;return 0===a?0:1===a?1:(!c||1>c?(c=1,b=d/4):b=d*Math.asin(1/c)/(2*Math.PI),(a*=2)<1?-.5*c*Math.pow(2,10*(a-=1))*Math.sin(2*(a-b)*Math.PI/d):c*Math.pow(2,-10*(a-=1))*Math.sin(2*(a-b)*Math.PI/d)*.5+1)}},Back:{In:function(a){var b=1.70158;return a*a*((b+1)*a-b)},Out:function(a){var b=1.70158;return--a*a*((b+1)*a+b)+1},InOut:function(a){var b=2.5949095;return(a*=2)<1?.5*a*a*((b+1)*a-b):.5*((a-=2)*a*((b+1)*a+b)+2)}},Bounce:{In:function(a){return 1-TWEEN.Easing.Bounce.Out(1-a)},Out:function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},InOut:function(a){return.5>a?.5*TWEEN.Easing.Bounce.In(2*a):.5*TWEEN.Easing.Bounce.Out(2*a-1)+.5}}},TWEEN.Interpolation={Linear:function(a,b){var c=a.length-1,d=c*b,e=Math.floor(d),f=TWEEN.Interpolation.Utils.Linear;return 0>b?f(a[0],a[1],d):b>1?f(a[c],a[c-1],c-d):f(a[e],a[e+1>c?c:e+1],d-e)},Bezier:function(a,b){var c,d=0,e=a.length-1,f=Math.pow,g=TWEEN.Interpolation.Utils.Bernstein;for(c=0;e>=c;c++)d+=f(1-b,e-c)*f(b,c)*a[c]*g(e,c);return d},CatmullRom:function(a,b){var c=a.length-1,d=c*b,e=Math.floor(d),f=TWEEN.Interpolation.Utils.CatmullRom;return a[0]===a[c]?(0>b&&(e=Math.floor(d=c*(1+b))),f(a[(e-1+c)%c],a[e],a[(e+1)%c],a[(e+2)%c],d-e)):0>b?a[0]-(f(a[0],a[0],a[1],a[1],-d)-a[0]):b>1?a[c]-(f(a[c],a[c],a[c-1],a[c-1],d-c)-a[c]):f(a[e?e-1:0],a[e],a[e+1>c?c:e+1],a[e+2>c?c:e+2],d-e)},Utils:{Linear:function(a,b,c){return(b-a)*c+a},Bernstein:function(a,b){var c=TWEEN.Interpolation.Utils.Factorial;return c(a)/c(b)/c(a-b)},Factorial:function(){var a=[1];return function(b){var c,d=1;if(a[b])return a[b];for(c=b;c>1;c--)d*=c;return a[b]=d}}(),CatmullRom:function(a,b,c,d,e){var f=.5*(c-a),g=.5*(d-b),h=e*e,i=e*h;return(2*b-2*c+f+g)*i+(-3*b+3*c-2*f-g)*h+f*e+b}}},"undefined"!=typeof module&&module.exports&&(module.exports=TWEEN);