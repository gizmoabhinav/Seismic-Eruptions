L.Edit = L.Edit || {};
var lat,lng,mlat,mlng,mlatlng,initDistance,initWidth,resizemarkervar,movemarkervar,endmarker1,endmarker2;
/*
 * L.Edit.Poly is an editing handler for polylines and polygons.
 */

L.Edit.Poly = L.Handler.extend({
	options: {
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		})
	},

	initialize: function (poly, options) {
		this._poly = poly;
		L.setOptions(this, options);
	},

	addHooks: function () {
		if (this._poly._map) {
			if (!this._markerGroup) {
				this._initMarkers();
			}
			this._poly._map.addLayer(this._markerGroup);
		}
	},

	removeHooks: function () {
		if (this._poly._map) {
			this._poly._map.removeLayer(this._markerGroup);
			delete this._markerGroup;
			delete this._markers;
		}
	},

	updateMarkers: function () {
		this._markerGroup.clearLayers();
		this._initMarkers();
	},

	_initMarkers: function () {
		if (!this._markerGroup) {
			this._markerGroup = new L.LayerGroup();
		}
		this._markers = [];

		var latlngs = this._poly._latlngs,
			i, j, len, marker;

		// TODO refactor holes implementation in Polygon to support it here

		for (i = 0, len = latlngs.length; i < len; i++) {

			marker = this._createMarker(latlngs[i], i);
			marker.on('click', this._onMarkerClick, this);
			this._markers.push(marker);
		}

		var markerLeft, markerRight;

		for (i = 0, j = len - 1; i < len; j = i++) {
			if (i === 0 && !(L.Polygon && (this._poly instanceof L.Polygon))) {
				continue;
			}

			markerLeft = this._markers[j];
			markerRight = this._markers[i];
			endmarker1 = markerLeft;
			endmarker2 = markerRight;
			this._createResizeMarker(markerLeft,markerRight);
			this._createMoveMarker(markerLeft, markerRight);
		}
	},

	_createMarker: function (latlng, index) {
		var marker = new L.Marker(latlng, {
			draggable: true,
			icon: this.options.icon
		});

		marker._origLatLng = latlng;
		marker._index = index;

		marker.on('drag', this._onMarkerDrag, this);
		marker.on('dragend', this._fireEdit, this);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_removeMarker: function (marker) {
		var i = marker._index;

		this._markerGroup.removeLayer(marker);
		this._markers.splice(i, 1);
		this._poly.spliceLatLngs(i, 1);
		this._updateIndexes(i, -1);

		marker
			.off('drag', this._onMarkerDrag, this)
			.off('dragend', this._fireEdit, this)
			.off('click', this._onMarkerClick, this);
	},

	_fireEdit: function () {
		this._poly.edited = true;
		this._poly.fire('edit');
	},

	_onMarkerDrag: function (e) {
		var marker = e.target;

		L.extend(marker._origLatLng, marker._latlng);

		/*if (marker._middleLeft) {
			marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
		}
		if (marker._middleRight) {
			marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
		}*/
		var map = this._poly._map,
		    p1 = map.project([toLat(x1),toLon(y1)]),
		    p2 = map.project([toLat(x2),toLon(y2)]);
		var p4 = map.unproject(map.project([toLat(lat0),toLon(lng0)])._add(map.project([toLat(lat1),toLon(lng1)]))._divideBy(2));
		var p3 = map.unproject(p1._add(p2)._divideBy(2));
		if(marker._index == 2){
			if(width <= 5){
				width = Math.sqrt(Math.pow(map.project(p4).x-map.project(marker.getLatLng()).x,2)+Math.pow(map.project(p4).y-map.project(marker.getLatLng()).y,2))*initWidth/initDistance;
				
			}
			//marker.setLatLng(p3);
		}
		if(marker._index == 3){
			offset = [map.project(mlatlng).x - map.project(marker._latlng).x, map.project(mlatlng).y - map.project(marker._latlng).y];
			mlatlng = marker._latlng;
			polygonArr[0]=map.unproject([map.project(polygonArr[0]).x - offset[0],map.project(polygonArr[0]).y - offset[1]]);
			polygonArr[1]=map.unproject([map.project(polygonArr[1]).x - offset[0],map.project(polygonArr[1]).y - offset[1]]);
			this._poly.setLatLngs([polygonArr[0], polygonArr[1]]);
			/*endmarker1.setLatLng(polygonArr[0]);
			endmarker2.setLatLng(polygonArr[1]);*/
			//this.updateMarkers();
			//marker.setLatLng(p4);
		}
		
		this._poly._map.removeLayer(polygon);
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
			polygon = L.polygon([
						[toLat(x1),toLon(y1)],
						[toLat(x2),toLon(y2)],
						[toLat(x3),toLon(y3)],
						[toLat(x4),toLon(y4)]
					]).addTo(this._poly._map);
		resizemarkervar.setLatLng(p3);
		movemarkervar.setLatLng(p4);
		this._poly.redraw();
	},

	_onMarkerClick: function (e) {
		var minPoints = L.Polygon && (this._poly instanceof L.Polygon) ? 4 : 3,
			marker = e.target;

		// If removing this point would create an invalid polyline/polygon don't remove
		if (this._poly._latlngs.length < minPoints) {
			return;
		}

		// remove the marker
		this._removeMarker(marker);

		// update prev/next links of adjacent markers
		this._updatePrevNext(marker._prev, marker._next);

		// remove ghost markers near the removed marker
		if (marker._middleLeft) {
			this._markerGroup.removeLayer(marker._middleLeft);
		}
		if (marker._middleRight) {
			this._markerGroup.removeLayer(marker._middleRight);
		}

		// create a ghost marker in place of the removed one
		if (marker._prev && marker._next) {
			this._createMiddleMarker(marker._prev, marker._next);

		} else if (!marker._prev) {
			marker._next._middleLeft = null;

		} else if (!marker._next) {
			marker._prev._middleRight = null;
		}

		this._fireEdit();
	},

	_updateIndexes: function (index, delta) {
		this._markerGroup.eachLayer(function (marker) {
			if (marker._index > index) {
				marker._index += delta;
			}
		});
	},
	
	_createResizeMarker: function (marker1, marker2) {
		var map = this._poly._map,
		    p1 = map.project([toLat(x1),toLon(y1)]),
		    p2 = map.project([toLat(x2),toLon(y2)]);
		
		var p4 = map.unproject(map.project([toLat(lat0),toLon(lng0)])._add(map.project([toLat(lat1),toLon(lng1)]))._divideBy(2));
		var p3 = map.unproject(p1._add(p2)._divideBy(2));
		var marker = this._createMarker(p3,2),
		    onClick,
		    onDragStart,
		    onDragEnd;
		resizemarkervar = marker;
		marker.setOpacity(0.6);
		onDragStart = function () {
			lat = marker.getLatLng().lat;
			lng = marker.getLatLng().lng;
			initDistance = Math.sqrt(Math.pow(map.project(p4).x-map.project(p3).x,2)+Math.pow(map.project(p4).y-map.project(p3).y,2));
			initWidth = width;
			
		};

		onDragEnd = function () {
			marker.off('dragstart', onDragStart, this);
			marker.off('dragend', onDragEnd, this);
			
		};

		onClick = function () {
			onDragStart.call(this);
			onDragEnd.call(this);
		};

		marker
		    .on('click', onClick, this)
		    .on('dragstart', onDragStart, this)
		    .on('dragend', onDragEnd, this);

		this._markerGroup.addLayer(marker);
	},
	
	_createMoveMarker: function (marker1, marker2) {
		var map = this._poly._map;
		var p4 = map.unproject(map.project([toLat(lat0),toLon(lng0)])._add(map.project([toLat(lat1),toLon(lng1)]))._divideBy(2));
		var marker = this._createMarker(p4,3),
		    onClick,
		    onDragStart,
		    onDragEnd;
		movemarkervar = marker;
		marker.setOpacity(0.6);
		onDragStart = function () {
			mlatlng = marker.getLatLng();
			mlat = marker.getLatLng().lat;
			mlng = marker.getLatLng().lng;
			
		
			
		};

		onDragEnd = function () {
			marker.off('dragstart', onDragStart, this);
			marker.off('dragend', onDragEnd, this);
			this._markerGroup.clearLayers();
			this._initMarkers();
		};

		onClick = function () {
			onDragStart.call(this);
			onDragEnd.call(this);
		};

		marker
		    .on('click', onClick, this)
		    .on('dragstart', onDragStart, this)
		    .on('dragend', onDragEnd, this);

		this._markerGroup.addLayer(marker);
	},

	_updatePrevNext: function (marker1, marker2) {
		if (marker1) {
			marker1._next = marker2;
		}
		if (marker2) {
			marker2._prev = marker1;
		}
	},

	_getMiddleLatLng: function (marker1, marker2) {
		var map = this._poly._map,
		    p1 = map.project(marker1.getLatLng()),
		    p2 = map.project(marker2.getLatLng());

		return map.unproject(p1._add(p2)._divideBy(2));
	}
});

L.Polyline.addInitHook(function () {

	// Check to see if handler has already been initialized. This is to support versions of Leaflet that still have L.Handler.PolyEdit
	if (this.editing) {
		return;
	}

	if (L.Edit.Poly) {
		this.editing = new L.Edit.Poly(this);

		if (this.options.editable) {
			this.editing.enable();
		}
	}

	this.on('add', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.addHooks();
		}
	});

	this.on('remove', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.removeHooks();
		}
	});
});
