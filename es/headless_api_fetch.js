const url = "https://make-rhein-main.de/wp-json";
const articleContainer = document.querySelector("main#main");
let listPosts = {};
let	listCategories = {};
let	listTeaser = {};
let	numberofposts = 6;
let storedarticles = {};
let htmlEventInfo;

const head = ([x]) => x;

let col = 1;
let row = 1;

listCategories.init = function () {
	fetch(url + "/wp/v2/categories")
		.then(res => res.json())
		.then(res => res.forEach(element => {
			let render = "<a class=\"dropdown-item\" href=\"" + element.link + "\">" + element.name + "</a>";
			document.getElementsByClassName("dropdown-menu")[0].insertAdjacentHTML("beforeend", render);
		})
		).catch(function (err) {
			console.log("Error: ", err);
		});
};

let getTeaserSrc = async gid => {
	return Promise.resolve(gid => {
		fetch(url + "/wp/v2/media/" + gid)
			.then(res => res.json())
			.then(res => { res.media_details.sizes.medium.source_url; });
	});
};

let getTeaserImage = (gid) => {
	return fetch(url + "/wp/v2/media/" + gid)
		.then(res => res.json())
		.then(res => res.media_details.sizes.medium.source_url)
		.catch(error => console.error('Error:', error));
	};

const getListPosts = total => {
	fetch(url + "/wp/v2/posts/?per_page=" + total)
		.then(res => res.json())
		.then(res => res.forEach(element => {
			let postsElement = "teaser-" + row;

			document.getElementById(postsElement).innerHTML = "";
			htmlEventInfo = "";

			if (element.categories.includes(6)) {
				htmlEventInfo = "<a class=\"btn-event\">" + element.acf.eventdatum + "</a>";
			}
			let htmlInput = `<div id="${element.featured_media}" class="card-body">
  <h4 class="card-title">${element.title.rendered}</h4>
  <div class="card-text">${element.excerpt.rendered}</div>
  <a href="${element.link}" class="btn btn-primary">Artikel lesen</a>
  ${htmlEventInfo}</div>`;
			document.getElementById(postsElement).insertAdjacentHTML("afterbegin", htmlInput);
			getTeaserImage(element.featured_media)
				.then(src => {
					document.getElementById(element.featured_media).insertAdjacentHTML("beforebegin", "<a href=\"" + element.link + "\"><img class=\"card-img-top\" src=\"" + src + "\" alt=\"zum Artikel: " + element.title.rendered + "\" /></a>");
				});
			row += 1;
		})
		).catch(function (err) {
			console.log("Error: ", err);
		});
};

getListPosts(numberofposts);