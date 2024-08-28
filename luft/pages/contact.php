<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/media/css/main.css">
    <link rel="stylesheet" href="/media/css/contact.css">
    <title>LUFT</title>
</head>

<body>

    <div id="main-container">
        <?php require __DIR__ . '/../media/templates/header.php' ?>
        <article>
            <h1>Kontakt</h1>
            <div id="contact-top">
                <div id="map">
                    <h3>Tu jesteśmy:</h3>
                    <iframe height="450" load="lazy" allowfullscreen
                        src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJJ70RZobNFkcRT9Ql4rVsVY4&key=AIzaSyChSIppY9PydhsWk1RsjZTZKyp-6xCRQcQ"></iframe>
                </div>
                <div>
                    <h3>Jak do nas dojechać?</h3>
                    <div id="stops-container">
                        <p>
                            <span class="emph">
                                <img src="/media/svg/tram.svg" alt="Tramwaje"><br>
                                Chorzów Omańkowskiej
                            </span><br>
                            T9, T17<br>
                            Czas dojścia: około 1 minuta <br>
                            <br>
                            <span class="emph">
                                Chorzów Szkoła Niewidomych
                            </span>
                            <br>T20, T40
                            <br>Czas dojścia: około 5 minut
                        </p>
                        <p><span class="emph">
                                <img src="/media/svg/bus.svg" alt="Autobusy"><br>
                                Chorzów Hajducka<br>Chorzów Cmentarz</span><br>
                            6, 22, 48, 74, 139, 632, 974<br>Czas dojścia: około 3 minuty</p>
                        <p><span class="emph">
                                <img src="/media/svg/train.svg" alt="Pociągi"><br>
                                Chorzów Uniwersytet</span><br>
                            Czas dojścia: około 10 minut</p>
                        <p><span class="emph">
                                <img src="/media/svg/car.svg" alt="Samochody"></span><br>
                            Naprzeciw wejścia znajduje się bezpłatny parking. <br>W pobliżu jest wiele płatnych
                            parkingów miejskich.
                            </span></p>
                    </div>
                </div>
            </div>
        </article>
    </div>
    <?php require __DIR__ . '/../media/templates/footer.php' ?>

</body>

</html>