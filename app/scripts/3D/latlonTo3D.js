function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
/*
The 2D map has coordinates ranging from -180 to +180 from left to right and from +90 to -90 from top to bottom.
The 3D map projection ranges 64x64 units. The projection shows only 4x4 units of this area which is centred at 0,0,0.
This file finds the location of the point in this 3D projection corresponding to its latitude and longitude values. 
*/
function convertCoordinatesx(x){
	
	//converting the coordinates into new coordinate system
	x=parseFloat(x);
	x=((x+180)*64)/360;
	return x;
}
function convertCoordinatesy(y){
	
	//converting the coordinates into new coordinate system
	y = parseFloat(y);
	y = y*(Math.PI/180);
	y= (1 - (Math.log(Math.tan(y) + 1.0/Math.cos(y)) / Math.PI)) * 32;
	return y;
}