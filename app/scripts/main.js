console.log('\'Allo \'Allo!');

// var scope = new paper.PaperScope()

// paper.setup('canvas1')
// paper.setup('canvas2')

// var view_1 = scope.View._viewsById['canvas1'];
// scope.setup(canvas1);
// var view_2 = scope.View._viewsById['canvas2'];
// scope.setup(canvas2);



$('document').ready($('#dfs').on('click', function () {
	pscope1 = PaperScope.get(1);
pscope2 = PaperScope.get(2);
	pscope2.activate();
	new Path.Circle ({
		point: new Point (50,50),
		radius: 28
	});
	pscope2.view.update();
}))
