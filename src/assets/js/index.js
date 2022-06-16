
// Fetch des définitions
async function search_word(e) {
    e.preventDefault();
    const mot = document.getElementById("mot").value;

    document.getElementById("titre").classList.add("display-none");
    document.getElementById("description").classList.add("display-none");
    document.getElementById("ask-drkzikus").classList.add("display-none");
    document.getElementById("contenu").classList.add("display-none");
    document.getElementById("chargement").classList.remove("display-none");


    // Avoir les définitions
    const defs = fetch('https://lewikiracloir.enthousiasme.io/api/mot/' + encodeURI(mot))
    // Tendances mots précédents en général
    const infos_b = fetch('https://api.datamuse.com/words?rel_bgb=' + encodeURI(mot));
    // Tendances mot suivants en général
    const infos_a = fetch('https://api.datamuse.com/words?rel_bga=' + encodeURI(mot))

    // Envoyer toutes les requêtes en même temps
    const responses = await Promise.all([defs, infos_a, infos_b]);

    // Traitement des réponses
    const results = await Promise.all(responses.map(resp => resp.json()));


    format_defs(results[0]);
    format_infos(results[1], results[2]);


    document.getElementById("contenu").classList.remove("display-none");
    document.getElementById("chargement").classList.add("display-none");
    document.getElementById("ask-drkzikus").classList.remove("display-none");
}

// Traitement des infos de l'api LeWikiRacloir
function format_defs(defs) {
    const contenu = document.getElementById("contenu");

    if (!defs || defs.status === 404) {
        document.querySelector('.definitions').innerHTML = '';
        contenu.querySelector("img").src = ''
        contenu.querySelector("h2").innerText
        return contenu.querySelector("h4").innerText = 'Le mot n\'existe pas dans le dictionnaire.';
    }


    if (defs.imgs) contenu.querySelector("img").src = 'https://' + defs.imgs[0];
    else contenu.querySelector("img").src = ''

    contenu.querySelector("h2").innerText = defs.mot.toUpperCase();

    const definitions = document.querySelector('.definitions');
    definitions.innerHTML = '';
    if (defs.langs && defs.langs[0] == 'Français') {

        for (const [key, value] of Object.entries(defs['Français'])) {
            let typeTitle = document.createElement('h3');
            typeTitle.innerText = key;
            definitions.appendChild(typeTitle);
            let typeListe = document.createElement('ol');

            value.forEach(def => {
                if (def.def) {
                    let defLi = document.createElement('li');
                    defLi.innerText = def.def;
                    typeListe.append(defLi);
                } else {
                    typeListe.append(def);
                }
            });

            definitions.appendChild(typeListe);
        }
    } else {
        definitions.innerHTML = "";
    }


}

function format_infos(infos_b, infos_a) {
    const contenu = document.getElementById("contenu");
    const domInfos_a = contenu.querySelector('.mots-suivants');
    const domInfos_b = contenu.querySelector('.mots-precedents');
    domInfos_a.innerHTML = '';
    domInfos_b.innerHTML = '';

    if (infos_a) {
        for (let i = 0; i < infos_a.length && i < 3; ++i) {
            let el = document.createElement('li');
            el.innerText = infos_a[i].word;
            domInfos_a.appendChild(el);
        }
    } else {
        let el = document.createElement('li');
        el.innerText = '---';
        domInfos_a.appendChild(el);
    }

    if (infos_b) {

        for (let i = 0; i < infos_b.length && i < 3; ++i) {
            let el = document.createElement('li');
            el.innerText = infos_b[i].word;
            domInfos_b.appendChild(el);
        }
    } else {
        let el = document.createElement('li');
        el.innerText = '---';
        domInfos_b.appendChild(el);
    }


}


document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        const motInput = document.getElementById('mot');
        if(motInput === document.activeElement) {
            document.getElementById('btn').click();
        }
    };
})