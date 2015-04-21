!function(t){"use strict";function i(t){throw"L.Pather: "+t+"."}"undefined"==typeof L&&i("Leaflet.js is required: http://leafletjs.com/");var n={VIEW:1,CREATE:2,EDIT:4,DELETE:8,APPEND:16,EDIT_APPEND:20,ALL:31};L.Pather=L.FeatureGroup.extend({initialize:function(t){this.options=Object.assign(this.defaultOptions(),t||{}),this.creating=!1,this.polylines=[]},createPath:function(t){if(t.length<=1)return!1;this.clearAll();var i=new L.Pather.Polyline(this.map,t,this.options,{fire:this.fire.bind(this),mode:this.getMode.bind(this),remove:this.removePath.bind(this)});return this.polylines.push(i),this.fire("created",{polyline:i,latLngs:i.getLatLngs()}),i},removePath:function(t){if(t instanceof L.Pather.Polyline){var i=this.polylines.indexOf(t);return this.polylines.splice(i,1),t.softRemove(),this.fire("deleted",{polyline:t,latLngs:[]}),!0}return!1},getPaths:function(){return this.polylines},onAdd:function(t){var i=this.element=this.options.element||t._container;this.draggingState=t.dragging._enabled,this.map=t,this.fromPoint={x:0,y:0},this.svg=d3.select(i).append("svg").attr("pointer-events","none").attr("class",this.getOption("moduleClass")).attr("width",this.getOption("width")).attr("height",this.getOption("height")),t.dragging.disable(),this.attachEvents(t),this.setMode(this.options.mode)},attachEvents:function(t){function i(t){return t.touches?t.touches[0]:t}var e=function(){return this.polylines.filter(function(t){return t.manipulating})}.bind(this),o=function(){return!!(this.options.mode&n.CREATE)}.bind(this);t.on("mousedown",function(n){n=n.originalEvent||i(n);var s=this.map.mouseEventToContainerPoint(n),a=this.map.containerPointToLayerPoint(s),r=this.map.layerPointToLatLng(a);o()&&0===e().length&&(this.creating=!0,this.fromPoint=t.latLngToContainerPoint(r),this.latLngs=[])}.bind(this)),t._container.addEventListener("mouseleave",function(){this.clearAll(),this.creating=!1}.bind(this)),t.on("mousemove",function(t){t=t.originalEvent||i(t);var n=this.map.mouseEventToContainerPoint(t),o=this.map.containerPointToLayerPoint(n);if(e().length>0)return void e()[0].moveTo(o);var s=d3.svg.line().x(function(t){return t.x}).y(function(t){return t.y}).interpolate("linear");if(this.creating){var a=[this.fromPoint,new L.Point(o.x,o.y,!1)];this.latLngs.push(o),this.svg.append("path").classed(this.getOption("lineClass"),!0).attr("d",s(a)).attr("stroke",this.getOption("strokeColour")).attr("stroke-width",this.getOption("strokeWidth")).attr("fill","none"),this.fromPoint={x:o.x,y:o.y}}}.bind(this)),t.on("mouseup",function(){return 0===e().length?(this.creating=!1,this.createPath(this.convertPointsToLatLngs(this.latLngs)),void(this.latLngs=[])):(e()[0].attachElbows(),e()[0].finished(),void(e()[0].manipulating=!1))}.bind(this)),this.map._container.addEventListener("touchstart",this.fire.bind(t,"mousedown")),this.map._container.addEventListener("touchmove",this.fire.bind(t,"mousemove")),this.map._container.addEventListener("touchend",this.fire.bind(t,"mouseup"))},convertPointsToLatLngs:function(t){return t.map(function(t){return this.map.containerPointToLatLng(t)}.bind(this))},clearAll:function(){this.svg.text("")},getOption:function(t){return this.options[t]||this.defaultOptions()[t]},defaultOptions:function(){return{moduleClass:"pather",lineClass:"drawing-line",detectTouch:!0,elbowClass:"elbow",strokeColour:"rgba(0,0,0,.5)",strokeWidth:2,width:"100%",height:"100%",smoothFactor:10,pathColour:"black",pathOpacity:.55,pathWidth:3,mode:n.ALL}},setSmoothFactor:function(t){this.options.smoothFactor=parseInt(t)},setMode:function(i){this.setClassName(i),this.options.mode=i;var e=this.map._container.querySelector(".leaflet-tile-pane"),o=function(){return this.detectTouch&&("ontouchstart"in t||"onmsgesturechange"in t)?this.options.mode&n.CREATE||this.options.mode&n.EDIT:this.options.mode&n.CREATE}.bind(this);if(o()){var s=this.draggingState?"disable":"enable";return e.style.pointerEvents="none",void this.map.dragging[s]()}e.style.pointerEvents="all",this.map.dragging.enable()},setClassName:function(t){var i=function(i){var e=["mode",i].join("-");return n[i.toUpperCase()]&t?void this.element.classList.add(e):void this.element.classList.remove(e)}.bind(this);i("create"),i("delete"),i("edit"),i("append")},getMode:function(){return this.options.mode},setOptions:function(t){this.options=Object.assign(this.options,t||{})}}),L.Pather.MODE=n,L.pather=function(t){return new L.Pather(t)}}(window),function(){"use strict";Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(t,i){if(void 0===t||null===t)throw new TypeError("Cannot convert first argument to object");for(var n=Object(t),e=1;e<arguments.length;e++){var o=arguments[e];if(void 0!==o&&null!==o){o=Object(o);for(var s=Object.keys(Object(o)),a=0,r=s.length;r>a;a++){var h=s[a],l=Object.getOwnPropertyDescriptor(o,h);void 0!==l&&l.enumerable&&(n[h]=o[h])}}}return n}})}(),function(){"use strict";var t="undefined"==typeof Symbol?"_pather":Symbol["for"]("pather");L.Pather.Polyline=function(t,i,n,e){this.options={color:n.pathColour,opacity:n.pathOpacity,weight:n.pathWidth,smoothFactor:n.smoothFactor||1,elbowClass:n.elbowClass},this.polyline=new L.Polyline(i,this.options).addTo(t),this.map=t,this.methods=e,this.edges=[],this.manipulating=!1,this.attachPolylineEvents(this.polyline),this.select()},L.Pather.Polyline.prototype={select:function(){this.attachElbows()},deselect:function(){this.manipulating=!1},attachElbows:function(){this.detachElbows(),this.polyline._parts[0].forEach(function(i){var n=new L.DivIcon({className:this.options.elbowClass}),e=this.map.layerPointToLatLng(i),o=new L.Marker(e,{icon:n}).addTo(this.map);o[t]={point:i},this.attachElbowEvents(o),this.edges.push(o)}.bind(this))},detachElbows:function(){this.edges.forEach(function(t){this.map.removeLayer(t)}.bind(this)),this.edges.length=0},attachPolylineEvents:function(t){t.on("click",function(t){if(t.originalEvent.stopPropagation(),t.originalEvent.preventDefault(),this.methods.mode()&L.Pather.MODE.APPEND){var i=this.map.mouseEventToLatLng(t.originalEvent);this.insertElbow(i)}else this.methods.mode()&L.Pather.MODE.DELETE&&this.methods.remove(this)}.bind(this))},attachElbowEvents:function(t){t.on("mousedown",function(i){i=i.originalEvent||i,this.methods.mode()&L.Pather.MODE.EDIT&&(i.stopPropagation&&(i.stopPropagation(),i.preventDefault()),this.manipulating=t)}.bind(this)),t.on("mouseup",function(t){t=t.originalEvent||t,t.stopPropagation&&(t.stopPropagation(),t.preventDefault()),this.manipulating=!1}),t._icon.addEventListener("touchstart",t.fire.bind(t,"mousedown")),t._icon.addEventListener("touchend",t.fire.bind(t,"mouseup"))},insertElbow:function(t){var i=this.map.latLngToLayerPoint(t),n=1/0,e=-1,o=this.polyline._parts[0];o.forEach(function(t,s){var a=o[s+1]||o[0],r=L.LineUtil.pointToSegmentDistance(i,t,a);n>r&&(n=r,e=s)}.bind(this)),o.splice(e+1,0,i);var s=o.map(function(t){var i=this.map.layerPointToLatLng(t);return{_latlng:i}}.bind(this));this.redraw(s),this.attachElbows()},moveTo:function(t){var i=this.map.layerPointToLatLng(t);this.manipulating.setLatLng(i),this.redraw(this.edges)},finished:function(){this.methods.fire("edited",{polyline:this,latLngs:this.getLatLngs()})},redraw:function(t){var i=[],n={};t.forEach(function(t){i.push(t._latlng)}),Object.keys(this.options).forEach(function(t){n[t]=this.options[t]}.bind(this)),n.smoothFactor=0,this.softRemove(!1),this.polyline=new L.Polyline(i,n).addTo(this.map),this.attachPolylineEvents(this.polyline)},softRemove:function(t){t="undefined"==typeof t?!0:t,this.map.removeLayer(this.polyline),t&&this.edges.forEach(function(t){this.map.removeLayer(t)}.bind(this))},getLatLngs:function(){return this.polyline._parts[0].map(function(t){return this.map.containerPointToLatLng(t)}.bind(this))}}}();