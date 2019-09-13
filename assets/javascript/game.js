const characters = [
    {
        nickname: "luke",
        name: "Luke Skywalker",
        image: "luke.jpg",
        audio: "luke.mp3",
        health: 50,
        reset_health: 50,
        power: 5,
        counter: 5
    },
    {
        nickname: "vader",
        name: "Darth Vader",
        image: "vader.jpg",
        audio: "vader.mp3",
        health: 50,
        reset_health: 50,
        power: 5,
        counter: 5
    },
    {
        nickname: "sidi",
        name: "Darth Sidious",
        image: "sidi.jpg",
        audio: "sidi.mp3",
        health: 50,
        reset_health: 50,
        power: 5,
        counter: 5
    },
    {
        nickname: "chew",
        name: "Chewbacca",
        image: "chew.jpg",
        audio: "chew.mp3",
        health: 50,
        reset_health: 50,
        power: 5,
        counter: 5
    }
]


let mainChar = "";
let mainEnemy = "";
let basePower = 0;
let enemiesArray = [];
let mainHasBeenSelected = false;
let selectEnemyTitle = "Select Your Enemy";
let attackTitle = "Click on Lightsabers to attack your enemy!";
let enemyHasBeenSelected = false;


function resetAll() {
    mainHasBeenSelected = false;
    enemyHasBeenSelected = false;
    enemiesArray = [];
    $("#appended_chars").empty();
    $("#other_enemies").empty();

}

function pushEnemies() {
    for (let i = 0; i < characters.length; i++) {
        enemiesArray.push(characters[i])
    }

}

function buildGame() {
    resetAll();
    pushEnemies()
    for (let i = 0; i < characters.length; i++) {
        characters[i].health = characters[i].reset_health;
        let cardDiv = $("<div>");
        cardDiv.attr("class", "card m-4 card-" + characters[i].nickname);
        cardDiv.attr("id", characters[i].nickname);
        let cardHeader = $("<div>");
        cardHeader.attr("class", "card-header text-wrap");
        cardDiv.append(cardHeader);
        let cardTitle = $("<h2>");
        cardTitle.attr("class", "text-wrap text-break");
        cardTitle.html(characters[i].name.split(" ").join("<br>"));
        cardHeader.append(cardTitle);
        let cardFooter = $("<div>");
        cardFooter.addClass("card-footer");
        cardDiv.append(cardFooter);
        let footerHealth = $("<h4>");
        footerHealth.attr("class", characters[i].nickname + "_health")
        cardFooter.append(footerHealth);
        footerHealth.html(characters[i].health);
        $("#appended_chars").append(cardDiv);
        selectMainChar();
    }
}

//background music
function playMusic() {
    let audio = new Audio("./assets/audio/Star-Wars-Theme -John-Williams.mp3");
    audio.volume = 0.1;
    audio.play();
}
//chars sound
function playCharSound(char) {
    let audio = new Audio("./assets/audio/chars/" + char + ".mp3");
    audio.play();
}
//attack sound
function playAttackSound() {
    let audio = new Audio("./assets/audio/ls03.mp3");
    audio.play();
}

function selectMainChar() {

    console.log(enemiesArray)
    for (let i = 0; i < characters.length; i++) {

        let nickname = characters[i].nickname;
        $("#" + nickname).on("click", function () {
            if (mainHasBeenSelected === false) {
                mainHasBeenSelected = true;
                $("#title_heading").text(selectEnemyTitle);
                mainChar = nickname;
                basePower = characters[i].power;
                $("#" + nickname).animate({ top: "+=100px", left: "+=100px" }, "fast");
                $("#" + nickname).attr("style", "position:absolute");
                playCharSound(mainChar);

                if (mainChar === enemiesArray[i].nickname) {

                    let char = enemiesArray[i];
                    let charIndex = enemiesArray.indexOf(char);
                    enemiesArray.splice(charIndex, 1);
                }
                selectEnemy(mainChar);
            }
        })
    }
}

//selecting an enemy
function selectEnemy(mainChar) {

    for (let i = 0; i < enemiesArray.length; i++) {
        $("#other_enemies").css("transform", "scale(1)");

        let enemy = enemiesArray[i].nickname;
        $("#" + enemy).on("click", function () {
            if (mainHasBeenSelected === true && enemyHasBeenSelected === false) {

                if (mainChar !== enemy) {
                    enemyHasBeenSelected = true;
                    $("#appended_chars").append($(".card-" + enemy));

                    $("#" + enemy).animate({ top: "+=100px", right: "+=100px" }, "fast");
                    $("#" + enemy).attr("style", "position:absolute");
                    playCharSound(enemy)
                    $("#other_enemies").css("transform", "scale(0.5)");
                    setTimeout(function () {
                        $("#attack_button").attr("style", "display: block");
                    }, 1000);
                    mainEnemy = enemy;
                    startGame(mainChar, mainEnemy);
                }
            }
        })
    }

}


