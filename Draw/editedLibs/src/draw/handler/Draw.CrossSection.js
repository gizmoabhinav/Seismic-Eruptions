var polygonArr = new Array();
var polygon;
var touchstart = true;
var touchend = false;
var width=0.25;
var length,ratio1,ratio2,x1,y1,x2,y2,x3,y3,x4,y4;
L.Draw.CrossSection = L.Draw.Feature.extend({
	statics: {
		TYPE: 'polyline'
	},

	Poly: L.Polyline,

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

	initialize: function (map, options) {
		// Need to set this here to ensure the correct message is used.
		this.options.drawError.message = L.drawLocal.draw.handlers.polyline.error;

		// Merge default drawError options with custom options
		if (options && options.drawError) {
			options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
		}

		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.CrossSection.TYPE;

		L.Draw.Feature.prototype.initialize.call(this, map, options);
	},

	addHooks: function () {
		L.Draw.Feature.prototype.addHooks.call(this);
		if (this._map) {
			this._markers = [];
			this._map.dragging.disable();
			this._markerGroup = new L.LayerGroup();
			this._map.addLayer(this._markerGroup);

			this._poly = new L.Polyline([], this.options.shapeOptions);

			this._tooltip.updateContent(this._getTooltipText());

			// Make a transparent marker that will used to catch click events. These click
			// events will create the vertices. We need to do this so we can ensure that
			// we can create vertices over other map layers (markers, vector layers). We
			// also do not want to trigger any click handlers of objects we are clicking on
			// while drawing.
			
			L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
			L.DomEvent.on(this._map._container, 'touchend', this._onTouchEnd, this);
			L.DomEvent.on(this._map._container, 'touchmove', this._onTouchMove, this);
			
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
		L.Draw.Feature.prototype.removeHooks.call(this);

		this._clearHideErrorTimeout();

		this._cleanUpShape();

		// remove markers from map
		this._map.removeLayer(this._markerGroup);
		delete this._markerGroup;
		delete this._markers;

		this._map.removeLayer(this._poly);
		delete this._poly;

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
			.off('zoomend', this._onZoomEnd, this);
	},

	deleteLastVertex: function () {
		if (this._markers.length <= 1) {
			return;
		}

		var lastMarker = this._markers.pop(),
			poly = this._poly,
			latlng = this._poly.spliceLatLngs(poly.getLatLngs().length - 1, 1)[0];

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

		this._poly.addLatLng(latlng);
		
		//polygonArr[polygonArr.length]=latlng;
		
		if (this._poly.getLatLngs().length == 2) {
		//alert(this._poly.getLatLngs()[1]);
			this._map.addLayer(this._poly);
		}

		//this._vertexChanged(latlng, true);
		if((markersLength) == 2){
			polygonArr[1] = latlng;
			map.addLayer(drawnItems);
			this._finishShape();
			polygonArr[2]=polygonArr[0];
			polygonArr[3]=polygonArr[1];
			polygonArr[2].lat=convertCoordinatesy(polygonArr[0].lat);
			polygonArr[3].lat=convertCoordinatesy(polygonArr[1].lat);
			polygonArr[2].lng=convertCoordinatesx(polygonArr[0].lng);
			polygonArr[3].lng=convertCoordinatesx(polygonArr[1].lng);
			length = Math.sqrt(Math.pow((polygonArr[0].lat)-(polygonArr[1].lat),2)+Math.pow((polygonArr[0].lng)-(polygonArr[1].lng),2));
			ratio1 = length/(((polygonArr[0].lat)-(polygonArr[1].lat)));
			ratio2 = length/(((polygonArr[0].lng)-(polygonArr[1].lng)));
			x1=polygonArr[1].lat+(width/ratio2);
			y1=polygonArr[1].lng-(width/ratio1);
			x2=polygonArr[0].lat+(width/ratio2);
			y2=polygonArr[0].lng-(width/ratio1);
			x3=polygonArr[0].lat-(width/ratio2);
			y3=polygonArr[0].lng+(width/ratio1);
			x4=polygonArr[1].lat-(width/ratio2);
			y4=polygonArr[1].lng+(width/ratio1);
			polygon = L.polygon([
						[toLat(x1),toLon(y1)],
						[toLat(x2),toLon(y2)],
						[toLat(x3),toLon(y3)],
						[toLat(x4),toLon(y4)]
					]).addTo(this._map);
		}
		else{
			polygonArr = new Array();
			polygonArr[0] = latlng;
			if(map.hasLayer(drawnItems)){
				map.removeLayer(drawnItems);
			}
			if(map.hasLayer(polygon)){
				map.removeLayer(polygon);
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
			this._map.dragging.enable();
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
		var markerCount = this._markers.length;

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
				text: L.drawLocal.draw.handlers.polyline.tooltip.start
			};
		} else {
			distanceStr = showLength ? this._getMeasurementString() : '';

			if (this._markers.length === 1) {
				labelText = {
					text: L.drawLocal.draw.handlers.polyline.tooltip.cont,
					subtext: distanceStr
				};
			} else {
				labelText = {
					text: L.drawLocal.draw.handlers.polyline.tooltip.end,
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
			distance = latlng.distanceTo(this._markers[previousMarkerIndex].getLatLng());

			this._measurementRunningTotal += distance * (added ? 1 : -1);
		}
	},

	_getMeasurementString: function () {
		var currentLatLng = this._currentLatLng,
			previousLatLng = this._markers[this._markers.length - 1].getLatLng(),
			distance;

		// calculate the distance from the last fixed point to the mouse position
		distance = this._measurementRunningTotal + currentLatLng.distanceTo(previousLatLng);

		return L.GeometryUtil.readableDistance(distance, this.options.metric);
	},

	_showErrorTooltip: function () {
		this._errorShown = true;

		// Update tooltip
		this._tooltip
			.showAsError()
			.updateContent({ text: this.options.drawError.message });

		// Update shape
		this._updateGuideColor(this.options.drawError.color);
		this._poly.setStyle({ color: this.options.drawError.color });

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
		this._poly.setStyle({ color: this.options.shapeOptions.color });
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
		var poly = new this.Poly(this._poly.getLatLngs(), this.options.shapeOptions);
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
	}
});
