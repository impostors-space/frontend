

var playButton = document.getElementById("play-button")

playButton.addEventListener("click", function() {
    window.alert("How the game works:\n In Impostor, you can join a so called \"Post\". In that Post you can either be Innocent or THE IMPOSTOR!!! All Innocents can see the initial Post which contains the word that is to be described. The Impostor can't see the initial Post so he doesn't know the word. Then every Member has to describe the word while not directly naming it. The Impostor also has to describe the word based on the Innocents comments. Comments can be up- and downvoted. Based on the amount of down-/upvotes you receive an amount of Points after the Impostor is revealed after 7 days.");
    location.href = "login.html"
})
