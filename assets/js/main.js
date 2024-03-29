let text_tokens = [];
let text_lines = [];


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Lecture du fichier texte

window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

    // On "écoute" si le fichier donné a été modifié.
    // Si on a donné un nouveau fichier, on essaie de le lire.
    fileInput.addEventListener('change', function(e) {
        // Dans le HTML (ligne 22), fileInput est un élément de tag "input" avec un attribut type="file".
        // On peut récupérer les fichiers données avec le champs ".files" au niveau du javascript.
        // On peut potentiellement donner plusieurs fichiers,
        // mais ici on n'en lit qu'un seul, le premier, donc indice 0.
        let file = fileInput.files[0];
        // on utilise cette expression régulière pour vérifier qu'on a bien un fichier texte.
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { // on vérifie qu'on a bien un fichier texte
            // lecture du fichier. D'abord, on crée un objet qui sait lire un fichier.
            var reader = new FileReader();

            // on dit au lecteur de fichier de placer le résultat de la lecture
            // dans la zone d'affichage du texte.
            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
                segmentation();

                if (text_tokens.length != 0) {
                    document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès, ' + text_tokens.length + ' tokens dans le texte et ' + text_lines.length + ' lignes non vides.</span>';
                }
            }

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            text_tokens = [];
            text_lines = [];
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Proposer un exemple de texte

function poeme(){
	var poeme = 'Jabberwocky<br /><br />';
	poeme+="'Twas brillig, and the slithy toves<br />Did gyre and gimble in the wabe<br />All mimsy were the borogoves,<br />And the mome raths outgrabe.<br /><br />";
	poeme+='Beware the Jabberwock, my son<br />The jaws that bite, the claws that catch!<br />Beware the Jubjub bird, and shun<br />The frumious Bandersnatch!<br /><br />';
	poeme+='He took his vorpal sword in hand;<br />Long time the manxome foe he sought—<br />So rested he by the Tumtum tree,<br />And stood awhile in thought.<br /><br />';
	poeme+='And, as in uffish thought he stood,<br />The Jabberwock, with eyes of flame,<br />Came whiffling through the tulgey wood,<br />And burbled as it came!<br /><br />';
	poeme+='One, two! One, two! And through and through<br />The vorpal blade went snicker-snack!<br />He left it dead, and with its head<br />He went galumphing back.<br /><br />';
	poeme+='And hast thou slain the Jabberwock?<br />Come to my arms, my beamish boy!<br />O frabjous day! Callooh! Callay!<br />He chortled in his joy.<br /><br />';
	poeme+="’Twas brillig, and the slithy toves<br />Did gyre and gimble in the wabe;<br />All mimsy were the borogoves,<br />And the mome raths outgrabe.<br /><br />";
	poeme+='Lewis Carroll';
	document.getElementById('fileDisplayArea').innerHTML = poeme;
	//fileInputnonVide();
	segmentation();
}




//---------------------------------------------------------------------------------------------------------------------------------------------------
// Afficher et cacher l'aide

function afficheCacheAide() {
    let aide = document.getElementById("aide");
    let boutonAide = document.getElementById("boutonAide");
    let display = aide.style.display;
    
    if (display === "none") {
        aide.style.display = "block";
        boutonAide.innerText = "Refermer le parchemin";
    } else {
        aide.style.display = "none";
        boutonAide.innerText = "Demander de l'aide au Grand Sorcier";
    }
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Segmentation

function segmentation() {
    let text = document.getElementById("fileDisplayArea").innerText;
    let delim = document.getElementById("delimID").value;
    
    if (delim === "") {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Aucun délimiteur donné !</span>'
        return;
    }

    let regex_delim = new RegExp(
        "["
        + delim
            .replace("-", "\\-") // le tiret n'est pas à la fin : il faut l'échapper, sinon erreur sur l'expression régulière
            .replace("[", "\\[").replace("]", "\\]") // à changer sinon regex fautive, exemple : [()[]{}] doit être [()\[\]{}], on doit "échapper" les crochets, sinon on a un symbole ] qui arrive trop tôt.
        + "\\s" // on ajoute tous les symboles d'espacement (retour à la ligne, etc)
        + "]+" // on ajoute le + au cas où plusieurs délimiteurs sont présents : évite les tokens vides
    );

    let tokens_tmp = text.split(regex_delim);
    text_tokens = tokens_tmp.filter(x => x.trim() != ''); // on s'assure de ne garder que des tokens "non vides"
    
    text_lines = text.split(new RegExp("[\\r\\n]+")).filter(x => x.trim() != '');

    // global_var_tokens = tokens; // décommenter pour vérifier l'état des tokens dans la console développeurs sur le navigateur
    // display.innerHTML = tokens.join(" ");
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Dictionnaire

function dictionnaire() {
    let comptes = new Map();
    let display = document.getElementById("page-analysis");

    if (text_tokens.length === 0) {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    for (let token of text_tokens) {
        comptes.set(token, (comptes.get(token) ?? 0) + 1);
    }
    
    let comptes_liste = Array.from(comptes);
    comptes_liste = comptes_liste.sort(function(a, b) {
        // solution attendue
        return b[1] - a[1]; // tri numérique inversé

        /*
         * // solution alternative
         * // on trie sur les comptes en priorité
         * // puis, pour les comptes identiques, on trie sur la forme
         * let a_form = a[0];
         * let a_count = a[1];
         * let b_form = b[0];
         * let b_count = b[1];
         * let comparaison = 0;
         *
         * // utiliser +2 et -2 permet de donner plus de poids aux comptes (permet le trie du plus fréquent au moins fréquent)
         * if (a_count < b_count) {
         *     comparaison += 2;
         * } else if (a_count > b_count) {
         *     comparaison -= 2;
         * }
         * // -1 et +1 permettent d'ajuster le tri en cas de comptes égaux, mais ne peut pas inverser l'ordre pour des comptes différents
         * if (a_form < b_form) {
         *     comparaison -= 1;
         * } else if (a_form > b_form) {
         *     comparaison += 1;
         * }
         *
         * return comparaison;
         */
    });

    let tableau = document.createElement("tableau");
    tableau.style.margin = "auto";
    let entete = tableau.appendChild(document.createElement("tr"));
    entete.innerHTML = "<th>mot</th><th>compte</th>";
    
    for (let [mot, compte] of comptes_liste) {
        let ligne_mot = tableau.appendChild(document.createElement("tr"));
        let cellule_mot = ligne_mot.appendChild(document.createElement("td"));
        let cellule_compte = ligne_mot.appendChild(document.createElement("td"));
        cellule_mot.innerHTML = mot;
        cellule_compte.innerHTML = compte;
    }

    display.innerHTML = "";
    display.appendChild(tableau);
    document.getElementById("logger").innerHTML = '';
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Grep

function grep() {
    let pole = document.getElementById("poleID").value.trim();
    let display = document.getElementById("page-analysis");
    
    if (text_lines.length === 0) {
        // pas de lignes: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    if (pole === '') {
        // pas de pôle: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Le pôle n\'est pas renseigné !</span>';
        return;
    }
    let pole_regex = new RegExp('(' + pole + ')', "g");

    display.innerHTML = "";
    for (let line of text_lines) {
        if (line.search(pole_regex) != -1) {
            let paragraph = document.createElement("p");
            paragraph.innerHTML = line.replaceAll(pole_regex, '<span style="color:red; font-weight : bold;">$1</span>')
            display.appendChild(paragraph);
        }
    }
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Concordancier

function concordancier() {
    let pole = document.getElementById("poleID").value.trim();
    let display = document.getElementById("page-analysis");
	let longueur = document.getElementById('lgID').value;

    if (text_tokens.length === 0) {
        // pas de lignes: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    if (pole === '') {
        // pas de pôle: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">Le pôle n\'est pas renseigné !</span>';
        return;
    }
	
	if (longueur === '') {
        // pas de longueur: erreur
        document.getElementById("logger").innerHTML = '<span class="errorlog">La longueur n\'est pas renseignée !</span>';
        return;
    }

    let pole_regex = new RegExp("^" + pole + "$", "g");
    let tailleContexte = Number(document.getElementById('lgID').value ?? "10");

    let table = document.createElement("table");
    table.style.margin = "auto";
    let entete = table.appendChild(document.createElement("tr"));
    entete.innerHTML = "<th>contexte gauche</th><th>pôle</th><th>contexte droit</th>";

    display.innerHTML = "";
    for (let i=0; i < text_tokens.length; i++) {
        if (text_tokens[i].search(pole_regex) != -1) {
            let start = Math.max(i - tailleContexte, 0);
            let end = Math.min(i + tailleContexte, text_tokens.length);
            let lc = text_tokens.slice(start, i);
            let rc = text_tokens.slice(i+1, end+1);
            let row = document.createElement("tr");

            // manière fainéante
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = lc.join(' ');
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = text_tokens[i];
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = rc.join(' ');
            table.appendChild(row);
        }
    }

    display.innerHTML = "";
    display.appendChild(table);
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Compteur de voyelles

function voyelles() {
	
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
    return;
    }
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById("page-analysis").innerText="";
	var texte = document.getElementById("fileDisplayArea").innerText;
	
	// On sépare le texte en caractères
	texte = texte.split("");
	
	// On initialise le compteur de voyelles
	var comptVoy = 0;
	
	// On crée une expression régulière pour identifier les voyelles
	var regexVoy = /[aeiouyÃÃ¡Ã¢Ã£Ã©Ã¨ÃªÃ¬Ã­Ã®Ä©Ã²Ã³Ã´ÃµÃ¹ÃºÃ»Å©]/i;
	
	// Pour chaque caractère du texte, si il correspond à la regex, alors on incrémente la valeur 1 au compteur
	for (var i = 0; i < texte.length; i++) {
		if (texte[i].match(regexVoy)) {
			comptVoy += 1;
		}
	}
	document.getElementById("page-analysis").innerHTML = "Le texte contient "+comptVoy+" voyelles.";
}



//---------------------------------------------------------------------------------------------------------------------------------------------------
// Compteur de consonnes

function consonnes() {
	
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
    return;
    }
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById("page-analysis").innerText="";
	var texte = document.getElementById("fileDisplayArea").innerText;
	
	// On sépare le texte en caractères
	texte = texte.split("");
	
	// On initialise les compteurs de consonnes et de voyelles
	var comptCons = 0;
	
	// On crée 2 expressions régulières pour identifier les consonnes et les voyelles
	var regexCons = /[bcdfghjklmnpqrstvwxz]/i;
	
	// Pour chaque caractère du texte, si il correspond à une des 2 regex, alors on incrémente la valeur 1 au compteur correspondant
	for (var i = 0; i < texte.length; i++) {
		if (texte[i].match(regexCons)) {
			comptCons += 1;
		}
	}
	document.getElementById("page-analysis").innerHTML = "Le texte contient "+comptCons+" consonnes.";
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Mot le plus long

function motlepluslong() {
	
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
    return;
    }
		
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById('page-analysis').innerHTML ="";
	var texte = document.getElementById("fileDisplayArea").innerText;

	// on segmente le texte en mots
	var tokens = text_tokens;
	
	// on initialise une variable "max"
	var max="";
	
	// pour chaque token, si sa longueur est supérieure à la longueur de "max", alors "max" devient ce token
	for (i=0; i<tokens.length;i++) {
		if (tokens[i].length>max.length)
		{max=tokens[i]} }
	
	document.getElementById('page-analysis').innerHTML = 'Le mot le plus long est "'+max+'".';
}



//---------------------------------------------------------------------------------------------------------------------------------------------------
// Mot le plus court

function motlepluscourt() {
	
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
    return;
    }
		
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById('page-analysis').innerHTML ="";
	var texte = document.getElementById("fileDisplayArea").innerText;

	// on segmente le texte en mots
	var tokens = text_tokens;
	
	// on initialise une variable "min"
	var min = tokens[0];
	
	// pour chaque token, si sa longueur est supérieure à 0 et inférieure à la longueur de "min", alors "min" devient ce token
	for (i=0; i<tokens.length;i++) {
		if (tokens[i].length > 0) {
			if (tokens[i].length<min.length) {
				min=tokens[i]
				}
			}
		}
	
	document.getElementById('page-analysis').innerHTML = 'Le mot le plus court est "'+min+'".';
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Mise en minuscules

function minuscule() {
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
    return;
    }
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById('page-analysis').innerHTML ="";
	var texte = document.getElementById("fileDisplayArea").innerText;
	// on met le texte en minuscules avec la fonction toLowerCase et on stocke le résultat dans une variable "minuscules"
	minuscules = texte.toLowerCase();
	document.getElementById("page-analysis").innerText = minuscules;
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Mise en majuscules

function majuscule() {
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
    return;
    }
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById('page-analysis').innerHTML ="";
	var texte = document.getElementById("fileDisplayArea").innerText;
	// on met le texte en majuscules avec la fonction toUpperCase et on stocke le résultat dans une variable "minuscules"
	majuscules = texte.toUpperCase();
	document.getElementById("page-analysis").innerText = majuscules;
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Bouton chèvre

function chevre() {
	
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichiêêêh !</span>';
    return;
    }
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById("page-analysis").innerText="";
	var texte = document.getElementById("fileDisplayArea").innerText;
	
	// on sépare le texte en caractères
	var tokens = texte.split("");
	
	// on crée une regex permettant de reconnaître les variantes de e
	var regex = /[eEêèé]/gi;	
	
	// pour chaque élément du texte, si l'élément correspond à la regex, alors on le remplace par "êêê"
	for (var i = 0; i < tokens.length; i++) {
		if (tokens[i].match(regex)) {
			texte = texte.replace(tokens[i], "êêê");
		}
	}
	
	var affichage = "<img src='assets/img/gifchevre.gif' height=400px><br/>"+texte+"";
	
	document.getElementById("page-analysis").innerHTML = affichage;
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Bouton dindon

function dindon() {
	
	// Si aucun fichier n'est chargé, afficher un message d'erreur
	if (text_tokens.length === 0) {
    document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abugluglurd charger un fichier !</span>';
    return;
    }
	// on initialise l'élément d'identifiant "page-analysis" et on récupère le contenu du fichier texte
	document.getElementById("page-analysis").innerText="";
	var texte = document.getElementById("fileDisplayArea").innerText;
	
	// on sépare le texte en caractères
	var tokens = texte.split("");
	
	// on crée une regex permettant de reconnaître les variantes de e
	var regex = /[Ooô]/gi;	
	
	// pour chaque élément du texte, si l'élément correspond à la regex, alors on le remplace par "êêê"
	for (var i = 0; i < tokens.length; i++) {
		if (tokens[i].match(regex)) {
			texte = texte.replace(tokens[i], "glugluglu");
		}
	}
	
	var affichage = "<img src='assets/img/gifdindon.gif' height=300px><br/>"+texte+"";
	
	document.getElementById("page-analysis").innerHTML = affichage;
}

