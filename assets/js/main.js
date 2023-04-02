
function date_heure() {
	let now = new Date();
	let annee = now.getFullYear();
	let mois = ('0'+now.getMonth()+1).slice(-2);
	let jour = ('0'+now.getDate()).slice(-2);
	let heure = ('0'+now.getHours()).slice(-2);
	let minute = ('0'+now.getMinutes()).slice(-2);
	let seconde = ('0'+now.getSeconds()).slice(-2);
 	document.getElementById("holder1").innerHTML = "Nous sommes le "+jour+"/"+mois+"/"+annee+" et il est "+heure+"h "+minute+"min "+seconde+"s.";
 	document.getElementById("btn2").style.display= "inline";
 }

function maj() {
	let text = document.getElementById("holder1").innerHTML;
	document.getElementById("holder1").innerHTML = text.toUpperCase();
}

//----------------------OUTIL D'ANALYSE des données dans un fichier-------------------------------

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
                segText();
                let nbTokens = global_var_tokens.length;
                document.getElementById("logger2").innerHTML = '<span class="infolog">Nombre de tokens : ' + nbTokens + ' </span>';
            }

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);

            document.getElementById("logger1").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            document.getElementById("logger1").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
}

function showHide_aide() {
	let div = document.getElementById("aide");
	let b = document.getElementById("button_aide").innerHTML;
  		if (div.style.display === "none") {
   			div.style.display = "block";
	  		let change = b.replace("Afficher","Masquer");
	  		document.getElementById("button_aide").innerHTML = change;
	  		}
		else {
			div.style.display = "none";
			var change = b.replace("Masquer","Afficher");
	    	document.getElementById("button_aide").innerHTML = change;
	    	}
}

// VERSION PROF segText() ------------------------------------------------------------------------

function segText() {
    let text = document.getElementById("fileDisplayArea").innerText;
    let delim = document.getElementById("delimID").value;
    let display = document.getElementById("page-analysis");

    let regex_delim = new RegExp(
        "["
        + delim
            .replace("-", "\\-") // le tiret n'est pas à la fin : il faut l'échapper, sinon erreur sur l'expression régulière
            .replace("[", "\\[").replace("]", "\\]") // à changer sinon regex fautive, exemple : [()[]{}] doit être [()\[\]{}], on doit "échapper" les crochets, sinon on a un symbole ] qui arrive trop tôt.
        + "\\s" // on ajoute tous les symboles d'espacement (retour à la ligne, etc)
        + "]+" // on ajoute le + au cas où plusieurs délimiteurs sont présents : évite les tokens vides
    );

    let tokens = text.split(regex_delim);
    tokens = tokens.filter(x => x.trim() != ""); // on s'assure de ne garder que des tokens "non vides"

    global_var_tokens = tokens; // décommenter pour vérifier l'état des tokens dans la console développeurs sur le navigateur
    display.innerHTML = tokens.join(" ");
}
//----------------------------------------------------------------------------


/* MA VERSION segText() -------------------------------------------------------
function segText() {
	let texte = document.getElementById("fileDisplayArea").innerHTML; // ou textContent pour retirer les balises inutiles mais dans ce cas pb avec retours chariot qui ne sont pas remplacés par des espaces
	let delim = document.getElementById("delimID").value;
	let speCar = /[\[\]\-\^\(\)\|\\\.\$\?\*\+\{\}\>\<]/g;
	let delimEsc = delim.replace(speCar, '\\$&');
	let regex = new RegExp("[" + delimEsc + "\\s" + "]", "g");
	let segments = texte.split(regex);
	let result = segments.join(" ");
	document.getElementById("page-analysis").innerHTML = result;
}
*/

/* Ma version 2 segText()
//ne fonctionne pas pour remplacer les retours à la ligne par des espaces
function segText() {
	let texte = document.getElementById("fileDisplayArea").textContent;
	let delim = document.getElementById("delimID").value;
	let speCar = /[\[\]\-\^\(\)\|\\\.\$\?\*\+\{\}\>\<]/g;
	let delimEsc = delim.replace(speCar, '\\$&');
	let regex = new RegExp("[" + delimEsc + "]", "g");
	let segments = texte.split(regex);
	let result = segments.join(" ");
	document.getElementById("page-analysis").innerHTML = result.replace(/(?:\r\n|\r|\n)/gm, " "); // pourtant la regex prend en compte les sauts de lignes ??
}
----------------------------------------------------------------------------------*/

function dictionnaire() {
  let tokenFreq = {};
  let tokens = global_var_tokens;
  
  // Compter la fréquence de chaque token
  tokens.forEach(token => tokenFreq[token] = (tokenFreq[token] || 0) + 1);
  
  // Convertir l'objet en tableau de paires clé-valeur
  let freqPairs = Object.entries(tokenFreq);
  
  // Trier le tableau par fréquence décroissante
  freqPairs.sort((a, b) => b[1] - a[1]);
  
  // Ajouter l'entête du tableau
  let tableArr = [['<b>Token</b>', '<b>Fréquence</b>']];
  
  // Créer un tableau de tableaux contenant les tokens et leurs fréquences
  let tableData = freqPairs.map(pair => [pair[0], pair[1]]);
  
  // Concaténer les deux tableaux
  let finalTable = tableArr.concat(tableData);
  
  // Créer le tableau HTML à partir du tableau final
  let tableHtml = finalTable.map(row => '<tr><td>' + row.join('</td><td>') + '</td></tr>').join('');
  
  // Afficher le tableau HTML dans la page
  document.getElementById('page-analysis').innerHTML = '<table>' + tableHtml + '</table>';
}