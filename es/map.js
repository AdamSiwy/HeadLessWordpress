var map;
let infowindow;

let eventMarker = `assets/eventicon.png`;
let newsMarker = `assets/topnewsicon.png`;
let jobMarker = `assets/jobicon.png`;

function togglefilter(filter,Marker) {
	const blankicon = `<img src="assets/iconfilter.png" alt="Filter Deaktiviert" />`;
	if(filter.lastElementChild.innerHTML.includes("Deaktiviert")) {
		filter.lastElementChild.innerHTML =  `<img src="${Marker}" alt="Filter Aktiv" />`;
		markerfilter.forEach(mark => {
			if (mark.icon==Marker) {
				mark.setVisible(true);
			}
			
		});
	}
	else {
		filter.lastElementChild.innerHTML = blankicon;
		markerfilter.forEach(mark => {
			if (mark.icon==Marker) {
				mark.setVisible(false);
			}
		});
	}
}

let filterlist = [0,1,2,3];

document.getElementsByClassName("button-filter")[filterlist[0]].addEventListener("click", function() { 
	togglefilter(this,newsMarker);

});

document.getElementsByClassName("button-filter")[filterlist[1]].addEventListener("click", function() { 
	togglefilter(this,eventMarker);

});

document.getElementsByClassName("button-filter")[filterlist[2]].addEventListener("click", function() { 
	togglefilter(this,jobMarker);
});

document.getElementsByClassName("button-filter")[filterlist[3]].addEventListener("click", function() { 
	// togglefilter(this,jobMarker);
	userlocation();

});

function initMap() {
	map = new google.maps.Map(document.getElementById("mapdiv"), {
		center: {lat: 50.112429140916895, lng: 8.658040574234301},
		zoom: 11,
		disableDefaultUI: true,
		gestureHandling: "cooperative",

		styles: [
			{elementType: "geometry", stylers: [{color: "#F77723"}]},
			{elementType: "labels.text.stroke", stylers: [{color: "#aaaaaa"}]},
			{elementType: "labels.text.fill", stylers: [{color: "#444444"}]},
			{
				featureType: "administrative.locality",
				elementType: "labels.text.fill",
				stylers: [{color: "#444444"}]
			},
			{
				featureType: "poi",
				elementType: "labels.text.fill",
				stylers: [{color: "#444444"}]
			},
			{
				featureType: "poi.park",
				elementType: "geometry",
				stylers: [{color: "#F77723"}]
			},
			{
				featureType: "poi.park",
				elementType: "labels.text.fill",
				stylers: [{color: "#aaaaaa"}]
			},
			{
				featureType: "road",
				elementType: "geometry",
				stylers: [{color: "#eeeeee"}]
			},
			{
				featureType: "road",
				elementType: "geometry.stroke",
				stylers: [{color: "#aaaaaa"}]
			},
			{
				featureType: "road",
				elementType: "labels.text.fill",
				stylers: [{color: "#9ca5b3"}]
			},
			{
				featureType: "road.highway",
				elementType: "geometry",
				stylers: [{color: "#aaaaaa"}]
			},
			{
				featureType: "road.highway",
				elementType: "geometry.stroke",
				stylers: [{color: "#666666"}]
			},
			{
				featureType: "road.highway",
				elementType: "labels.text.fill",
				stylers: [{color: "#f3d19c"}]
			},
			{
				featureType: "transit",
				elementType: "geometry",
				stylers: [{color: "#F77723"}]
			},
			{
				featureType: "transit.station",
				elementType: "labels.text.fill",
				stylers: [{color: "#d59563"}]
			},
			{
				featureType: "water",
				elementType: "geometry",
				stylers: [{color: "#F77755"}]
			},
			{
				featureType: "water",
				elementType: "labels.text.fill",
				stylers: [{color: "#515c6d"}]
			},
			{
				featureType: "water",
				elementType: "labels.text.stroke",
				stylers: [{color: "#17263c"}]
			}
		]

	});

	// infowindow = new google.maps.InfoWindow({
	//   content: '<div>abc</div>'
	// });

}

let categoryMarker = (element) => {

	if(element!=null) {
		return eventMarker;
	}
	else {
		return newsMarker;
	}
}

let shadow = (item,trigger) => {
	let triggervar;
	if(trigger=="show") {
		triggervar = ["#efefef","1px 0px 80px"];
	}
	else {
		triggervar = ["white","none"];
	}
	if(document.getElementById(item)) {
		document.getElementById(item).parentElement.style.backgroundColor = triggervar[0];
		document.getElementById(item).parentElement.style.boxShadow = triggervar[1];
			
	}
};


let markers = (element) => {
	let latlong = element.acf.gpstolocation.split(",");
	

	let marker = new google.maps.Marker({
		position: {lat: parseFloat( latlong[0] ), lng: parseFloat( latlong[1] )},
		map: map,
		title: element.title.rendered,
		icon: categoryMarker(element.acf.eventdatum),
		animation: google.maps.Animation.DROP,
	});

	markerfilter.push(marker);
	
	marker.addListener("mouseover", function() { shadow(element.featured_media,"show"); } );
	marker.addListener("mouseout", function() { shadow(element.featured_media,"hide");	} );

	infowindow = new google.maps.InfoWindow({
		content: "<div>" + element.title.rendered + "</div>"
	});

	marker.addListener("click", function() {
		let showDatum =  (element) => {
			// console.log(element);
			if (element!=undefined) {
				let htmlEventInfo = "<p>Event am: "+ element +"</p>";
				return htmlEventInfo;
			}
			else return "";
		};

		let infoDatum = showDatum(element.acf.eventdatum);
		infowindow.setContent("<div style=\"max-width:200px; height:200px;\"><div><h3>" + element.title.rendered + "<h3></div>" + infoDatum + "<a href=\"" + element.link + "\" class=\"btn-primary\">Artikel lesen</a></div>");
		infowindow.open(map, marker);
	});
}

let markerfilter =[];
let geopins = fetch( "https://make-rhein-main.de/wp-json/wp/v2/posts/?per_page=20")
	.then( json => json.json() )
	.then(posts => posts.forEach(item =>{
		if(item.acf.gpstolocation!= null) {
			markers(item);
		}
	}));

	// GeoPosition des Benutzers

let userlocation = () => {	
	navigator.geolocation.getCurrentPosition(
		function(position){
			// console.log(position.coords.latitude);
			// console.log(position.coords.longitude);
			// console.log(position.coords.altitude+'m');
			// console.log(position.coords.accuracy+'m');

			if (position.coords.accuracy<1000) {
				let marker = new google.maps.Marker({
					position: {lat: parseFloat( position.coords.latitude ), lng: parseFloat( position.coords.longitude )},
					map: map,
					title: "Standort",
					icon: "assets/locationuser.png",
					animation: google.maps.Animation.DROP,
				});
			}
			else {
				console.log("Standort leider zu ungenau > 1.000m ...")
			}

		},
		function(){
		// wenn Positionsbestimmung einen Fehler erzeugt hat (z.B. weil Sie vom User ablehnt wurde).
		console.log('Die Position konnte nicht ermittelt werden');
		}


		)


}