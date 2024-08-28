<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="media/css/main.css">
    <link rel="stylesheet" href="media/css/index.css">
    <script src="media/js/main.js"></script>
    <title>LUFT</title>
</head>

<body>

    <div id="main-container">
        <?php require 'media/templates/header.php' ?>
        <article>
            <h1>Poznaj nasze pokoje:</h1>
            <div class="rooms-container wide">

                <div id="rooms-wheel">
                <div><img src="/media/img/rooms/pociong.jpg" alt="Morderstwo w Orient Expressie" onclick="setBrief(0)"></div>
                <div><img src="/media/img/rooms/fcz.jpg" alt="Fabryka Czekolady" onclick="setBrief(1)"></div>
                <div><img src="/media/img/rooms/agenty.jpg" alt="Licencja 00" onclick="setBrief(2)"></div>
                <div><img src="/media/img/rooms/teatr.jpg" alt="Ale sztuka!" onclick="setBrief(3)"></div>
                <div><img src="/media/img/rooms/potworki.jpg" alt="Fabryka Potworów" onclick="setBrief(4)"></div>
                </div>

                <div id="room-brief">
                    <h2 id="room-brief-name"><i>давай уедем из ГУЛАГа</i></h2>
                    <p id="room-brief-description">Obywatelu! Wasze burżuazyjne życie zostało zniszczone w płomieniach rewolucyjnego ognia. Zazwyczaj takich jak wy pozbywamy się szybko.. z nieznanych przyczyn Pierwszy Sekretarz daje wam szansę ucieczki. Czy ją wykorzystacie? Czy unikniecie powrotu do więzienia (i w konsekwencji pod ścianę)?</p>
                    <p><span class="emph">Kategoria: </span><span id="room-brief-category">przygoda</span></p>
                    <p><span class="emph">Trudność: </span><span id="room-brief-difficulty"><img src="media/svg/star.svg" alt="bardzo"><img src="media/svg/star.svg" alt="bardzo"><img src="media/svg/star.svg" alt="bardzo"><img src="media/svg/star.svg" alt="bardzo"><img src="media/svg/star.svg" alt="bardzo"></span></p>
                    <p><span class="emph">Czas gry: </span><span id="room-brief-time">dożywocie w łagrze</span></p>
                    <div  id="room-brief-book"><a href="#">Zarezerwuj!</a></div>
                </div>
            </div>
            <div class="rooms-container mid-width">
                
            </div>

            <h1>Opinie naszych gości:</h1>
            <div id="opinion-carousel">
                <img src="/media/img/syf.jpeg" alt="Opinia 1" >
                <img src="/media/img/opinia.jpeg" alt="Opinia 2">
                <img src="/media/img/zrzedy.jpeg" alt="Opinia 3">
                <img src="/media/img/niezadowolenie.jpeg" alt="Opinia 4">
                <img src="/media/img/obsluga.jpeg" alt="Opinia 5" >
                <img src="/media/img/obsluga2.jpeg" alt="Opinia 6" >
                <img src="/media/img/horror.jpeg" alt="Opinia 7" >
                <img src="/media/img/szok.jpeg" alt="Opinia 8" >
            </div>

        </article>
    </div>
    <?php require 'media/templates/footer.php' ?>

</body>

</html>