//if everyone is in place, showing the attack button, putting not chosen on the bench and starting the game!
function startGame(main, enemy) {
    $("#title_heading").text(attackTitle);
    $("#attack_button").attr("style", "display: block")
    for (let i = 0; i < characters.length; i++) {

        if (characters[i].nickname !== enemy && characters[i].nickname !== main) {

            let waiting = characters[i].nickname;

            $("#other_enemies").append($("#" + waiting));
            $("#other_enemies").css("transform", "scale(0.5");

        }

    }
}

//display stats: moving it out of attack logic for cleaner view
function displayStats(main, enemy) {
    $("#title_heading").html(
        `You attack ${enemy.name} for ${basePower} HP!<br>
                ${enemy.name} attacks you back for ${enemy.counter} HP!`
    );
    $("." + enemy.nickname + "_health").text(enemy.health)
    $("." + main.nickname + "_health").text(main.health)


}

//popup window function
let popUp = () => {
    //on and hover close button on popup
    $(".btn_close").mouseenter(function () {
        $(this).attr("src", "assets/images/close-button-hover.jpg");
    });
    $(".btn_close").mouseleave(function () {
        $(this).attr("src", "assets/images/close-button.jpg");
    });

    //displaying popup window after user wins or lose
    $("#popup").css("display", "block");
    //setting the center alignment for popup
    var popMargTop = ($("#popup").height() + 24) / 2;
    var popMargLeft = ($("#popup").width() + 24) / 2;
    $("#popup").css({
        "margin-top": -popMargTop,
        "margin-left": -popMargLeft
    });

    // add the overlay mask to body
    $("body").append("<div id=\"mask\"></div>");
    $("#mask").fadeIn(300);
    // when clicking on the button close or the mask layer the popup closed
    $("a.close, #mask").on("click", function () {

        $("#mask , .popup").fadeOut(300, function () {
            $("#mask").remove();
            $("#title_heading").html("Select Your Character");
            buildGame();
            console.log("clicco x");
        });

        return false;
    });

}

//function attack
function attack(main, enemy) {
    let enemyIndex = 0;

    for (let i = 0; i < enemiesArray.length; i++) {

        if (enemiesArray[i].nickname === enemy) {
            enemy = enemiesArray[i];
            enemyIndex = enemiesArray.indexOf(enemy);
            //console.log("this is index of enemy in enemy array: "+ enemyIndex);
        }
    }

    for (let i = 0; i < characters.length; i++) {
        if (characters[i].nickname === main) {
            main = characters[i];
        }

    }

    if (enemy.health > 0 && main.health > 0) {
        //--------- fight logic ------------//
        enemy.health = enemy.health - basePower;
        main.health = main.health - enemy.counter;
        displayStats(main, enemy);
        basePower = basePower + main.power;
        //--------- /fight logic ------------//
    }

    if (enemy.health <= 0) {
        console.log(enemiesArray);
        enemiesArray.splice(enemyIndex, 1);
        console.log(enemiesArray);
        $("#title_heading").html(`${enemy.name} has been defeated! <br> Select youe next enemy!`);
        $("#attack_button").attr("style", "display: none")

        $(".card-" + enemy.nickname).addClass(enemy.nickname + "-defeated");


        $(".card-" + enemy.nickname + " .card-header").text("");
        $(".card-" + enemy.nickname + " .card-footer").text("");
        setTimeout(function () {
            $(".card-" + enemy.nickname).css("transform", "scale(0)");
            $(".card-" + enemy.nickname).css("style", "display:none");
        }, 1000);
        enemyHasBeenSelected = false;
        //nextEnemySelected = false;

        if (enemiesArray.length === 0) {
            $(".message").html("Congratulations!<br>You have defeated all of your enemies!");
            setTimeout(popUp, 2000)
        }
        else {
            //nextEnemy(main);
            selectEnemy(main)
        }



    }

    if (main.health <= 0) {

        $("#title_heading").html(`You has been defeated!`);
        $("#attack_button").attr("style", "display: none")
        $(".card-" + main.nickname).addClass(main.nickname + "-defeated");
        $(".card-" + main.nickname + " .card-header").text("");
        $(".card-" + main.nickname + " .card-footer").text("");
        setTimeout(function () {
            $(".card-" + main.nickname).css("transform", "scale(0");
            $(".card-" + main.nickname).remove();
        }, 1000);
        mainCharDead = true;

        $(".message").html("Too bad!<br>You are dead!");
        setTimeout(popUp, 2000)
    }
}

//initializing game
playMusic()
buildGame();

$("#attack_button").on("click", function () {

    attack(mainChar, mainEnemy);
    playAttackSound();
})