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
	y= (1 - (Math.log(Math.tan((y/2)+(Math.PI/4))) / Math.PI))*32;
	return y;
}
function toLon(x){
	x=parseFloat(x);
	x=(x*360/64)-180;
	return x;
}
function toLat(y){
y = parseFloat(y);
	y =2*(Math.atan(Math.pow(Math.E,(1-(y/32))*Math.PI))-(Math.PI/4));
	y=y*180/Math.PI;
	return y;
}