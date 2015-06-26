poker.filter('roundname', function() {

    // Create the return function
    // set the required parameter name to **round**
    return function(round) {

        // Ensure that the passed in data is a number
        if(isNaN(round)) {
            return round;}



        else {

            // If the data we are applying the filter to is a number, perform the actions to check it's properdisplay and apply it.

            if(round == 0) {
                return 'Starting Game';
            }

            if(round == 1) {
                return 'Ante Round';
            }
            else if(round == 2) {
                return '1st betting Round';
            }
            else if(round == 3) {
                return 'draw Round';

            }
            else if(round == 4) {
                return '2nd betting Round';
            }

            else if(round==5){
                return "showdown";
            }

            else if(round==6){
                return "everybody folded";
            }

            else{return round;}
        }

    }

});
poker.filter('dealpropdisplay', function() {

    // Create the return function
    // set the required parameter name to **suitrank**
    return function(suitrank) {

        // Ensure that the passed in data is a number
        if(isNaN(suitrank)) {
            if( suitrank== "diamonds") {
                return 'diams';}
            else {return suitrank;}
        }

        if( suitrank < 11) {

            // If the data is less than 11(not a figure) return it unmodified.
            return (suitrank);

        }
        else {

            // If the data we are applying the filter to is a number, perform the actions to check it's properdisplay and apply it.



            if(suitrank == 14) {
                return 'A';
            } else if(suitrank == 11) {
                return 'J';
            } else if (suitrank == 12) {
                return 'Q';
            } else if (suitrank == 13) {
                return 'K';
            }

        }
    }
});


poker.filter('symboldisplay', function() {

    // Create the return function
    // set the required parameter name to **number**
    return function(suitrank) {


        if(isNaN(suitrank)) {
            if( suitrank== "diamonds") {

                return '\u25C6';}
            if( suitrank== "clubs") {
                return '\u2663';}
            if( suitrank== "hearts") {
                return '\u2665';}
            if( suitrank== "spades") {
                return '\u2660';}

        }



    }
});





