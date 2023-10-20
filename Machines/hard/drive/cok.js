! function($, window, undefined) {
    "use strict";
    $.fn.mapit = function(options) {
        var defaults = {
                latitude: 37.970996,
                longitude: 23.730542,
                zoom: 16,
                type: "ROADMAP",
                scrollwheel: !1,
                marker: {
                    latitude: 37.970996,
                    longitude: 23.730542,
                    icon: "",
                    title: "",
                    open: !1,
                    center: !0
                },
                address: "",
                styles: "GRAYSCALE",
                locations: [],
                origins: []
            },
            options = $.extend(defaults, options);
        $(this).each(function() {
            var $this = $(this),
                directionsDisplay = new google.maps.DirectionsRenderer,
                mapOptions = {
                    scrollwheel: options.scrollwheel,
                    scaleControl: !1,
                    center: options.marker.center ? new google.maps.LatLng(options.marker.latitude, options.marker.longitude) : new google.maps.LatLng(options.latitude, options.longitude),
                    zoom: options.zoom,
                    mapTypeId: eval("google.maps.MapTypeId." + options.type)
                },
                map = new google.maps.Map(document.getElementById($this.attr("id")), mapOptions);
            if (directionsDisplay.setMap(map), options.styles) {
                var GRAYSCALE_style = [{
                        featureType: "all",
                        elementType: "all",
                        stylers: [{
                            saturation: -100
                        }]
                    }],
                    MIDNIGHT_style = [{
                        featureType: "water",
                        stylers: [{
                            color: "#021019"
                        }]
                    }, {
                        featureType: "landscape",
                        stylers: [{
                            color: "#08304b"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#0c4152"
                        }, {
                            lightness: 5
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#0b434f"
                        }, {
                            lightness: 25
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#0b3d51"
                        }, {
                            lightness: 16
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 13
                        }]
                    }, {
                        featureType: "transit",
                        stylers: [{
                            color: "#146474"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#144b53"
                        }, {
                            lightness: 14
                        }, {
                            weight: 1.4
                        }]
                    }],
                    BLUE_style = [{
                        featureType: "water",
                        stylers: [{
                            color: "#46bcec"
                        }, {
                            visibility: "on"
                        }]
                    }, {
                        featureType: "landscape",
                        stylers: [{
                            color: "#f2f2f2"
                        }]
                    }, {
                        featureType: "road",
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 45
                        }]
                    }, {
                        featureType: "road.highway",
                        stylers: [{
                            visibility: "simplified"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#444444"
                        }]
                    }, {
                        featureType: "transit",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "poi",
                        stylers: [{
                            visibility: "off"
                        }]
                    }],
                    mapType = new google.maps.StyledMapType(eval(options.styles + "_style"), {
                        name: options.styles
                    });
                map.mapTypes.set(options.styles, mapType), map.setMapTypeId(options.styles)
            }
            var home = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(options.marker.latitude, options.marker.longitude),
                    icon: new google.maps.MarkerImage(options.marker.icon),
                    title: options.marker.title
                }),
                info = new google.maps.InfoWindow({
                    content: options.address
                });
            options.marker.open ? info.open(map, home) : google.maps.event.addListener(home, "click", function() {
                info.open(map, home)
            });
            var infowindow = new google.maps.InfoWindow,
                marker, i, markers = [];
            for (i = 0; i < options.locations.length; i++) marker = new google.maps.Marker({
                position: new google.maps.LatLng(options.locations[i][0], options.locations[i][1]),
                map: map,
                icon: new google.maps.MarkerImage(options.locations[i][2] || options.marker.icon),
                title: options.locations[i][3]
            }), markers.push(marker), google.maps.event.addListener(marker, "click", function(e, o) {
                return function() {
                    infowindow.setContent(options.locations[o][4]), infowindow.open(map, e)
                }
            }(marker, i));
            var directionsService = new google.maps.DirectionsService;
            $this.on("route", function(e, o) {
                var t = {
                    origin: new google.maps.LatLng(options.origins[o][0], options.origins[o][1]),
                    destination: new google.maps.LatLng(options.marker.latitude, options.marker.longitude),
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(t, function(e, o) {
                    o == google.maps.DirectionsStatus.OK && directionsDisplay.setDirections(e)
                })
            }), $this.on("hide_all", function() {
                for (var e = 0; e < options.locations.length; e++) markers[e].setVisible(!1)
            }), $this.on("show", function(e, o) {
                $this.trigger("hide_all"), $this.trigger("reset");
                for (var t = new google.maps.LatLngBounds, i = 0; i < options.locations.length; i++) options.locations[i][6] == o && markers[i].setVisible(!0), t.extend(markers[i].position);
                map.fitBounds(t)
            }), $this.on("hide", function(e, o) {
                for (var t = 0; t < options.locations.length; t++) options.locations[t][6] == o && markers[t].setVisible(!1)
            }), $this.on("clear", function() {
                if (markers)
                    for (var e = 0; e < markers.length; e++) markers[e].setMap(null)
            }), $this.on("reset", function() {
                map.setCenter(new google.maps.LatLng(options.latitude, options.longitude), options.zoom)
            }), $this.trigger("hide_all")
        })
    }, $(document).ready(function() {
        $('[data-toggle="mapit"]').mapit()
    })
}(jQuery);