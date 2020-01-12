$( document ).ready(function() {

//array of characters objects... i am really heaving difficulties to balance those characters :( 
const characters = [
    {
        nickname: "luke",
        name: "Luke Skywalker",
        image: "luke.jpg",
        audio: "luke.mp3",
        health: 70,
        reset_health: 70,
        power: 10,
        counter: 20
    },
    {
        nickname: "vader",
        name: "Darth Vader",
        image: "vader.jpg",
        audio: "vader.mp3",
        health: 80,
        reset_health: 80,
        power: 8,
        counter: 16
    },
    {
        nickname: "sidi",
        name: "Darth Sidious",
        image: "sidi.jpg",
        audio: "sidi.mp3",
        health: 100,
        reset_health: 100,
        power: 4,
        counter: 8
    },
    {
        nickname: "chew",
        name: "Chewbacca",
        image: "chew.jpg",
        audio: "chew.mp3",
        health: 120,
        reset_health: 120,
        power: 6,
        counter: 7
    }
]


let mainChar = ""; // setting main character
let mainEnemy = ""; // stting the enemy
let basePower = 0; // setting base power to 0
let enemiesArray = []; //an empty array, going to push here the 3 enemies
let mainHasBeenSelected = false; //verifying if main character has been selected
let enemyHasBeenSelected = false; //verifying if enemy has been selected
//setting some  titles
let selectEnemyTitle = "Select Your Enemy"; 
let attackTitle = "Click on Lightsabers to attack your enemy!";


//resetting all when restarting the game
function resetAll() {
    mainHasBeenSelected = false;
    enemyHasBeenSelected = false;
    enemiesArray = [];
    $("#appended_chars").empty();
    $("#other_enemies").empty();
    $("#attack_button").attr("style", "display: none");
}

//pushing enemies to that array
function pushEnemies() {
    for (let i = 0; i < characters.length; i++) {
        enemiesArray.push(characters[i])
    }
}

//here i am dynamically creating characters cards
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

//background music - hope it will work once on github, no way to verify it on local (found it on stackoverflow, wanna know more about promises)
let playMusic = function () {
    return new Promise(function (resolve, reject) {
        let audio = new Audio("./assets/audio/Star-Wars-Theme-John-Williams.mp3");
        audio.volume = 0.1;
        audio.preload = "auto";// intend to play through
        audio.autoplay = true;// autoplay when loaded
        audio.onerror = reject;// on error, reject
        audio.onended = resolve;// when done, resolve
    })

}
playMusic().then(function () {
    console.log("risolto?")
})

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
//defeat sound
function playDefeatSound() {
    let audio = new Audio("./assets/audio/defeat.mp3");
    audio.play();
}
//victory sound
function playVictorySound() { //huh! don't really know what sound to use in case of victory lol
    let audio = new Audio("./assets/audio/happy.mp3");
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
    $("#other_enemies_title").attr("style", "display: block");
    $("#defender_title").attr("style", "display: block");
    $("#attacker_title").attr("style", "display: block");
    $("#title_heading").text(attackTitle);
    $("#attack_button").attr("style", "display: block");
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
    let popMargTop = ($("#popup").height() + 24) / 2;
    let popMargLeft = ($("#popup").width() + 24) / 2;
    $("#popup").css({"margin-top": -popMargTop,"margin-left": -popMargLeft });

    // add the overlay mask to body
    $("body").append("<div id=\"mask\"></div>");
    $("#mask").fadeIn(300);
    // when clicking on the button close or the mask layer the popup closed
    $("a.close, #mask").on("click", function () {

        $("#mask , .popup").fadeOut(300, function () {
            $("#mask").remove();
            $("#title_heading").html("Select Your Character");
            $("#popup").removeClass("popup-won");
            $("#popup").removeClass("popup-defeat");
            buildGame();
        });

        return false;
    });

}

//function attack
function attack(main, enemy) {
    let enemyIndex = 0;
//looping trough enemies array, finding the index of current enemy
    for (let i = 0; i < enemiesArray.length; i++) {

        if (enemiesArray[i].nickname === enemy) {
            enemy = enemiesArray[i];
            enemyIndex = enemiesArray.indexOf(enemy);
        }
    }
//finding main chars data
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].nickname === main) {
            main = characters[i];
        }

    }
//untill they are alive
    if (enemy.health > 0 && main.health > 0) {
        //--------- fight logic ------------//
        enemy.health = enemy.health - basePower;

        main.health = main.health - enemy.counter;


        displayStats(main, enemy);
        basePower = basePower + main.power;
        //--------- /fight logic ------------//
    }
//if enemy dies
    if (enemy.health <= 0) {
        enemiesArray.splice(enemyIndex, 1); //taking him out of the array
        //all the jquery to update info
        $("#title_heading").html(`${enemy.name} has been defeated! <br> Select youe next enemy!`);
        $("#attack_button").attr("style", "display: none");
        $(".card-" + enemy.nickname).addClass(enemy.nickname + "-defeated");
        $(".card-" + enemy.nickname + " .card-header").text("");
        $(".card-" + enemy.nickname + " .card-footer").text("");
        setTimeout(function () {
            $(".card-" + enemy.nickname).css("transform", "scale(0)");
            $(".card-" + enemy.nickname).css("style", "display:none");
        }, 1000);
        enemyHasBeenSelected = false;
//if all enemies are dead
        if (enemiesArray.length === 0) {
            
            $("#popup").addClass("popup-won");
            $(".message").html("Congratulations!<br>You have defeated all of your enemies!");
            playVictorySound();
            setTimeout(popUp, 2000)
        }
        else {
            selectEnemy(main);
        }



    }
//if main is dead
    if (main.health <= 0) {

        $("#title_heading").html(`You has been defeated!`);
        $("#attack_button").attr("style", "display: none");
        $(".card-" + main.nickname).addClass(main.nickname + "-defeated");
        $(".card-" + main.nickname + " .card-header").text("");
        $(".card-" + main.nickname + " .card-footer").text("");
        setTimeout(function () {
            $(".card-" + main.nickname).css("transform", "scale(0");
            $(".card-" + main.nickname).remove();
        }, 1000);
        mainCharDead = true;
        $("#popup").addClass("popup-defeat");
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


});