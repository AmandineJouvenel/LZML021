// exercice 1
function prenom() {
    // on récupère le prénom on le met dans l'élément avec id holder1
    // compléter le code ici 
    let pren = document.getElementById("prenom").value;
    document.getElementById("holder1").innerHTML = pren;
}

function nomdefamille() {
    // on récupère le nom on le met dans l'élément avec id holder1
    // compléter le code ici
    let nom = document.getElementById("nomdefamille").value;
    document.getElementById("holder1").innerHTML = nom;
}

function nomcomplet() {
    // on concatène prénom et nom pour afficher le nom entier et on met le résultat dans l'élément avec id holder1
    // compléter le code ici
    let pren = document.getElementById("prenom").value;
    let nom = document.getElementById("nomdefamille").value;
    let prenom_nom = pren.concat(" ", nom);
    document.getElementById("holder1").innerHTML = prenom_nom;
}


// exercice 2
function segmentText() {
    // on récupère le texte de l'élément d'id texte, on le découpe et on le place dans l'élément avec id holder2
    // compléter le code ici
    let text = document.getElementById("texte").value;
    text = text.replace(/[.,\"]/g,"");
    text = text.replace(/\'/g," ");
    const mots = text.split(" ");
    document.getElementById("holder2").innerHTML = mots;
}
