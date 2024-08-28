
// 0: orient
// 1: czekolada
// 2: agenty
// 3: teatr
// 4: potwory
// 5: ?

const titles = [
    'Morderstwo w Orient Expressie',
    'Fabryka Czekolady',
    'Licencja 00',
    'Ale sztuka!',
    'Fabryka Potworów',
    '???'
]

// todo: ukraść z lockme, napisać nowe?
const descriptions = [
    'W Orient Expressie doszło do morderstwa. W niewyjaśnionych okolicznościach zginął bogaty przedsiębiorca. Przestępca jest w pociągu. Strach ogarnął wszystkich pasażerów. Rozpoczynacie dochodzenie, a Wasza podróż zamienia się w śledztwo. Czy uda się Wam wskazać mordercę?',
    'Fabryka Willy\'ego Wonki to największa fabryka czekolady na świecie. Ekscentryczny cukiernik tworzy tu prawdziwe cuda. Od jakiegoś czasu pomaga mu w tym Charlie, chłopiec, który znalazł w jednej z czekoladek Wonki Złoty Kupon. Razem przygotowują nową linię smakołyków. Będą to przepyszne babeczki babci Josephine. Niestety, nie wszystkim podoba się sukces Wonki. Jest bowiem ktoś, kto chce mu w tym przeszkodzić...',
    'Brytyjska Służba Specjalna MI6, która szkoli najlepszych agentów w służbie Jej Królewskiej Mości, poszukuje nowych agentów. Niestety James Bond gdzieś przepadł. Może znów zawróciła mu w głowie jakaś piękna kobieta? No cóż ... cały James. Dlatego M poszukuje nowych agentów. Chcecie się sprawdzić? Może uda się Wam zdobyć licencję 00. Łatwo nie będzie!',
    'W profesjonalnym świecie artystów teatralnych istnieje najbardziej pożądana nagroda, którą otrzymuje się za najlepszą sztukę. Legenda głosi, że prestiżowa statuetka Podwójnej Twarzy przynosi szczęście artystom i dyrekcji teatru. Dlatego też każda scena marzy, by stać się jej posiadaczem. Jednak od lat nagroda przyznawana jest temu samemu teatrowi. Nie wszystkim się to podoba. I tu zaczyna się prawdziwa sztuka!',
    'Uwaga! Ulubiony pluszowy mis Boo został skradziony! Ślad za przestępcą prowadzi prosto do Monstropolis! Musicie dostać się do świata potworów, aby ująć złodzieja i odnaleźć pluszowego misia Boo.',
    'Za niedługo otwarcie!'
]

const categories = [
    'kryminalny',
    'przygodowy',
    'logiczny',
    'przygodowy',
    'przygodowy'
]

// 1-5 gwiazdek
const difficulty = [
    3,
    2,
    4,
    4,
    1,
    1
]



// zmienia wizytówkę pokoju na stronie głównej
// n: ID pokoju 

setBrief = async (n, override = false) => {

    let images = document.getElementById('rooms-wheel').getElementsByTagName('img');
    let name = document.getElementById('room-brief-name');
    let desc = document.getElementById('room-brief-description');
    let category = document.getElementById('room-brief-category');
    name.textContent = titles[n];
    desc.textContent = descriptions[n];
    category.textContent = categories[n];
    for (i of images) {
        i.style.boxShadow = 'none';
    }
    images[n].style.boxShadow = '10px 10px 5px 4px var(--aux)';

    override ? resetDifficulty(difficulty[n]) : setDifficultyRating(difficulty[n]);

}

let prevN = 0;
const createStarTimeout = delay => new Promise(resolve =>
    setTimeout(resolve, delay));

// animuje gwiazdki w opisie pokoju

setDifficultyRating = async (n) => {
    let stars = document.getElementById('room-brief-difficulty').getElementsByTagName('img');
    if (n == prevN) return;
    if (n > prevN)
        for (i = prevN; i < n; i++) {
            stars[i].style.animation = 'star-fade-in 0.2s linear forwards';
            await createStarTimeout(100);

        }

    for (i = prevN - 1; i > n - 1; i--) {
        stars[i].style.animation = 'star-fade-out 0.2s linear forwards';
        await createStarTimeout(100);

    }
    prevN = n;

}

const resetDifficulty = (n) => {
    let stars = document.getElementById('room-brief-difficulty').getElementsByTagName('img');
    for (i = 0; i < stars.length; i++) {
        stars[i].style.filter = 'brightness(0)';

        stars[i].style.animation = '';
    }
    for (i = 0; i < n; i++) stars[i].style.filter = 'brightness(1)';

}
const drawRNG = (n) => Math.floor(Math.random() * n)
window.onload = () => {
    // todo: 5 jest tymczasowe :)
    let idk = drawRNG(5);
    setBrief(idk);
    prevN = difficulty[idk];

    // przełącza między opiniami
    let opinions = document.querySelectorAll('#opinion-carousel>img')
    let currentOpinion = drawRNG(opinions.length - 1);
    opinions[currentOpinion].style.display = 'inline-block';
    opinions[currentOpinion].parentElement.addEventListener('animationiteration', () => {
        currentOpinion++;
        currentOpinion %= opinions.length;
        for (const opinion of opinions) opinion.style.display = 'none'
        opinions[currentOpinion].style.display = 'initial';
    })

}




// ułatwienia dostępu
window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case '1': setBrief(0, true); break;
        case '2': setBrief(1, true); break;
        case '3': setBrief(2, true); break;
        case '4': setBrief(3, true); break;
        case '5': setBrief(4, true); break;
    }
})