        var sorting = function (hand) {
            hand.sort(function (a, b) {

                var sA = a.suit;
                var sB = b.suit;

                var n = a.rank - b.rank;
                //sort by rank
                if (n != 0) {
                    return n;
                }
                //sort by suits
                if (sA < sB)
                    return -1;
                else if (sA > sB)
                    return 1;

            });
        };
        var straight = function (hand) {
            if(foundacestr8(hand)){
                return true;
            }
            var hl = hand.length;
            for (var i = 0; i < hl - 1; i++) {
                if (parseInt(hand[i].rank) + 1 != hand[i + 1].rank) { //if there is not a sequence of card rankings
                    return false;
                }
            }
            return true;
        };
        var flush = function (hand) {
            var hl = hand.length;
            for (var i = 0; i < hl - 1; i++) {
                if (hand[i].suit != hand[i + 1].suit) {
                    return false;
                }
            }
            return true;
        };
        var kind = function (n, hand) {
            var hl=hand.length;
            var result = { };
            for (i = 0; i < hl; ++i) { //count rank frequencies
                if (!result[hand[i].rank])
                    result[hand[i].rank] = 0;
                ++result[hand[i].rank];
            }


            for (number in result) {
                if (result[number] == n) {
                    return number;
                }
            }
            return 0;
        };
        var twopair = function (hand) {
            var result = [];
            var hl=hand.length
            pair = kind(2, hand);
            pair2 = { };
            var j = 0;
            var i=0;
            for ( i = hl - 1; i > 0; i--) {//find pair in reversded order
                pair2[j] = {number: hand[i].rank, frequency: 1};

                while ((i > 0) && (hand[i].rank == hand[i - 1].rank)) {
                    pair2[j].frequency++;
                    i--;
                }
                j++
            }


            for (card in pair2) {
                if ((pair2[card].frequency == 2) && (pair2[card].number != pair)) {
                    result[1] = pair;
                    result[0] = pair2[card].number;
                    return result;
                }
            }
            return 0;
        };
        var foundacestr8=function(hand){
            var acestr8rank = [2, 3, 4, 5, 14];
            for (i = 0; i < 5; i++) {

                if ((acestr8rank[i]) != parseInt(hand[i].rank) ) {
                    return false;
                    foundacestr8=true; //not acestr8rank
                }
            }

            for (i = 0; i < 5; i++) {
                hand[i].rank=i+1;


            }
            return true
        };
        var rankproperdisplay=function(number) {

            // Ensure that the passed in data is a number
            if(isNaN(number) || number < 11) {

                // If the data is not a number or is less than two return it unmodified.
                return (number);

            } else {

                // If the data we are applying the filter to is a number, perform the actions to check it's properdisplay and apply it.



                if(number == 14) {
                    return 'Ace';
                } else if(number == 11) {
                    return 'Jack';
                } else if (number == 12) {
                    return 'Queen';
                } else if (number == 13) {
                    return 'King';
                }

            }
        };
        function isEmpty(value) {
            return angular.isUndefined(value) || value === '' || value === null || value !== value;
        }
