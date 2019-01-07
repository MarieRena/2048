(function ($) // début du pluggin
{
    $.fn.game2048 = function () //function game2048 du pluggin
    {
           
        var score = 0;
        var bestScore;
        $('#myModal').hide();
        $('#loose').hide();
        // génération du tableau (table, tr, td) vide (rempli de zéros)
        function generate_map() {
            var gameMap = $('<div class="gameMap"></div>');
            for (var y = 0; y < 4; y++) {
                var ligne = $('<div class="row"></div>');
                for (var x = 0; x < 4; x++) {
                    var cases = $('<div class="cell"></div>').attr('x', x).attr('y', y).attr('nbr', 0);
                    ligne.append(cases);
                }
                gameMap.append(ligne);
            }
            return gameMap;
        }

    
        $(document).ready(function(){
            if(sessionStorage.getItem("currentGame")!== null){
                getSession("currentGame");
                getScore("currentScore");
                $('#bestScore').html(bestScore);
            }
        });

        $('#undo').click(function(){
            if(sessionStorage.getItem("lastGame")!== null){
                getSession("lastGame");
                getScore("lastScore");
                $('#undo').attr('src', 'undo-hide.png');
                $('#redo').attr('src', 'redo.png');
            }
        });

        $('#redo').click(function(){
            if(sessionStorage.getItem("currentGame")!== null){
                getSession("currentGame");
                getScore("currentScore");
                $('#undo').attr('src', 'undo.png');
                $('#redo').attr('src', 'redo-hide.png');
            }
        });

        $('#question').click(function(){
            var modal = $('#myModal');
            modal.show();
        });

        $('.close').click(function(){
            $('#myModal').hide();
        });

        
        // génération d'un certain nombre de cases (argument cases) aléatoirement placées sur les cases d'attribut 'nbr=0'
        function generate_case(cases) {
            for (var i = 0; i < cases; i++) {
                var x = Math.floor((Math.random() * 4));
                var y = Math.floor((Math.random() * 4));
                var value = 2 * (Math.floor((Math.random() * 2) + 1));
                var elem = $('[x="' + x + '"][y="' + y + '"][nbr=0]');

                if (value === 4 && Math.random() > 0.5)
                    value = 2;
                if (!elem[0])
                    generate_case(1);
                else {
                    elem.attr('nbr', value);

                    elem.text(value);
                    elem.addClass('nb' + value + ' new');
                }
            }
        }

        function storeSession(currentGame){
            var arrayStorage = [];
            for (var j = 0; j <= 3; j++) {
                for (var i = 0; i <= 3; i++) {
                    arrayStorage.push($('[y=' + j + '][x=' + i + '][nbr='+($('div[y=' + j + '][x=' + i + ']').attr('nbr'))+']')["selector"]);
                }
            }
            sessionStorage.setItem(currentGame,arrayStorage);
            return(arrayStorage);
        };

        function storeScore(currentScore){
            sessionStorage.setItem(currentScore,score);
        };

        function getScore(currentScore){
            var getScore = sessionStorage.getItem(currentScore);
            score = parseInt(getScore);
            $('#score').html(score);
            $('#bestScore').html(bestScore);
        }

        function getSession(currentGame){
            $('.cell').attr('nbr', '0');
            $('.cell').text('');
            $('.cell').attr('class', 'cell');
            var getSession = sessionStorage.getItem(currentGame);
            var res = getSession.split(","); //tab avce toutes les coordonnées
            for(i=0;i<16;i++){
                var finNb = res[i].indexOf("]",15);
                var result="";
                for(x=15;x<finNb;x++){
                    result = result + res[i][x];  
                }
                $('div[y='+res[i][3]+'][x='+res[i][8]+']').attr('nbr',result);
                if(res[i][15]!='0'){
                    $('div[y='+res[i][3]+'][x='+res[i][8]+']').text(result);
                    $('div[y='+res[i][3]+'][x='+res[i][8]+']').addClass('nb' + result + ' new');
                }
                else
                $('div[y='+res[i][3]+'][x='+res[i][8]+']').text("");
            }
        }
        
        function mergeCaseRight() {
            var value = 0;
            var mergeSomething = false;
            $('div').removeClass("new merge");
            for (var j = 0; j <= 3; j++) {
                for (var i = 3; i >= 0; i--) {
                    if ($('div[y=' + j + '][x=' + i + ']').attr('nbr') == $('div[y=' + j + '][x=' + (i + 1) + ']').attr('nbr')) {

                        if ($('div[y=' + j + '][x=' + (i) + ']').attr('nbr') != "0") {
                            if (($('div[y=' + j + '][x=' + (i) + ']').hasClass('merge') == false) || ($('div[y=' + j + '][x=' + (i - 1) + ']').hasClass('merge') == false)) {
                                value = parseInt($('div[y=' + j + '][x=' + (i) + ']').text());
                                $('div[y=' + j + '][x=' + (i + 1) + ']').attr('nbr', value * 2);
                                $('div[y=' + j + '][x=' + (i + 1) + ']').text(value * 2);
                                $('div[y=' + j + '][x=' + (i + 1) + ']').addClass('nb' + (value * 2));
                                $('div[y=' + j + '][x=' + (i + 1) + ']').addClass('merge');
                                $('div[y=' + j + '][x=' + (i) + ']').text('');
                                $('div[y=' + j + '][x=' + (i) + ']').attr('nbr', '0');
                                $('div[y=' + j + '][x=' + (i) + ']').removeClass('nb' + value);
                                $('div[y=' + j + '][x=' + (i + 1) + ']').removeClass('nb' + value);
                                score = score + (value * 2);
                                mergeSomething = true;
                            }
                        }
                    }
                }
            }
            return mergeSomething;
        }

        function mergeCaseLeft() {
            var value = 0;
            var mergeSomething = false;
            $('div').removeClass("new merge");
            for (var j = 0; j <= 3; j++) {
                for (var i = 0; i <= 3; i++) {
                    if ($('div[y=' + j + '][x=' + i + ']').attr('nbr') == $('div[y=' + j + '][x=' + (i - 1) + ']').attr('nbr')) {

                        if ($('div[y=' + j + '][x=' + (i) + ']').attr('nbr') != "0") {
                            if ($('div[y=' + j + '][x=' + (i) + ']').hasClass('merge') == false) {
                                value = parseInt($('div[y=' + j + '][x=' + (i - 1) + ']').text());
                                $('div[y=' + j + '][x=' + (i - 1) + ']').attr('nbr', value * 2);
                                $('div[y=' + j + '][x=' + (i - 1) + ']').text(value * 2);
                                $('div[y=' + j + '][x=' + (i - 1) + ']').addClass('nb' + (value * 2));
                                $('div[y=' + j + '][x=' + (i - 1) + ']').addClass('merge');
                                $('div[y=' + j + '][x=' + (i) + ']').text('');
                                $('div[y=' + j + '][x=' + (i) + ']').attr('nbr', '0');
                                $('div[y=' + j + '][x=' + (i) + ']').removeClass('nb' + value);
                                $('div[y=' + j + '][x=' + (i - 1) + ']').removeClass('nb' + value);
                                score = score + (value * 2);
                                mergeSomething = true;
                            }
                        }
                    }
                }
            }
            return mergeSomething;
        }

        function mergeCaseUp() {
            var value = 0;
            $('div').removeClass("new merge");
            var mergeSomething = false;
            for (var i = 0; i <= 3; i++) {
                for (var j = 0; j <= 3; j++) {
                    if ($('div[y=' + j + '][x=' + i + ']').attr('nbr') == $('div[y=' + (j + 1) + '][x=' + i + ']').attr('nbr')) {

                        if ($('div[y=' + j + '][x=' + (i) + ']').attr('nbr') != "0") {
                            if ($('div[y=' + j + '][x=' + (i) + ']').hasClass('merge') == false) {
                                value = parseInt($('div[y=' + j + '][x=' + (i) + ']').text());
                                $('div[y=' + j + '][x=' + i + ']').attr('nbr', value * 2);
                                $('div[y=' + j + '][x=' + i + ']').text(value * 2);
                                $('div[y=' + j + '][x=' + i + ']').addClass('nb' + (value * 2));
                                $('div[y=' + j + '][x=' + i + ']').addClass('merge');
                                $('div[y=' + (j + 1) + '][x=' + i + ']').text('');
                                $('div[y=' + (j + 1) + '][x=' + i + ']').attr('nbr', '0');
                                $('div[y=' + (j + 1) + '][x=' + i + ']').removeClass('nb' + value);
                                $('div[y=' + j + '][x=' + i + ']').removeClass('nb' + value);
                                score = score + (value * 2);
                                mergeSomething = true;
                            }
                        }
                    }
                }
            }
            return mergeSomething;
        }

        function mergeCaseDown() {
            $('div').removeClass("new merge");
            var value = 0;
            var mergeSomething = false;
            for (var i = 0; i <= 3; i++) {
                for (var j = 3; j >= 0; j--) {
                    if ($('div[y=' + j + '][x=' + i + ']').attr('nbr') == $('div[y=' + (j - 1) + '][x=' + i + ']').attr('nbr')) {

                        if ($('div[y=' + j + '][x=' + (i) + ']').attr('nbr') != "0") {
                            if ($('div[y=' + j + '][x=' + (i) + ']').hasClass('merge') == false) {
                                value = parseInt($('div[y=' + j + '][x=' + (i) + ']').text());
                                $('div[y=' + (j) + '][x=' + i + ']').attr('nbr', value * 2);
                                $('div[y=' + (j) + '][x=' + i + ']').text(value * 2);
                                $('div[y=' + (j) + '][x=' + i + ']').addClass('nb' + (value * 2));
                                $('div[y=' + (j) + '][x=' + i + ']').addClass('merge');
                                $('div[y=' + (j - 1) + '][x=' + i + ']').text('');
                                $('div[y=' + (j - 1) + '][x=' + i + ']').attr('nbr', '0');
                                $('div[y=' + (j - 1) + '][x=' + i + ']').removeClass('nb' + value);
                                $('div[y=' + (j) + '][x=' + i + ']').removeClass('nb' + value);
                                score = score + (value * 2);
                                mergeSomething = true;
                            }
                        }
                    }
                }
            }
            return mergeSomething;
        }

        function moveLeft() {
            var compteur = 0;
            var moveSomething = false;
            for (var j = 0; j <= 3; j++) {
                for (var i = 0; i <= 3; i++) {
                    if ($('div[y=' + j + '][x=' + i + ']').text() == "") {
                        compteur++;
                    }
                    else {
                        if (compteur > 0) {
                            // var position = $('div[y=' + j + '][x=' + i + ']').position();
                            // var left = position.left;
                            // var newPosition = $('div[y=' + j + '][x=' + (i - compteur) + ']').position();
                            // var newLeft = newPosition.left;
                            
                            // var move = (newLeft - left) + 'px';
                            // console.log(move);
                            // $('div[y=' + j + '][x=' + i + ']').css({'transform':'translate('+move+')'},500);

                           //setTimeout(function(){
                            $('div[y=' + j + '][x=' + (i - compteur) + ']').text($('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + (i - compteur) + ']').addClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + (i - compteur) + ']').attr('nbr', $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').removeClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').text('');
                            $('div[y=' + j + '][x=' + i + ']').attr('nbr', '0');
                           //},1000);
                            
                            i = i - compteur;
                            moveSomething = true;

                        }
                        compteur = 0;
                    }
                }
                compteur = 0;
            }

            return moveSomething;
        }

        function moveRight() {
            var compteur = 0;
            var moveSomething = false;
            for (var j = 0; j <= 3; j++) {
                for (var i = 3; i >= 0; i--) {
                    if ($('div[y=' + j + '][x=' + i + ']').text() == "") {
                        compteur++;
                    }
                    else {
                        if (compteur > 0) {
                            $('div[y=' + j + '][x=' + (i + compteur) + ']').text($('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + (i + compteur) + ']').addClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + (i + compteur) + ']').attr('nbr', $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').removeClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').text("");
                            $('div[y=' + j + '][x=' + i + ']').attr('nbr', '0');
                            i = i + compteur;
                            moveSomething = true;
                        }
                        compteur = 0;
                    }
                }
                compteur = 0;
            }
            return moveSomething;
        }

        function moveUp() {
            var compteur = 0;
            var moveSomething = false;
            for (var i = 0; i <= 3; i++) {
                for (var j = 0; j <= 3; j++) {
                    if ($('div[y=' + j + '][x=' + i + ']').text() == "") {
                        compteur++;
                    }
                    else {
                        if (compteur > 0) {
                            $('div[y=' + (j - compteur) + '][x=' + i + ']').text($('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + (j - compteur) + '][x=' + i + ']').addClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + (j - compteur) + '][x=' + i + ']').attr('nbr', $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').removeClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').text("");
                            $('div[y=' + j + '][x=' + i + ']').attr('nbr', '0');
                            j = j - compteur;
                            moveSomething = true;
                        }
                        compteur = 0;
                    }
                }
                compteur = 0;
            }
            return moveSomething;
        }

        function moveDown() {
            var compteur = 0;
            var moveSomething = false;
            for (var i = 0; i <= 3; i++) {
                for (var j = 3; j >= 0; j--) {
                    if ($('div[y=' + j + '][x=' + i + ']').text() == "") {
                        compteur++;
                    }
                    else {
                        if (compteur > 0) {
                            $('div[y=' + (j + compteur) + '][x=' + i + ']').text($('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + (j + compteur) + '][x=' + i + ']').addClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + (j + compteur) + '][x=' + i + ']').attr('nbr', $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').removeClass('nb' + $('div[y=' + j + '][x=' + i + ']').text());
                            $('div[y=' + j + '][x=' + i + ']').text("");
                            $('div[y=' + j + '][x=' + i + ']').attr('nbr', '0');
                            j = j + compteur;
                            moveSomething = true;
                        }
                        compteur = 0;
                    }
                }
                compteur = 0;
            }
            return moveSomething;
        }

        function checkWinner() {
            var winner = false;
            for (var i = 0; i <= 3; i++) {
                for (var j = 3; j >= 0; j--) {
                    if ($('div[y=' + j + '][x=' + i + ']').text() == "2048") {
                        winner = true;
                        $('.message').html("Congratulations ! You win !");
                    }
                }
            }
            return winner;
        }

        function checkLooser() {
            var looser = false;
            var count = 0;
            for (var i = 0; i <= 3; i++) {
                for (var j = 3; j >= 0; j--) {
                    if ($('div[y=' + j + '][x=' + i + ']').text() == "") {
                        count++;
                    }
                }
            }
            if (count == 0 && (!mergeCaseDown() && !mergeCaseUp() && !mergeCaseLeft() && !mergeCaseRight())) {
                looser = true;
                $('.message').html("Game over ! Try again !");
            }
            return looser;
        }
        // fonction de gestion des évenements (appuie de touches)
        $('html').keydown(function (event) {
           if (!checkLooser()) {
                var move;
                var merge;
                switch (event['key']) {
                    case 'ArrowLeft':
                        storeSession("lastGame");
                        storeScore("lastScore");
                        move = moveLeft();
                        merge = mergeCaseLeft();
                        moveLeft();
                        checkWinner();
                        checkLooser();
                        if (merge || move) {
                            generate_case(1);
                        }
                        storeScore("currentScore");
                        storeSession("currentGame");
                        break;

                    case 'ArrowUp':
                        storeSession("lastGame");
                        storeScore("lastScore");
                        move = moveUp();
                        merge = mergeCaseUp();
                        moveUp();
                        checkWinner();
                        checkLooser();
                        if (merge || move) {
                            generate_case(1);
                        }
                        storeSession("currentGame");
                        storeScore("currentScore");
                        break;

                    case 'ArrowRight':
                        storeSession("lastGame");
                        storeScore("lastScore");
                        move = moveRight();
                        merge = mergeCaseRight();
                        moveRight();
                        checkWinner();
                        checkLooser();
                        if (merge || move) {
                            generate_case(1);
                        }
                        storeSession("currentGame");
                        storeScore("currentScore");
                        break;

                    case 'ArrowDown':
                        storeSession("lastGame");
                        storeScore("lastScore");
                        move = moveDown();
                        merge = mergeCaseDown();
                        moveDown();
                        checkWinner();
                        checkLooser();
                        if (merge || move) {
                            generate_case(1);
                        }
                        storeSession("currentGame");
                        storeScore("currentScore");
                        break;
                }
            }

            function getCookie(name) {
                var name = name + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }

            $('#score').html(score);

            
            $('#bestScore').html(bestScore);

            if (score > bestScore) {
                bestScore = score;
                var date = new Date();
                date.setTime(date.getTime()+(7*24*60*60*1000));
                var expires = "expires="+ date.toUTCString();
                $('#bestScore').html(bestScore);
                document.cookie = "score=" + bestScore+";"+expires+";path=/";
            }
            var cookieScore = getCookie("score");
            if (cookieScore != "") {
                $('#bestScore').html(cookieScore);
                bestScore = cookieScore;
            } 

            
        });

        $('#restart').click(function () {
            $('.cell').attr('nbr', '0');
            $('.cell').text('');
            $('.cell').attr('class', 'cell');
            score = 0;
            $('#score').html('0');
            $('.message').text('');
            sessionStorage.removeItem("currentScore");
            sessionStorage.removeItem("lastScore");
            sessionStorage.removeItem("currentGame");
            sessionStorage.removeItem("lastGame");
            $('#bestScore').html(bestScore);
            generate_case(2);
        });

        // début du code lancé
        $(this).append(generate_map()); // génération du tableau vide
        generate_case(2);
        ; // génération aléatoire de deux cases pleines (2 ou 4)
    }


})(jQuery); // fin du pluggin