function exercice1() {
	// on crée un tableau "sirops"
		var sirops = ["Grenadine", "Violette", "Menthe", "Pêche", "Mangue"];
	
	// on retire sa dernière valeur
		var popped = sirops.pop();
				
	// on ajoute la dernière valeur du tableau au début du tableau
		var unshifted = sirops.unshift(popped);
		
	// on place le résultat dans le paragraphe d'identifiant "exercice1Resultat"
		document.getElementById("exercice1Resultat").innerHTML = sirops;
		}


function exercice2() {
	// on récupère la valeur du champs de texte
		var text2 = document.getElementById("texteExercice2").value;
	
	// on remplace tous les signes de ponctuation et les espaces par un espace
		text2 = text2.replace(/[.,!,:,\"\']/g," "); 	
		
	// on remplace toutes les séquences de 1 ou plusieurs espaces par un espace
		text2 = text2.replace(/[ ]+/g," ");
	
	// on segmente le texte en coupant à chaque espace
		var mots2 = text2.split(" ");
			
	// on met chaque mot en majuscules
		var majuscule2 = text2.toUpperCase();
			
	// on place le résultat dans le paragraphe d'identifiant "exercice2Resultat"
		document.getElementById("exercice2Resultat").innerHTML = majuscule2;
		}


function exercice3() {
	// on récupère la valeur du champs de texte
		var text3a = document.getElementById("texteExercice3").value;
	
	// on remplace tous les signes de ponctuation et les espaces par un espace
		text3b = text3a.replace(/[.,!,:,\"\']/g," "); 	

	// on remplace toutes les séquences de 1 ou plusieurs espaces par un espace
		text3c = text3b.replace(/[ ]+/g," ");	
	
	// on segmente le texte en coupant à chaque espace
		var mots3a = text3c.split(" ");

	// on retire les mots qui ont une taille de 3 ou moins...
	
	// mots3b ne conserve que les mots qui sont strictement supérieurs à 3
		const mots3b = mots3a.filter(word => word.length > 3);		
	
	// on place mots3b dans le paragraphe d'identifiant "exercice3Resultat"
	document.getElementById("exercice3Resultat").innerHTML = mots3b;
		}


function exercice4() {
	// on récupère la valeur du champs de texte
		var text4a = document.getElementById("texteExercice4").value;
	
	// on remplace tous les signes de ponctuation et les espaces par un espace
		text4b = text4a.replace(/[.,!,:,\"\']/g," "); 	

	// on remplace toutes les séquences de 1 ou plusieurs espaces par un espace
		text4c = text4b.replace(/[ ]+/g," ");	
	
	// on segmente le texte en coupant à chaque espace
		text4d = text4c.split(" ");
		
	// on crée une chaîne de caractères vide
		var resultat4 = "";

	// on ajoute/concatène chaque élément de texte4d à la chaîne resultat4 (en ajoutant un espace avant à chaque fois)
		text4d.forEach(item => resultat4 = resultat4.concat(" ",item));
		
	// on crée un élément paragraphe
		const para4 = document.createElement("p");
		
	// 	on crée un noeud dans lequel on place la chaîne de caractères vide
		const noeud4 = document.createTextNode(resultat4);
		
	// 	on place le paragraphe para4 dans le TestNode noeud4
		para4.appendChild(noeud4);
	
	// on place le résultat dans le paragraphe d'identifiant "exercice4Resultat"
		document.getElementById("exercice4Resultat").appendChild(para4);
		}