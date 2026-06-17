let level1;

function initLevel1() {
    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            // new Chicken(),
            // new Chicken(),
            // new Chicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new Endboss(),
        ],

        [
            new Clouds(),
            new Clouds(),
            new Clouds(),
        ],

        [
            new BackgroundObject('assets/5_background/layers/air.png', 0, 0, -719, 480),
            new BackgroundObject('assets/5_background/layers/3_third_layer/2.png', 0, 0, -719, 480),
            new BackgroundObject('assets/5_background/layers/2_second_layer/2.png', 0, 0, -719, 480),
            new BackgroundObject('assets/5_background/layers/1_first_layer/2.png', 0, 0, -719, 480),

            new BackgroundObject('assets/5_background/layers/air.png', 0, 0, 0, 480),
            new BackgroundObject('assets/5_background/layers/3_third_layer/1.png', 0, 0, 0, 480),
            new BackgroundObject('assets/5_background/layers/2_second_layer/1.png', 0, 0, 0, 480),
            new BackgroundObject('assets/5_background/layers/1_first_layer/1.png', 0, 0, 0, 480),
            new BackgroundObject('assets/5_background/layers/air.png', 0, 0, 719, 480),
            new BackgroundObject('assets/5_background/layers/3_third_layer/2.png', 0, 0, 719, 480),
            new BackgroundObject('assets/5_background/layers/2_second_layer/2.png', 0, 0, 719, 480),
            new BackgroundObject('assets/5_background/layers/1_first_layer/2.png', 0, 0, 719, 480),

            new BackgroundObject('assets/5_background/layers/air.png', 0, 0, 719 * 2, 480),
            new BackgroundObject('assets/5_background/layers/3_third_layer/1.png', 0, 0, 719 * 2, 480),
            new BackgroundObject('assets/5_background/layers/2_second_layer/1.png', 0, 0, 719 * 2, 480),
            new BackgroundObject('assets/5_background/layers/1_first_layer/1.png', 0, 0, 719 * 2, 480),
            new BackgroundObject('assets/5_background/layers/air.png', 0, 0, 719 * 3, 480),
            new BackgroundObject('assets/5_background/layers/3_third_layer/2.png', 0, 0, 719 * 3, 480),
            new BackgroundObject('assets/5_background/layers/2_second_layer/2.png', 0, 0, 719 * 3, 480),
            new BackgroundObject('assets/5_background/layers/1_first_layer/2.png', 0, 0, 719 * 3, 480),
        ],
        [
            // Startbereich links: kleiner Einstieg-Bogen
            new Coin(-500, 290),
            new Coin(-440, 250),
            new Coin(-380, 220),
            new Coin(-320, 250),
            new Coin(-260, 290),

            // Erste klare Sammelreihe
            new Coin(150, 280),
            new Coin(220, 280),
            new Coin(290, 280),

            // Kleiner Sprungbogen
            new Coin(430, 260),
            new Coin(500, 220),
            new Coin(570, 190),
            new Coin(640, 220),
            new Coin(710, 260),

            // Mittlerer Bereich: moderne Wellenform
            new Coin(850, 300),
            new Coin(920, 260),
            new Coin(990, 230),
            new Coin(1060, 260),
            new Coin(1130, 300),

            // Belohnung etwas höher
            new Coin(1250, 210),
            new Coin(1320, 190),
            new Coin(1390, 210),

            // Vor dem Endbereich: längere Linie zum Einsammeln beim Rennen
            new Coin(1520, 280),
            new Coin(1590, 280),
            new Coin(1660, 280),
            new Coin(1730, 280),

            // Coin-Hühnchen innerhalb von x: 2000
            // Körper
            new Coin(1820, 280),
            new Coin(1870, 280),
            new Coin(1920, 280),
            new Coin(1845, 240),
            new Coin(1895, 240),

            // Kopf
            new Coin(1960, 225),
            new Coin(1990, 225),

            // Schnabel
            new Coin(2000, 250),

            // Beine
            new Coin(1850, 320),
            new Coin(1910, 320),

            // Schwanz/Feder hinten
            new Coin(1785, 250),
            new Coin(1760, 220)
        ],

        [
            new Bottle(-350, 0),
            new Bottle(250, 1),
            new Bottle(520, 0),
            new Bottle(780, 1),
            new Bottle(1040, 0),
            new Bottle(1320, 1),
            new Bottle(1600, 0),
            new Bottle(1950, 1)
        ],

        [
            new BottleBox(-500),
            new BottleBox(-350),
            new BottleBox(-200),
            new BottleBox(-50),
            new BottleBox(400),
            new BottleBox(1100),
            new BottleBox(1800)

        ]
    );
}