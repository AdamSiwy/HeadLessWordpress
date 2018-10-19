var map;
let infowindow;

function initMap() {
	map = new google.maps.Map(document.getElementById("mapdiv"), {
		center: {lat: 50.112429140916895, lng: 8.658040574234301},
		zoom: 11,
		disableDefaultUI: true,
		gestureHandling: "cooperative",

		styles: [
			{elementType: "geometry", stylers: [{color: "#242f3e"}]},
			{elementType: "labels.text.stroke", stylers: [{color: "#242f3e"}]},
			{elementType: "labels.text.fill", stylers: [{color: "#746855"}]},
			{
				featureType: "administrative.locality",
				elementType: "labels.text.fill",
				stylers: [{color: "#d59563"}]
			},
			{
				featureType: "poi",
				elementType: "labels.text.fill",
				stylers: [{color: "#d59563"}]
			},
			{
				featureType: "poi.park",
				elementType: "geometry",
				stylers: [{color: "#263c3f"}]
			},
			{
				featureType: "poi.park",
				elementType: "labels.text.fill",
				stylers: [{color: "#6b9a76"}]
			},
			{
				featureType: "road",
				elementType: "geometry",
				stylers: [{color: "#38414e"}]
			},
			{
				featureType: "road",
				elementType: "geometry.stroke",
				stylers: [{color: "#212a37"}]
			},
			{
				featureType: "road",
				elementType: "labels.text.fill",
				stylers: [{color: "#9ca5b3"}]
			},
			{
				featureType: "road.highway",
				elementType: "geometry",
				stylers: [{color: "#746855"}]
			},
			{
				featureType: "road.highway",
				elementType: "geometry.stroke",
				stylers: [{color: "#1f2835"}]
			},
			{
				featureType: "road.highway",
				elementType: "labels.text.fill",
				stylers: [{color: "#f3d19c"}]
			},
			{
				featureType: "transit",
				elementType: "geometry",
				stylers: [{color: "#2f3948"}]
			},
			{
				featureType: "transit.station",
				elementType: "labels.text.fill",
				stylers: [{color: "#d59563"}]
			},
			{
				featureType: "water",
				elementType: "geometry",
				stylers: [{color: "#17263c"}]
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


let geopins = fetch( "https://make-rhein-main.de/wp-json/wp/v2/posts/?per_page=20")
	.then( json => json.json() )
	.then(posts => posts.forEach(item =>{
		if(item.acf.gpstolocation!= null) {
			let latlong = item.acf.gpstolocation.split(",");

			let marker = new google.maps.Marker({
				position: {lat: parseFloat( latlong[0] ), lng: parseFloat( latlong[1] )},
				map: map,
				title: item.title.rendered,
				icon: "https://png.icons8.com/color/50/000000/marker.png",
				animation: google.maps.Animation.DROP,
			});

			infowindow = new google.maps.InfoWindow({
				content: "<div>" + item.title.rendered + "</div>"
			});

			marker.addListener("click", function() {
				//  alert(item.title.rendered);

				let showDatum =  (element) => {
					// console.log(element);
					if (element!=undefined) {
						let htmlEventInfo = "<p>Event am: "+ element +"</p>";
						return htmlEventInfo;
					}
					else return "";
				};

				let infoDatum = showDatum(item.acf.eventdatum);
				infowindow.setContent("<div style=\"max-width:200px; height:200px;\"><div><h3>" + item.title.rendered + "<h3></div>" + infoDatum + "<a href=\"" + item.link + "\" class=\"btn-primary\">Artikel lesen</a></div>");
				infowindow.open(map, marker);

              
			});

			marker.addListener("mouseover", function() {
				if(document.getElementById(item.featured_media)) {
					document.getElementById(item.featured_media).parentElement.style.backgroundColor = "#efefef";
					document.getElementById(item.featured_media).parentElement.style.boxShadow = "1px 0px 80px";
                  
				}
			});

			marker.addListener("mouseout", function() {
				if(document.getElementById(item.featured_media)) {
					document.getElementById(item.featured_media).parentElement.style.backgroundColor = "white";
					document.getElementById(item.featured_media).parentElement.style.boxShadow = "none";
				}
			});


		}
	}));