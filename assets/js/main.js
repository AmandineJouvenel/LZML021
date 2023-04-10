let text_tokens = [];


window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');
    //let fileLoaded = false; // variable qui indique si un fichier a été chargé

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
                let nbTokens = global_var_tokens.length;
                let nbLines = global_var_lines.length;
                document.getElementById("logger2").innerHTML = '<span class="infolog">Nombre de tokens : ' + nbTokens + '<br>Nombre de lignes : ' + nbLines +' </span>';
                //let fileLoaded = true; // fichier chargé
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


function afficheCacheAide() {
    let aide = document.getElementById("aide");
    let boutonAide = document.getElementById("boutonAide");
    let display = aide.style.display;
    
    if (display === "none") {
        aide.style.display = "block";
        boutonAide.innerText = "Cacher l'aide";
    } else {
        aide.style.display = "none";
        boutonAide.innerText = "Afficher l'aide";
    }
}


function segmentation() {
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        //alert("Il faut d'abord charger un fichier .txt !"); //autre possibilité
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML="";
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
        let lines = text.split(/\r?\n/g);
        lines = lines.filter(line => line.trim() != "");
    
        global_var_tokens = tokens; // décommenter pour vérifier l'état des tokens dans la console développeurs sur le navigateur
        global_var_lines = lines;
        display.innerHTML = tokens.join(" ");
    }
}


function dictionnaire() {
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        document.getElementById('logger3').innerHTML="Commencez par sélectionner un fichier !";
    } else {
        document.getElementById('logger3').innerHTML="";
        let tokenFreq = {};
        let tokens = global_var_tokens;
        tokens.forEach(token => tokenFreq[token] = (tokenFreq[token] || 0) + 1);
        let freqPairs = Object.entries(tokenFreq);
        freqPairs.sort((a, b) => b[1] - a[1]);
        let tableArr = [['<b>Token</b>', '<b>Fréquence</b>']];
        let tableData = freqPairs.map(pair => [pair[0], pair[1]]);
        let finalTable = tableArr.concat(tableData);
        let tableHtml = finalTable.map(row => '<tr><td>' + row.join('</td><td>') + '</td></tr>').join('');
        document.getElementById('page-analysis').innerHTML = '<table>' + tableHtml + '</table>';
    }
}



function grep(){
	// Si aucun fichier n'est chargé, afficher un message d'erreur
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        document.getElementById('logger3').innerHTML="Commencez par sélectionner un fichier !";
	// Sinon (si un fichier est chargé) :
    } else {
		// Si aucun pôle n'est entré, afficher un message d'erreur
        if (document.getElementById('poleID').value==""){
        document.getElementById('logger3').innerHTML="Entrez un pôle !";
		// Sinon :
        } else {
            document.getElementById('logger3').innerHTML="";
			// On attribue à la variable poleInput la valeur de l'élément d'identifiant "poleID"
            let poleInput = document.getElementById('poleID').value;
			// On crée une nouvelle expression régulière à partir de la variable poleInput
            let poleRegex = new RegExp(poleInput, 'g');
			// On crée une chaîne de caractères vide qu'on appelle "recherche", qui correspondra au résultat de la recherche
            let recherche = "";
			// Pour chaque ligne : 
            for (let nblines = 0, compteur = 0; nblines < global_var_lines.length; nblines++) {
			// Si la ligne correspond à la recherche, on l'ajoute dans la variable "recherche", avec son numéro d'occurrence dans le texte (avec le compteur)
                if (global_var_lines[nblines].match(poleRegex)) {
                    compteur++;
                    recherche += "<tr><td>" + compteur + "</td><td>" + global_var_lines[nblines].replace(poleRegex, "<font color='red'>$&</font>") + "</td></tr>";
                }
            }
			// On affiche le résultat dans l'élément d'identifiant "page-analysis"
            document.getElementById('page-analysis').innerHTML = "<table>" + recherche + "</table>";
        }
    }
}