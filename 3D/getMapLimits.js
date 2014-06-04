var leftTileLimit;
var topTileLimit;
var x1 = convertCoordinatesx(getURLParameter("x1"));
var y1 = convertCoordinatesy(getURLParameter("y1"));
var x2 = convertCoordinatesx(getURLParameter("x2"));
var y2 = convertCoordinatesy(getURLParameter("y2"));
var x3 = convertCoordinatesx(getURLParameter("x3"));
var y3 = convertCoordinatesy(getURLParameter("y3"));
var x4 = convertCoordinatesx(getURLParameter("x4"));
var y4 = convertCoordinatesy(getURLParameter("y4"));
var minx = Math.min(x1,x2,x3,x4);
var miny = Math.min(y1,y2,y3,y4);
var maxx = Math.max(x1,x2,x3,x4);
var maxy = Math.max(y1,y2,y3,y4);
if(3-Math.ceil(maxx-minx)>=0 && 3-Math.ceil(maxy-miny)>=0){					// temporary limit to the size of the rectangle
	leftTileLimit = Math.floor(minx-(3-Math.ceil(maxx-minx)));
	topTileLimit = Math.floor(miny-(3-Math.ceil(maxy-miny)));
}
else{
	leftTileLimit = Math.floor(minx);
	topTileLimit = Math.floor(miny);
}