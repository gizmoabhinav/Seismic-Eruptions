function loadCount(click){
	month1 = parseInt($('#date-1-m').val()-1);
	year1 = parseInt($('#date-1-y').val()-60);
	month2 = parseInt($('#date-2-m').val()-1);
	year2 = parseInt($('#date-2-y').val()-60);
	if((parseInt(year2)*12)+parseInt(month2)<=(parseInt(year1)*12)+parseInt(month1)){
		$("#error-date").html("<p style='color:red'>Select a valid date range</p>");
		return;
	}
	else{
		$("#error-date").html("");
	}
	if(click==0)
	window.open("http://gizmoabhinav.github.io/Seismic-Eruptions/?mag="+binarySearch(0,100)+"&startdate="+(parseInt(year1)+1900)+"-"+(parseInt(month1)+1)+"-1&enddate="+(parseInt(year2)+1900)+"-"+(parseInt(month2)+1)+"-1","_self");
	else
	$("#magnitude-search").html("<p>Calculated magnitude cutoff : </p><p style='color:green'>"+binarySearch(0,100)+"</p>");
};
function binarySearch(mag,max){
		if(mag<max){
			var count = 0;
			count=parseInt(magarray[parseInt(mag)][(parseInt(year2)*12)+parseInt(month2)])-parseInt(magarray[parseInt(mag)][(parseInt(year1)*12)+parseInt(month1)]);
			if(parseInt(count)>20000){
				return binarySearch(parseInt(mag)+((max-parseInt(mag))/2),max);
			}
			else if(parseInt(count)<15000 && mag!=0){
				return binarySearch(parseInt(mag)-((max-parseInt(mag))/2),mag);
			}
			else{
				return parseInt(mag)/10;
			}
		}
}