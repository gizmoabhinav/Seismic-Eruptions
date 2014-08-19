$("#Rectslider").slider({
		value: 0,
		min: 0,
		max: 100,
		slide: function ( event, ui ) {
			width = ui.value/100;
			x1=lat0+(width/ratio2);
			y1=lng0-(width/ratio1);
			x2=lat1+(width/ratio2);
			y2=lng1-(width/ratio1);
			x3=lat1-(width/ratio2);
			y3=lng1+(width/ratio1);
			x4=lat0-(width/ratio2);
			y4=lng0+(width/ratio1);
			map.removeLayer(polygon);
			polygon = L.polygon([
						[toLat(x1),toLon(y1)],
						[toLat(x2),toLon(y2)],
						[toLat(x3),toLon(y3)],
						[toLat(x4),toLon(y4)]
					]).addTo(map);
			//document.write("<button href='http://gizmoabhinav.github.io/Seismic-Eruptions/3D/index.html?x1="+toLon(y1)+"&y1="+toLat(x1)+"&x2="+toLon(y2)+"&y2="+toLat(x2)+"&x3="+toLon(y3)+"&y3="+toLat(x3)+"&x4="+toLon(y4)+"&y4="+toLat(x4)+"&mag=4&y=2013&m=1&d=1'>Render</button>");
		}
		});
	function startDrawingTool(){
		$('#overlay').fadeIn();
		map.addControl(drawControl);
		map.addLayer(drawnItems);
		$('#startDrawingToolButton').fadeOut();
		$('#Drawingtools').fadeIn();
		$("#slider").slider({ disabled: true });
		document.getElementById("play").disabled = true;
		document.getElementById("pause").disabled = true;
		document.getElementById("speedup").disabled = true;
		document.getElementById("speeddown").disabled = true;
		tl.pause();
		//var current = tl.progress();
		//tl.progress(0);
		for (var i = 0; i < size; i++){
			if(!map.hasLayer(circles[i])){
				circles[i].setStyle({fillOpacity : 0.5,fillColor: "#"+rainbow.colourAt(depth[i])});
				circles[i].addTo(map);
			}
		}
		$('#overlay').fadeOut();
	}
	function removeDrawingTool(){
		$('#overlay').fadeIn();
		$('#startDrawingToolButton').fadeIn();
		$('#Drawingtools').fadeOut();
		map.removeControl(drawControl);
		if(map.hasLayer(drawnItems)){
			map.removeLayer(drawnItems);
		}
		if(map.hasLayer(polygon)){
			map.removeLayer(polygon);
		}
		//tl.resume();
		$("#slider").slider({ disabled: false });
		document.getElementById("play").disabled = false;
		document.getElementById("pause").disabled = false;
		document.getElementById("speedup").disabled = false;
		document.getElementById("speeddown").disabled = false;
		$('#overlay').fadeOut();
	}
	var Line;
	var drawnItems = new L.FeatureGroup();
		
		var drawControl = new L.Control.Draw({
			position: 'topright',
			draw: {
				polyline: {
					metric: true
				}
			},
			edit: {
				featureGroup: drawnItems,
				remove: false
			}
		});
		//map.addControl(drawControl);

		map.on('draw:created', function (e) {
			var type = e.layerType,
				Line = e.layer;


			drawnItems.addLayer(Line);
		});