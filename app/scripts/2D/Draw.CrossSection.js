var polygonArr = new Array();
var lng0,lng1,lat0,lat1;
var touchstart = true;
var touchend = false;
var width=0.25;
var linelength = 0;
var length,ratio1,ratio2,x1,y1,x2,y2,x3,y3,x4,y4;

var lat,lng,mlat,mlng,mlatlng,initDistance,initWidth,resizemarkervar,movemarkervar,endmarker1,endmarker2;
var CrossSection = L.Class.extend({

	options: {
		allowIntersection: true,
		repeatMode: false,
		drawError: {
			color: '#b00b00',
			timeout: 2500
		},
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		guidelineDistance: 10,
		maxGuideLineLength: 4000,
		shapeOptions: {
			stroke: true,
			color: '#ff0000',
			weight: 4,
			opacity: 0.5,
			fill: false,
			clickable: true
		},
		metric: true, // Whether to use the metric meaurement system or imperial
		showLength: true, // Whether to display distance in the tooltip
		zIndexOffset: 2000 // This should be > than the highest z-index any map layers
	},
	
	enable: function () {
		if (this._enabled) { return; }
		
		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) { return; }
		
		this_enabled = false;
	},
	
	initialize: function (map) {
		this._crossSection = {line:{},rectangle:{}};
		this._map = map;
		this._container = map._container;
		this._overlayPane = map._panes.overlayPane;
		this._popupPane = map._panes.popupPane;
		this._featureGroup = new L.FeatureGroup();
		this._drawGuide(new L.Point(0,0),new L.Point(0,0));
		this.addHooks();
	},

	addHooks: function () {
		//L.Draw.Feature.prototype.addHooks.call(this);
		
		if (this._map) {
			this._map.getContainer().focus();
			L.DomUtil.disableTextSelection();
			this._tooltip = new L.Tooltip(this._map);
			this._map.getContainer().focus();
			this._markers = [];
			this._map.dragging.disable();
			this._markerGroup = new L.LayerGroup();
			this._map.addLayer(this._markerGroup);

			this._crossSection.line = new L.Polyline([], this.options.shapeOptions);
			
		
			this._tooltip.updateContent(this._getTooltipText());

			// Make a transparent marker that will used to catch click events. These click
			// events will create the vertices. We need to do this so we can ensure that
			// we can create vertices over other map layers (markers, vector layers). We
			// also do not want to trigger any click handlers of objects we are clicking on
			// while drawing.
			
			L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
			L.DomEvent.on(this._map._container, 'touchend', this._onTouchEnd, this);
			L.DomEvent.on(this._map._container, 'touchmove', this._onTouchMove, this);
			L.DomEvent.on(this._map._container, 'touchmove', this._onTouchMove, this);
			console.log("here");
			if (!this._mouseMarker) {
				this._mouseMarker = L.marker(this._map.getCenter(), {
					icon: L.divIcon({
						className: 'leaflet-mouse-marker',
						iconAnchor: [20, 20],
						iconSize: [40, 40]
					}),
					opacity: 0,
					zIndexOffset: this.options.zIndexOffset
				});
			}

			this._mouseMarker
				.on('mousedown', this._onMouseDown, this)
				.on('touchstart', this._onMouseDown, this)
				.addTo(this._map);
			this._map
				.on('mousemove', this._onMouseMove, this)
				.on('mouseup', this._onMouseUp, this)
				.on('zoomlevelschange', this._onZoomEnd, this);
		}
	},

	removeHooks: function () {
		L.DomUtil.enableTextSelection();
			this._tooltip.dispose();
			this._tooltip = null;
			
		this._clearHideErrorTimeout();
		this._map.dragging.enable();
		this._cleanUpShape();

		// remove markers from map
		this._map.removeLayer(this._markerGroup);
		delete this._markerGroup;
		delete this._markers;

		//this._map.removeLayer(this._crossSection.line);
		//delete this._crossSection.line;

		this._mouseMarker
			.off('mousedown', this._onMouseDown, this)
			.off('mouseup', this._onMouseUp, this);
		this._map.removeLayer(this._mouseMarker);
		delete this._mouseMarker;
		// clean up DOM
		this._clearGuides();
		L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
		L.DomEvent.off(this._map._container, 'touchend', this._onTouchEnd, this);
		L.DomEvent.off(this._map._container, 'touchmove', this._onTouchMove, this);
		this._map
			.off('mousemove', this._onMouseMove, this)
			.off('mouseup', this._onMouseUp, this)
			.off('zoomlevelschange', this._onZoomEnd, this);
	},
	

	deleteLastVertex: function () {
		if (this._markers.length <= 1) {
			return;
		}

		var lastMarker = this._markers.pop(),
			poly = this._crossSection.line,
			latlng = this._crossSection.line.spliceLatLngs(poly.getLatLngs().length - 1, 1)[0];

		this._markerGroup.removeLayer(lastMarker);

		if (poly.getLatLngs().length < 2) {
			this._map.removeLayer(poly);
		}

		this._vertexChanged(latlng, false);
	},

	addVertex: function (latlng) {
		//alert(latlng.lat);
		var markersLength = this._markers.length;
		

		if (markersLength > 0 && !this.options.allowIntersection) {
			this._showErrorTooltip();
			return;
		}
		else if (this._errorShown) {
			this._hideErrorTooltip();
		}
		//this._markers.push(this._createMarker(latlng));

		this._crossSection.line.addLatLng(latlng);
		
		//polygonArr[polygonArr.length]=latlng;
		
		if (this._crossSection.line.getLatLngs().length == 2) {
		//alert(this._crossSection.line.getLatLngs()[1]);
			this._map.addLayer(this._crossSection.line);
			this._finishShape();
		}

		//this._vertexChanged(latlng, true);
		if((markersLength) == 2){
			polygonArr[1] = latlng;
			lat0 =convertCoordinatesy(polygonArr[0].lat);
			lat1 =convertCoordinatesy(polygonArr[1].lat);
			lng0 =convertCoordinatesx(polygonArr[0].lng);
			lng1 =convertCoordinatesx(polygonArr[1].lng);
			length = Math.sqrt(Math.pow((lat0)-(lat1),2)+Math.pow((lng0)-(lng1),2));
			ratio1 = length/(((lat0)-(lat1)));
			ratio2 = length/(((lng0)-(lng1)));
			x1=lat1+(width/ratio2);
			y1=lng1-(width/ratio1);
			x2=lat0+(width/ratio2);
			y2=lng0-(width/ratio1);
			x3=lat0-(width/ratio2);
			y3=lng0+(width/ratio1);
			x4=lat1-(width/ratio2);
			y4=lng1+(width/ratio1);
			this._crossSection.rectangle = new L.polygon([
						[toLat(x1),toLon(y1)],
						[toLat(x2),toLon(y2)],
						[toLat(x3),toLon(y3)],
						[toLat(x4),toLon(y4)]
					]);
			this._crossSection.rectangle.addTo(this._map);		
			this._map.fitBounds(this._crossSection.rectangle.getBounds());
			this._clearGuides();
			this.removeHooks();
			this._featureGroup.addLayer(this._crossSection.line);
			this._featureGroup.addLayer(this._crossSection.rectangle);
		}
		else{
			polygonArr = new Array();
			polygonArr[0] = latlng;
			
			if(this._map.hasLayer(this._crossSection.line))
				this._map.removeLayer(this._crossSection.line);
			if(this._map.hasLayer(this._crossSection.rectangle)){
				this._map.removeLayer(this._crossSection.rectangle);
			}
		}
	},

	_finishShape: function () {
		

		if ((!this.options.allowIntersection) || !this._shapeIsValid()) {
			this._showErrorTooltip();
			return;
		}

		this._fireCreatedEvent();
		this.disable();
		if (this.options.repeatMode) {
			this.enable();
		}
	},

	//Called to verify the shape is valid when the user tries to finish it
	//Return false if the shape is not valid
	_shapeIsValid: function () {
		return true;
	},

	_onZoomEnd: function () {
		this._updateGuide();
	},

	_onMouseMove: function (e) {
	
		var newPos = e.layerPoint,
			latlng = e.latlng;

		// Save latlng
		// should this be moved to _updateGuide() ?
		this._currentLatLng = latlng;

		this._updateTooltip(latlng);

		// Update the guide line
		this._updateGuide(newPos);

		// Update the mouse marker position
		this._mouseMarker.setLatLng(latlng);

		L.DomEvent.preventDefault(e.originalEvent);
	},

	_vertexChanged: function (latlng, added) {
		this._updateFinishHandler();

		this._updateRunningMeasure(latlng, added);

		this._clearGuides();

		this._updateTooltip();
	},

	_onMouseDown: function (e) {
		//alert("mousedown");
		var originalEvent = e.originalEvent;
		this._mouseDownOrigin = L.point(originalEvent.clientX, originalEvent.clientY);
		this._markers = [];
		this._markers.push(this._createMarker(e.latlng));
		this.addVertex(e.latlng);
	},

	_onMouseUp: function (e) {
		//alert("mouseup");
		if (this._mouseDownOrigin) {
			// We detect clicks within a certain tolerance, otherwise let it
			// be interpreted as a drag by the map
			var distance = L.point(e.originalEvent.clientX, e.originalEvent.clientY)
				.distanceTo(this._mouseDownOrigin);
			//if (Math.abs(distance) < 9 * (window.devicePixelRatio || 1)) {
					this._markers[1] = this._createMarker(e.latlng);
					this.addVertex(e.latlng);
				
			//}
			
		}
		this._mouseDownOrigin = null;
	},
	_onTouchStart: function (e) {
		if(touchstart){
		this._mouseDownOrigin = L.point(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		this._markers = [];
		this._markers[0] = this._createMarker(this._map.layerPointToLatLng(this._mouseDownOrigin));
		//this._markers.push(this._map.layerPointToLatLng(this._mouseDownOrigin));
		this.addVertex(this._map.layerPointToLatLng(this._mouseDownOrigin));
		//alert((this._map.layerPointToLatLng(this._mouseDownOrigin)));
		touchstart = false;
		touchend = true;
		}
	},
	_onTouchEnd: function (e) {
		if(touchend){
			if (this._mouseDownOrigin) {
			var distance = L.point(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
				.distanceTo(this._mouseDownOrigin);
			var endpoint = this._map.layerPointToLatLng(L.point(e.changedTouches[0].clientX, e.changedTouches[0].clientY));
				
					this._markers[1] = this._createMarker(endpoint);
					
					this.addVertex(endpoint);
					touchend = false;
					
		}
		this._mouseDownOrigin = null;
		
		touchstart = true;
		}
	},
	_onTouchMove: function (e) {
		this._currentLatLng = this._map.layerPointToLatLng(L.point(e.changedTouches[0].clientX, e.changedTouches[0].clientY));

		this._updateTooltip(this._map.layerPointToLatLng(L.point(e.changedTouches[0].clientX, e.changedTouches[0].clientY)));
		
		// Update the guide line
		this._updateGuide(L.point(e.changedTouches[0].clientX, e.changedTouches[0].clientY));

		// Update the mouse marker position
		this._mouseMarker.setLatLng(this._map.layerPointToLatLng(L.point(e.changedTouches[0].clientX, e.changedTouches[0].clientY)));
		
		
	},
	_updateFinishHandler: function () {
		var markerCount = this._markers.length;
		// The last marker should have a click handler to close the polyline
		if (markerCount > 1) {
			this._markers[markerCount - 1].on('click', this._finishShape, this);
		}

		// Remove the old marker click handler (as only the last point should close the polyline)
		if (markerCount > 2) {
			this._markers[markerCount - 2].off('click', this._finishShape, this);
		}
	},

	_createMarker: function (latlng) {
		var marker = new L.Marker(latlng, {
			icon: this.options.icon,
			zIndexOffset: this.options.zIndexOffset * 2
		});

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_updateGuide: function (newPos) {
	
		if(this._markers!=null)
			var markerCount = this._markers.length;
		else
			var markerCount = 0;

		if (markerCount > 0 && markerCount < 2) {
			newPos = newPos || this._map.latLngToLayerPoint(this._currentLatLng);

			// draw the guide line
			this._clearGuides();
			this._drawGuide(
				this._map.latLngToLayerPoint(this._markers[0].getLatLng()),
				newPos
			);
		}
	},

	_updateTooltip: function (latLng) {
		var text = this._getTooltipText();

		if (latLng) {
			this._tooltip.updatePosition(latLng);
		}

		if (!this._errorShown) {
			this._tooltip.updateContent(text);
		}
	},

	_drawGuide: function (pointA, pointB) {
		var length = Math.floor(Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2))),
			guidelineDistance = this.options.guidelineDistance,
			maxGuideLineLength = this.options.maxGuideLineLength,
			// Only draw a guideline with a max length
			i = length > maxGuideLineLength ? length - maxGuideLineLength : guidelineDistance,
			fraction,
			dashPoint,
			dash;

		//create the guides container if we haven't yet
		if (!this._guidesContainer) {
			this._guidesContainer = L.DomUtil.create('div', 'leaflet-draw-guides', this._overlayPane);
		}
		
		
		
		//draw a dash every GuildeLineDistance
		for (; i < length; i += this.options.guidelineDistance) {
			//work out fraction along line we are
			fraction = i / length;

			//calculate new x,y point
			dashPoint = {
				x: Math.floor((pointA.x * (1 - fraction)) + (fraction * pointB.x)),
				y: Math.floor((pointA.y * (1 - fraction)) + (fraction * pointB.y))
			};

			//add guide dash to guide container
			dash = L.DomUtil.create('div', 'leaflet-draw-guide-dash', this._guidesContainer);
			dash.style.backgroundColor =
				!this._errorShown ? this.options.shapeOptions.color : this.options.drawError.color;
			
			L.DomUtil.setPosition(dash, dashPoint);
		}
	},

	_updateGuideColor: function (color) {
		if (this._guidesContainer) {
			for (var i = 0, l = this._guidesContainer.childNodes.length; i < l; i++) {
				this._guidesContainer.childNodes[i].style.backgroundColor = color;
			}
		}
	},

	// removes all child elements (guide dashes) from the guides container
	_clearGuides: function () {
		if (this._guidesContainer) {
			while (this._guidesContainer.firstChild) {
				this._guidesContainer.removeChild(this._guidesContainer.firstChild);
			}
		}
	},

	_getTooltipText: function () {
		var showLength = this.options.showLength,
			labelText, distanceStr;

		if (this._markers.length === 0) {
			labelText = {
				text: 'Click and drag to start drawing line.'
			};
		} else {
			distanceStr = showLength ? this._getMeasurementString() : '';
			linelength = parseInt(distanceStr.substr(0,distanceStr.length-4));
			
			if (this._markers.length === 1) {
				if(parseInt(distanceStr.substr(0,distanceStr.length-4))>1400){
					labelText = {
					text: 'Drag to continue drawing shape.',
					subtext: distanceStr+" Create a smaller cross section for better view"
					};
				}else{
				labelText = {
					text: 'Drag to continue drawing shape.',
					subtext: distanceStr
				};
				}
			} else {
				labelText = {
					text: 'Drag',
					subtext: distanceStr
				};
			}
		}
		return labelText;
	},

	_updateRunningMeasure: function (latlng, added) {
		var markersLength = this._markers.length,
			previousMarkerIndex, distance;

		if (this._markers.length === 1) {
			this._measurementRunningTotal = 0;
		} else {
			previousMarkerIndex = markersLength - (added ? 2 : 1);
			distance = latlng.distanceTo(this._markers[0].getLatLng());

			this._measurementRunningTotal += distance * (added ? 1 : -1);
		}
	},

	_getMeasurementString: function () {
		var currentLatLng = this._currentLatLng,
			previousLatLng = this._markers[0].getLatLng(),
			distance;

		// calculate the distance from the last fixed point to the mouse position
		distance = currentLatLng.distanceTo(previousLatLng);
		return this.readableDistance(distance, this.options.metric);
	},

	_showErrorTooltip: function () {
	
		this._errorShown = true;

		// Update tooltip
		this._tooltip
			.showAsError()
			.updateContent({ text: this.options.drawError.message });

		// Update shape
		this._updateGuideColor(this.options.drawError.color);
		this._crossSection.line.setStyle({ color: this.options.drawError.color });

		// Hide the error after 2 seconds
		this._clearHideErrorTimeout();
		this._hideErrorTimeout = setTimeout(L.Util.bind(this._hideErrorTooltip, this), this.options.drawError.timeout);
	},

	_hideErrorTooltip: function () {
		this._errorShown = false;

		this._clearHideErrorTimeout();

		// Revert tooltip
		this._tooltip
			.removeError()
			.updateContent(this._getTooltipText());

		// Revert shape
		this._updateGuideColor(this.options.shapeOptions.color);
		this._crossSection.line.setStyle({ color: this.options.shapeOptions.color });
	},

	_clearHideErrorTimeout: function () {
		if (this._hideErrorTimeout) {
			clearTimeout(this._hideErrorTimeout);
			this._hideErrorTimeout = null;
		}
	},

	_cleanUpShape: function () {
		if (this._markers.length > 1) {
			this._markers[this._markers.length - 1].off('click', this._finishShape, this);
		}
	},

	_fireCreatedEvent: function () {
		var poly = new L.Polyline(this._crossSection.line.getLatLngs(), this.options.shapeOptions);
		//this._map.fire('draw:created', { layer: this, layerType: 'polyline' });
		//L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
	},
	
	readableDistance: function (distance, isMetric) {
		var distanceStr;

		if (isMetric) {
			// show metres when distance is < 1km, then show km
			if (distance > 1000) {
				distanceStr = (distance  / 1000).toFixed(2) + ' km';
			} else {
				distanceStr = Math.ceil(distance) + ' m';
			}
		} else {
			distance *= 1.09361;

			if (distance > 1760) {
				distanceStr = (distance / 1760).toFixed(2) + ' miles';
			} else {
				distanceStr = Math.ceil(distance) + ' yd';
			}
		}

		return distanceStr;
	},
	
	editAddHooks: function () {
		if (this._map) {
			if (!this._editMarkerGroup) {
				this._editInitMarkers();
			}
			this._map.addLayer(this._editMarkerGroup);
		}
	},

	editRemoveHooks: function () {
		if (this._map) {
			if(this._map.hasLayer(this._editMarkerGroup))
				this._map.removeLayer(this._editMarkerGroup);
			delete this._editMarkerGroup;
			delete this._editMarkers;
		}
	},

	editUpdateMarkers: function () {
		this._editMarkerGroup.clearLayers();
		this._editInitMarkers();
	},

	_editInitMarkers: function () {
		if (!this._editMarkerGroup) {
			this._editMarkerGroup = new L.LayerGroup();
		}
		this._editMarkers = [];

		var latlngs = this._crossSection.line.getLatLngs(),
			i, j, len, editMarker;

		// TODO refactor holes implementation in Polygon to support it here

		for (i = 0, len = latlngs.length; i < len; i++) {

			editMarker = this._editCreateMarker(latlngs[i], i);
			editMarker.on('click', this._editOnMarkerClick, this);
			this._editMarkers.push(editMarker);
		}

		var editMarkerLeft, editMarkerRight;

		for (i = 0, j = len - 1; i < len; j = i++) {
			if (i === 0 && !(L.Polygon && (this._crossSection.line instanceof L.Polygon))) {
				continue;
			}

			editMarkerLeft = this._editMarkers[j];
			editMarkerRight = this._editMarkers[i];
			endmarker1 = editMarkerLeft;
			endmarker2 = editMarkerRight;
			this._editCreateResizeMarker(editMarkerLeft,editMarkerRight);
			this._editCreateMoveMarker(editMarkerLeft, editMarkerRight);
		}
	},

	_editCreateMarker: function (latlng, index) {
		var editMarker = new L.Marker(latlng, {
			draggable: true,
			icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		})
		});

		editMarker._origLatLng = latlng;
		editMarker._index = index;
		
		editMarker.on('drag', this._editOnMarkerDrag, this);
		editMarker.on('dragend', this._fireEdit, this);

		this._editMarkerGroup.addLayer(editMarker);

		return editMarker;
	},

	_editRemoveMarker: function (editMarker) {
		var i = editMarker._index;

		this._editMarkerGroup.removeLayer(editMarker);
		this._editMarkers.splice(i, 1);
		this._crossSection.line.spliceLatLngs(i, 1);
		this._updateIndexes(i, -1);

		editMarker
			.off('drag', this._editOnMarkerDrag, this)
			.off('dragend', this._fireEdit, this)
			.off('click', this._editOnMarkerClick, this);
	},

	_fireEdit: function () {
		this._crossSection.line.edited = true;
		this._crossSection.line.fire('edit');
	},

	_editOnMarkerDrag: function (e) {
		var editMarker = e.target;
		
		
		this._map.removeLayer(this._crossSection.rectangle);
		L.extend(editMarker._origLatLng, editMarker._latlng);

		/*if (marker._middleLeft) {
			marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
		}
		if (marker._middleRight) {
			marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
		}*/
		var map = this._map,
		    p1 = map.project([toLat(x1),toLon(y1)]),
		    p2 = map.project([toLat(x2),toLon(y2)]);
		var p4 = map.unproject(map.project([toLat(lat0),toLon(lng0)])._add(map.project([toLat(lat1),toLon(lng1)]))._divideBy(2));
		var p3 = map.unproject(p1._add(p2)._divideBy(2));
		if(editMarker._index == 2){
			if(width <= 5){
				width = Math.sqrt(Math.pow(map.project(p4).x-map.project(editMarker.getLatLng()).x,2)+Math.pow(map.project(p4).y-map.project(editMarker.getLatLng()).y,2))*initWidth/initDistance;
				
			}
			//marker.setLatLng(p3);
		}
		if(editMarker._index == 3){
			offset = [map.project(mlatlng).x - map.project(editMarker._latlng).x, map.project(mlatlng).y - map.project(editMarker._latlng).y];
			mlatlng = editMarker._latlng;
			polygonArr[0]=map.unproject([map.project(polygonArr[0]).x - offset[0],map.project(polygonArr[0]).y - offset[1]]);
			polygonArr[1]=map.unproject([map.project(polygonArr[1]).x - offset[0],map.project(polygonArr[1]).y - offset[1]]);
			this._crossSection.line.setLatLngs([polygonArr[0], polygonArr[1]]);
			/*endmarker1.setLatLng(polygonArr[0]);
			endmarker2.setLatLng(polygonArr[1]);*/
			//this.updateMarkers();
			//marker.setLatLng(p4);
		}
			lat0 =convertCoordinatesy(polygonArr[0].lat);
			lat1 =convertCoordinatesy(polygonArr[1].lat);
			lng0 =convertCoordinatesx(polygonArr[0].lng);
			lng1 =convertCoordinatesx(polygonArr[1].lng);
			length = Math.sqrt(Math.pow((lat0)-(lat1),2)+Math.pow((lng0)-(lng1),2));
			ratio1 = length/(((lat0)-(lat1)));
			ratio2 = length/(((lng0)-(lng1)));
			x1=lat1+(width/ratio2);
			y1=lng1-(width/ratio1);
			x2=lat0+(width/ratio2);
			y2=lng0-(width/ratio1);
			x3=lat0-(width/ratio2);
			y3=lng0+(width/ratio1);
			x4=lat1-(width/ratio2);
			y4=lng1+(width/ratio1);
			this._crossSection.rectangle = new L.polygon([
						[toLat(x1),toLon(y1)],
						[toLat(x2),toLon(y2)],
						[toLat(x3),toLon(y3)],
						[toLat(x4),toLon(y4)]
					]);
			this._crossSection.rectangle.addTo(this._map);
		resizemarkervar.setLatLng(p3);
		movemarkervar.setLatLng(p4);
		this._crossSection.line.redraw();
		var distance = (this.readableDistance((this._editMarkers[0]._latlng).distanceTo(this._editMarkers[1]._latlng),true));
		linelength = parseInt(distance.substr(0,distance.length-4));
	},

	_editOnMarkerClick: function (e) {
		var minPoints = L.Polygon && (this._crossSection.line instanceof L.Polygon) ? 4 : 3,
			editMarker = e.target;

		// If removing this point would create an invalid polyline/polygon don't remove
		if (this._crossSection.line.getLatLngs().length < minPoints) {
			return;
		}

		// remove the marker
		this._editRemoveMarker(editMarker);

		// update prev/next links of adjacent markers
		this._editUpdatePrevNext(editMarker._prev, editMarker._next);

		// remove ghost markers near the removed marker
		if (editMarker._middleLeft) {
			this._editMarkerGroup.removeLayer(editMarker._middleLeft);
		}
		if (editMarker._middleRight) {
			this._editMarkerGroup.removeLayer(editMarker._middleRight);
		}

		// create a ghost marker in place of the removed one
		if (editMarker._prev && marker._next) {
			this._editCreateMiddleMarker(editMarker._prev, editMarker._next);

		} else if (!editMarker._prev) {
			editMarker._next._middleLeft = null;

		} else if (!editMarker._next) {
			editMarker._prev._middleRight = null;
		}

		this._fireEdit();
	},

	_editUpdateIndexes: function (index, delta) {
		this._editMarkerGroup.eachLayer(function (editMarker) {
			if (editMarker._index > index) {
				editMarker._index += delta;
			}
		});
	},
	
	_editCreateResizeMarker: function (editMarker1, editMarker2) {
		var map = this._map,
		    p1 = map.project([toLat(x1),toLon(y1)]),
		    p2 = map.project([toLat(x2),toLon(y2)]);
		
		var p4 = map.unproject(map.project([toLat(lat0),toLon(lng0)])._add(map.project([toLat(lat1),toLon(lng1)]))._divideBy(2));
		var p3 = map.unproject(p1._add(p2)._divideBy(2));
		var editMarker = this._editCreateMarker(p3,2),
		    editOnClick,
		    editOnDragStart,
		    editOnDragEnd;
		resizemarkervar = editMarker;
		editMarker.setOpacity(0.6);
		editOnDragStart = function () {
			lat = editMarker.getLatLng().lat;
			lng = editMarker.getLatLng().lng;
			initDistance = Math.sqrt(Math.pow(map.project(p4).x-map.project(p3).x,2)+Math.pow(map.project(p4).y-map.project(p3).y,2));
			initWidth = width;
			
		};

		editOnDragEnd = function () {
			editMarker.off('dragstart', editOnDragStart, this);
			editMarker.off('dragend', editOnDragEnd, this);
			
		};

		editOnClick = function () {
			editOnDragStart.call(this);
			editOnDragEnd.call(this);
		};

		editMarker
		    .on('click', editOnClick, this)
		    .on('dragstart', editOnDragStart, this)
		    .on('dragend', editOnDragEnd, this);

		this._editMarkerGroup.addLayer(editMarker);
	},
	
	_editCreateMoveMarker: function (editMarker1, editMarker2) {
		var map = this._map;
		var p4 = map.unproject(map.project([toLat(lat0),toLon(lng0)])._add(map.project([toLat(lat1),toLon(lng1)]))._divideBy(2));
		var editMarker = this._editCreateMarker(p4,3),
		    editOnClick,
		    editOnDragStart,
		    editOnDragEnd;
		movemarkervar = editMarker;
		editMarker.setOpacity(0.6);
		editOnDragStart = function () {
			mlatlng = editMarker.getLatLng();
			mlat = editMarker.getLatLng().lat;
			mlng = editMarker.getLatLng().lng;
			
		
			
		};

		editOnDragEnd = function () {
			editMarker.off('dragstart', editOnDragStart, this);
			editMarker.off('dragend', editOnDragEnd, this);
			this._editMarkerGroup.clearLayers();
			this._editInitMarkers();
		};

		editOnClick = function () {
			editOnDragStart.call(this);
			editOnDragEnd.call(this);
		};

		editMarker
		    .on('click', editOnClick, this)
		    .on('dragstart', editOnDragStart, this)
		    .on('dragend', editOnDragEnd, this);

		this._editMarkerGroup.addLayer(editMarker);
	},

	_editUpdatePrevNext: function (editMarker1, editMarker2) {
		if (editMarker1) {
			editMarker1._next = editMarker2;
		}
		if (editMarker2) {
			editMarker2._prev = editMarker1;
		}
	},

	_editGetMiddleLatLng: function (editMarker1, editMarker2) {
		var map = this._map,
		    p1 = map.project(editMarker1.getLatLng()),
		    p2 = map.project(editMarker2.getLatLng());

		return map.unproject(p1._add(p2)._divideBy(2));
	},
	
	removeCrossSection: function() {
		if(this._map.hasLayer(this._crossSection.line))
				this._map.removeLayer(this._crossSection.line);
			if(this._map.hasLayer(this._crossSection.rectangle)){
				this._map.removeLayer(this._crossSection.rectangle);
			}
	}
});
