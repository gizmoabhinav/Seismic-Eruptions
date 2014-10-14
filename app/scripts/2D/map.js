var map2D = (function () {

    //The map object with all the variables of current map being shown
    var map = {

        leafletMap: L.map('map'),

        parameters: {
            mag: getURLParameter("mag"),
            startdate: getURLParameter("startdate"),
            enddate: getURLParameter("enddate"),

            defaultInit: function () {
                var d = new Date();
                if (this.mag == undefined) {
                    this.mag = 5;
                }
                if (this.startdate == undefined) {
                    this.startdate = "2009/1/1";
                }
                if (this.enddate == undefined) {
                    this.enddate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
                }
            }
        },

        values: {
            timediff: 0,
            size: 0,
            maxdepth: 0,
            mindepth: 2000,
        },

        layers: {
            baseLayer3: L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}),
            baseLayer2: L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {}),
            baseLayer1: L.tileLayer('http://{s}.tiles.mapbox.com/v3/bclc-apec.map-rslgvy56/{z}/{x}/{y}.png', {})
        },

        drawnItems: new L.FeatureGroup(),

        circles: new Array(),
        time: new Array(),
        stamp: new Array(),
        depth: new Array(),

        array: new Array(),
        magarray: {},

        editing: false,

        plateBoundaries: new L.KML("../../assets/2D/plates.kml", {
            async: true
        }),

        plateToggle: function () {
            if ($("#plates").is(':checked')) {
                this.leafletMap.addLayer(this.plateBoundaries); // checked
            } else {
                this.leafletMap.removeLayer(this.plateBoundaries); // unchecked
            }
        },

        mapAdder: function (i) {
            if (!map.leafletMap.hasLayer(map.circles[i])) {
                map.circles[i].addTo(map.leafletMap);
            }
            map.circles[i].setStyle({
                fillOpacity: 0.5,
                fillColor: "#" + rainbow.colourAt(map.depth[i])
            });
            i++;
            while (map.leafletMap.hasLayer(map.circles[i])) {
                map.leafletMap.removeLayer(map.circles[i]);
                i++;
            }
            $("#time").html(map.time[i]);
            controller.snd.play();
        },

        mapRemover: function (i) {
            if (map.leafletMap.hasLayer(map.circles[i])) {
                map.leafletMap.removeLayer(map.circles[i]);
            }
        },
		
		render:function () {
        if (this.editing) {
            alert("Save edit before viewing the cross section");
            return;
        }
        if (linelength == 0) {
            alert("Draw a cross-section first");
            return;
        } else if (linelength >= 1400) {
            alert("cross section too long");
            return;
        }
        window.open("../3D/index.html?x1=" + toLon(y1) + "&y1=" + toLat(x1) + "&x2=" + toLon(y2) + "&y2=" + toLat(x2) + "&x3=" + toLon(y3) + "&y3=" + toLat(x3) + "&x4=" + toLon(y4) + "&y4=" + toLat(x4) + "&mag=" + map.parameters.mag + "&startdate=" + map.parameters.startdate + "&enddate=" + map.parameters.enddate);
    },
    poly:{}, polyedit:{},

    startdrawing: function () {
        if (this.editing) {
            alert("Save edit before drawing a new cross-section");
            return;
        }
        this.poly = new L.Draw.CrossSection(map.leafletMap, []);
        this.poly.enable();
        this.poly._updateTooltip();
    },

    editdrawing:function () {
        this.editing = true;
        this.polyedit = new L.EditToolbar.Edit(map, {
            featureGroup: this.drawnItems,
            selectedPathOptions: {
                color: '#fe57a1',
                opacity: 0.6,
                dashArray: '10, 10',
                fill: true,
                fillColor: '#fe57a1',
                fillOpacity: 0.1,
                maintainColor: false
            }
        });
        this.polyedit.enable();
    },

    editsave:function () {
        this.editing = false;
        this.polyedit.save();
        this.polyedit.disable();
        this.polyedit = null;
    },

    backtonormalview:function () {
        this.editing = false;
        if (this.polyedit != null) editsave();
        this.poly.disable();
        this.poly = null;
    }

    };

    var controller = {
        timeLine: new TimelineLite({
            onUpdate: updateSlider
        }),

        speed: 6,




        script: document.createElement('script'),

        snd: new Audio("../../assets/2D/tap.wav"), // buffers automatically when created

        initController: function () {

            this.script.src = 'http://comcat.cr.usgs.gov/fdsnws/event/1/query?starttime=' + map.parameters.startdate + '%0000:00:00&minmagnitude=' + map.parameters.mag + '&format=geojson&callback=eqfeed_callback&endtime=' + map.parameters.enddate + '%0000:00:00&orderby=time-asc';
            document.getElementsByTagName('body')[0].appendChild(this.script);
            window.eqfeed_callback = function (results) {

                map.values.size = results.features.length;

                for (var i = 0; i < map.values.size; i++) {
                    map.circles[i] = L.geoJson(results.features[i], {
                        pointToLayer: function (feature, latlng) {
                            return L.circleMarker(latlng, {
                                radius: results.features[i].properties.mag,
                                fillColor: "#" + rainbow.colourAt(results.features[i].properties.mag),
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 1
                            });
                        }
                    }).bindPopup("Place: <b>" + results.features[i].properties.place + "</b></br>Magnitude : <b>" + results.features[i].properties.mag + "</b></br>Time : " + timeConverter(results.features[i].properties.time) + "</br>Depth : " + results.features[i].geometry.coordinates[2] + " km");
                    //circles[i].addTo(map.leafletMap);
                    map.time[i] = timeConverter(results.features[i].properties.time);
                    map.stamp[i] = results.features[i].properties.time
                    map.depth[i] = results.features[i].geometry.coordinates[2];
                    if (map.depth[i] > map.values.maxdepth) map.values.maxdepth = map.depth[i];
                    if (map.depth[i] < map.values.mindepth) map.values.mindepth = map.depth[i];
                    // Adding events to the timeline
                    //if(i==0)
                    //tl.append(TweenLite.delayedCall(0,mapAdder,[i.toString]));
                    if (i > 0) {
                        controller.timeLine.append(TweenLite.delayedCall(20 * ((results.features[i].properties.time - results.features[i - 1].properties.time) / 1000000000), map.mapAdder, [i.toString()]));
                    }
                }
                rainbow.setNumberRange(map.values.mindepth, map.values.maxdepth);
                map.values.timediff = results.features[map.values.size - 1].properties.time - results.features[0].properties.time;
                map.parameters.starttime = results.features[0].properties.time;

                $("#slider").slider({
                    value: 0,
                    range: "min",
                    min: 0,
                    max: map.values.timediff,
                    slide: function (event, ui) {
                        $("#date").html(timeConverter(map.parameters.starttime));
                        //tl.seek();
                        controller.timeLine.pause();
                        controller.timeLine.progress(ui.value / (map.values.timediff));
                    }
                })
            }
        }
    };

    var rainbow = new Rainbow();

    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
    }

    //time stamp conversion
    function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = year + ' ' + month + ' ' + date;
        return time;
    }

    //load count file
    var loadCountFile = (function () {
        $.get('count.txt', function (data) {
            array = data.split(',');
            console.log(array);
            var length = array.length;
            console.log(length);
            magarray = new Array();
            for (var i = 99; i >= 0; i--) {
                magarray[i] = new Array();
                for (var j = 0; j < length / 102; j++) {
                    if (magarray[i][j] != undefined) magarray[i][j] = parseInt(array[(j * 102) + 2 + i]) + parseInt(magarray[i][j]);
                    else magarray[i][j] = parseInt(array[(j * 102) + 2 + i]);
                    if (j + 1 < length / 102) magarray[i][j + 1] = parseInt(magarray[i][j]);
                    if (i < 99) magarray[i][j] = parseInt(magarray[i + 1][j]) + parseInt(magarray[i][j]);
                }
            }
            console.log(magarray);
        });
    });

    function updateSlider() {
        $("#slider").slider("value", (controller.timeLine.progress() * map.values.timediff));
        $("#date").html(timeConverter((controller.timeLine.progress() * map.values.timediff) + map.parameters.starttime));
    }

    $("#index").on("pageshow", function (event, ui) {

        $.mobile.loading('show');

        map.leafletMap.invalidateSize(true);

        map.parameters.defaultInit();

        map.layers.baseLayer1.addTo(map.leafletMap);

        map.leafletMap.fitBounds([
            [50, 40],
            [-20, -40]
        ]);
        map.leafletMap.setMaxBounds([
            [-90, 180],
            [90, -180]
        ]);

        controller.timeLine.timeScale(controller.speed);
        controller.timeLine.pause();
        controller.initController();

        $("#info").html("</br></br>total earthquakes : " + controller.size + "</br>minimum depth : " + controller.mindepth + " km</br>maximum depth : " + controller.maxdepth + " km</br></br></br><div class='ui-body ui-body-a'><p><a href='http://github.com/gizmoabhinav/Seismic-Eruptions'>Link to the project</a></p></div>");
        $("#startdate").html("Start date : " + timeConverter(map.parameters.startdate));
        $("#enddate").html("End date : " + timeConverter(map.parameters.enddate));
        $("#magcutoff").html("Cutoff magnitude : " + map.parameters.mag);

        $.mobile.loading('hide');
        setTimeout(function () {
            map.leafletMap.invalidateSize();
        }, 1);
        controller.timeLine.resume();


    });

    //buttons
    $('#play').click(function () {
        controller.timeLine.resume();
    });
    $('#pause').click(function () {
        controller.timeLine.pause();
    });
    $('#speedup').click(function () {
        controller.speed *= 1.5;
        controller.timeLine.timeScale(controller.speed);
    });
    $('#speeddown').click(function () {
        if (controller.speed >= 0.5) {
            controller.speed /= 2;
            controller.timeLine.timeScale(controller.speed);
        }
    });
    $('#changeparams').click(function () {
        controller.timeLine.pause();
    });
    $('#editparamscancel').click(function () {
        controller.timeLine.resume();
    });
    $('#editparamsenter').click(function () {
        controller.timeLine.pause();
    });


    var select1 = document.getElementById('date-1-y');
    var select2 = document.getElementById('date-2-y');
    var year = 1960;
    while (year != 2015) {
        var option1, option2;
        option1 = document.createElement("option");
        option1.setAttribute("value", parseInt(year) - 1900);
        option1.innerHTML = year;
        select1.appendChild(option1);
        option2 = document.createElement("option");
        option2.setAttribute("value", parseInt(year) - 1900);
        option2.innerHTML = year;
        select2.appendChild(option2);
        year = parseInt(year) + 1;
    }
    /////////// Drawing Controls ///////////

    var Line;
    map.leafletMap.on('draw:created', function (e) {
        var type = e.layerType,
            Line = e.layer;
        map.drawnItems.addLayer(Line);
    });
    $('#index').click(function () {
        $('#playcontrols').fadeIn();
        $('#slider').fadeIn();
        $('#date').fadeIn();
        setTimeout(function () {
            $('#playcontrols').fadeOut();
        }, 5000);
        setTimeout(function () {
            $('#slider').fadeOut();
            $('#date').fadeOut();
        }, 12000);
    });
    $('#playback').hover(function () {
        $('#playcontrols').fadeIn();
        $('#slider').fadeIn();
        $('#date').fadeIn();
        setTimeout(function () {
            $('#slider').fadeOut();
            $('#date').fadeOut();
            $('#playcontrols').fadeOut();
        }, 8000);
    });
    setTimeout(function () {
        $('#slider').fadeOut();
        $('#date').fadeOut();
        $('#playcontrols').fadeOut();
    }, 10000);
    var drawingMode = false;
    $('#drawingTool').click(function () {
        if (!drawingMode) {
            controller.timeLine.pause();
            $.mobile.loading('show');
            map.leafletMap.addLayer(map.drawnItems);
            $('#playback').fadeOut();
            $('#crosssection').fadeIn();
            for (var i = 0; i < map.values.size; i++) {
                if (!map.leafletMap.hasLayer(map.circles[i])) {
                    map.circles[i].setStyle({
                        fillOpacity: 0.5,
                        fillColor: "#" + rainbow.colourAt(map.depth[i])
                    });
                    map.circles[i].addTo(map.leafletMap);
                }
            }
            $.mobile.loading('hide');
            drawingMode = true;
        }
    });
    $('#drawingToolDone').click(function () {
        if (drawingMode) {
            $.mobile.loading('show');
            $('#playback').fadeIn();
            $('#crosssection').fadeOut();
            map.drawnItems.eachLayer(function (layer) {
                map.drawnItems.removeLayer(layer);
            });
            if (map.leafletMap.hasLayer(map.drawnItems)) {
                map.leafletMap.removeLayer(map.drawnItems);
            }
            if (map.leafletMap.hasLayer(polygon)) {
                map.leafletMap.removeLayer(polygon);
            }
            $.mobile.loading('hide');
            drawingMode = false;
            map.leafletMap.setZoom(2);
        }
    });
    $('#mapselector').change(function () {
        if (map.leafletMap.hasLayer(map.layers.baseLayer1)) {
            map.leafletMap.removeLayer(map.layers.baseLayer1);
        }
        if (map.leafletMap.hasLayer(map.layers.baseLayer2)) {
            map.leafletMap.removeLayer(map.layers.baseLayer2);
        }
        if (map.leafletMap.hasLayer(map.layers.baseLayer3)) {
            map.leafletMap.removeLayer(map.layers.baseLayer3);
        }
        switch ($('#mapselector').val()) {
            case '1':
                map.layers.baseLayer1.addTo(map.leafletMap);
                if (map.leafletMap.hasLayer(map.layers.baseLayer2)) {
                    map.leafletMap.removeLayer(map.layers.baseLayer2);
                }
                if (map.leafletMap.hasLayer(map.layers.baseLayer3)) {
                    map.leafletMap.removeLayer(map.layers.baseLayer3);
                }
                break;
            case '2':
                map.layers.baseLayer2.addTo(map.leafletMap);
                if (map.leafletMap.hasLayer(map.layers.baseLayer3)) {
                    map.leafletMap.removeLayer(map.layers.baseLayer3);
                }
                if (map.leafletMap.hasLayer(map.layers.baseLayer1)) {
                    map.leafletMap.removeLayer(map.layers.baseLayer1);
                }
                break;
            case '3':
                map.layers.baseLayer3.addTo(map.leafletMap);
                if (map.leafletMap.hasLayer(map.layers.baseLayer2)) {
                    map.leafletMap.removeLayer(map.layers.baseLayer2);
                }
                if (map.leafletMap.hasLayer(map.layers.baseLayer1)) {
                    map.leafletMap.removeLayer(map.layers.baseLayer1);
                }
        }
    });
    $('#date-1-y').change(function () {
        loadCount(1);
    });
    $('#date-1-m').change(function () {
        loadCount(1);
    });
    $('#date-2-y').change(function () {
        loadCount(1);
    });
    $('#date-2-m').change(function () {
        loadCount(1);
    });
	
    return map;
})();