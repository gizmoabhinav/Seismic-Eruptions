var array = new Array(),magarray;
var month1=0,year1=0,month2=0,year2=12;
function loadCount(){
	month1 = parseInt($('#date-1-m').val()-1);
	year1 = parseInt($('#date-1-y').val());
	month2 = parseInt($('#date-2-m').val()-1);
	year2 = parseInt($('#date-2-y').val());
	$.get('count.txt', function(data){
		array = data.split(',');
		console.log(array);
		var length = array.length;
		console.log(length);
		magarray = new Array();
		for(var i=99;i>=0;i--){
			magarray[i] = new Array();
			for(var j=0;j<length/102;j++){
				if(magarray[i][j]!=undefined)
					magarray[i][j] = parseInt(array[(j*102)+2+i])+parseInt(magarray[i][j]);
				else
					magarray[i][j] = parseInt(array[(j*102)+2+i]);
				if(j+1<length/102)
					magarray[i][j+1] = parseInt(magarray[i][j]);
				if(i<99)
					magarray[i][j] = parseInt(magarray[i+1][j])+parseInt(magarray[i][j]);
			}
		}
		console.log(magarray);
		window.open("http://gizmoabhinav.github.io/Seismic-Eruptions/?mag="+binarySearch(0,100)+"&startdate="+(parseInt(year1)+2000)+"-"+(parseInt(month1)+1)+"-1&enddate="+(parseInt(year2)+2000)+"-"+(parseInt(month2)+1)+"-1","_self");
		function binarySearch(mag,max){
			if(mag<max){
				var count = 0;
				count=parseInt(magarray[parseInt(mag)][(parseInt(year2)*12)+parseInt(month2)])-parseInt(magarray[parseInt(mag)][(parseInt(year1)*12)+parseInt(month1)]);
				if(parseInt(count)<15000 && mag!=0){
					return binarySearch(parseInt(mag)-((max-parseInt(mag))/2),mag);
				}
				else if(parseInt(count)>20000){
					return binarySearch(parseInt(mag)+((max-parseInt(mag))/2),max);
				}
				else{
					console.log("count = "+count);
					return parseInt(mag)/10;
				}
			}
		}
	
	});	
};