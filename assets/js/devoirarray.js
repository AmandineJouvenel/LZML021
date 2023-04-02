function exercice1() {
	let fruits = ["Apple", "Banana", "Watermelon", "Pineapple"];
	let suppr_last = fruits.pop();
	let add_first = fruits.unshift(suppr_last);	
	document.getElementById("exercice1Resultat").innerHTML = fruits;
	}

function exercice2() {
	let text = document.getElementById("texteExercice2").value;
  	text = text.replace(/[.,\"]/g,"");
 	text = text.replace(/\'/g," ");
  	let mots = text.split(" ");
  	for (let i = 0; i < mots.length; i++) {
    	mots[i] = mots[i].toUpperCase();
  	}
 	let maj = mots.join(" ");
 	document.getElementById("exercice2Resultat").innerHTML = maj;
}

function exercice3() {
	let text = document.getElementById("texteExercice3").value;
	text = text.replace(/[.,\"]/g,"");
    text = text.replace(/\'/g," ");
	let mots = text.split(" ");
	let mots_filtre = mots.filter(mot => mot.length > 3);
	let result = mots_filtre.join(" ");
	document.getElementById("exercice3Resultat").innerHTML = result;
}

// Version ex4 avec résultat sous forme de tableau
function exercice4() {			
	let text = document.getElementById("texteExercice4").value;
	text = text.replace(/[.,\"]/g,"");
    text = text.replace(/\'/g," ");
	let mots = text.split(" ");
	let tableau = document.createElement("table");
	tableau.style.borderCollapse = "collapse";
	tableau.style.width = "100%";
	let tbody = document.createElement("tbody");
	tableau.appendChild(tbody);
	mots.forEach(function(mot) {
		let tr = document.createElement("tr");
		let td = document.createElement("td");
  		let motNode = document.createTextNode(mot);
  		td.style.border = "1px solid #ddd";
  		td.style.padding = "8px";
  		td.style.textAlign = "left";
  		td.appendChild(motNode);
  		tr.appendChild(td);
  		tbody.appendChild(tr);
	});
	let resultat = document.getElementById("exercice4Resultat");
	resultat.appendChild(tableau);
}

/* Autre version ex4 (résultat sous forme de ligne) :

function exercice4() {
	let text = document.getElementById("texteExercice4").value;
	text = text.replace(/[.,\"]/g,"");
    text = text.replace(/\'/g," ");
	let mots = text.split(" ");
	const tableau = [];
	mots.forEach(function(mot) {
		tableau.push(mot);
	});
	document.getElementById("exercice4Resultat").innerHTML = tableau;
}

*/