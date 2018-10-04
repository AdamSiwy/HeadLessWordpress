const url = 'https://make-rhein-main.de/wp-json',
			articleContainer = document.querySelector('main#main');
let listPosts = {};
let listCategories = {};
let listTeaser = {};

let numberofposts = 6;

let storedarticles = {};

const head = ([x]) => x;

let col = 1;
let row = 1;


// Fetch Categories from REST an insert into DOM
// AS 24.9.2018

listCategories.init = function() {
fetch( url + '/wp/v2/categories')
	.then(res => res.json())
	.then(res => res.forEach(element => {
		let render = '<a class="dropdown-item" href="' + element.link + '">' + element.name + '</a>';
		document.getElementsByClassName('dropdown-menu')[0].insertAdjacentHTML('beforeend', render);
		})
	).catch(function(err) {
		console.log('Error: ', err);
	});

}
//listCategories.init();

let getTeaserSrc = async gid => {
	return await Promise.resolve( gid => {
		fetch( url + '/wp/v2/media/' + gid )
		.then( res => res.json() )
		.then( res =>  { res.media_details.sizes.medium.source_url } )
	})
	};

let getTeaserImage = (gid) => {
	   return fetch( url + '/wp/v2/media/' + gid )
		.then( res => res.json() )
		.then( res => res.media_details.sizes.medium.source_url )
	};

const getListPosts = total => {
	fetch( url + '/wp/v2/posts/?per_page=' + total )
	.then( res => res.json() )
	.then( res => res.forEach(element => {
		let postsElement = 'teaser-'+row;

				document.getElementById(postsElement).innerHTML = '';
				let htmlInput = '<div id="' + element.featured_media + '" class="card-body"><h4 class="card-title">' + element.title.rendered + '</h4><p class="card-text">' + element.excerpt.rendered + '</p><a href="' + element.link + '" class="btn btn-primary">Artikel lesen</a></div>';
				document.getElementById(postsElement).insertAdjacentHTML('afterbegin', htmlInput );
				getTeaserImage(element.featured_media)
				.then( src => { 
					document.getElementById(element.featured_media).insertAdjacentHTML('beforebegin', '<img class="card-img-top" src="' + src + '" />') 
				});
				
		row+=1;

		})
	).catch(function(err) {
		console.log('Error: ', err);
	}); 
}

getListPosts(numberofposts);

/* let geopins = fetch( url +'/wp/v2/posts/?per_page=20')
				.then( json => json.json() )
				.then(posts => posts.forEach(item =>{
					 console.log(item.acf.gpstolocation);
				}));

geopins.then(pin => console.log(pin)); */
