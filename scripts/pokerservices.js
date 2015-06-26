
poker.factory('Player',function() {
    function Player(pot) {
        this.id=0;
        this.bet=0;
        this.canbet=false;
        this.active=true;
        this.pot = parseInt(pot);
        this.handcards = [];
        this.handrankvalue=0;
        this.handrankmsg="";
        this.cardhidden=true;
        this.action="check";
        this.ishuman=true;
    }

    Player.prototype = {

        dealhand: function(deck) {

            if(this.handcards.length>=0){
                handcards=this.handcards}
            else{
                var handcards = [];
            }
            var i;
            cardstodeal = 5 - handcards.length;
            length=handcards.length;
            if (cardstodeal >= 0&&deck.length>=5) {
                for (i = 0; i < cardstodeal; i++) {
                    handcards[handcards.length++] = deck[deck.length - 1];
                    deck.pop();
                }
            }
            return handcards;

        }};

    return (Player);
});
//display cards in a cards-css proper style
poker.service("Round",['Game','Deck',function(Game,Deck) {


    return{
        init: function () {

            this.count = 0;
            this.description = "Round start";
            this.minbet = 0;
            this.turn = 0;
            this.activeplayers = [];
            this.playershaveplayed = 0;
            this.pot = 0;
            this.bet = false;
        },

        startnextround: function () {
            //  this.count.increase();
            if(this.count==0) {

                this.description = "All players must pay the ante price " + Game.getante() + ' \u20AC';

                this.minbet = 0;
                this.turn = 0;
                this.activeplayers = [];
                this.playershaveplayed = 0;
                this.pot = 0;
                this.bet = false;


                Deck.deal();
                Deck.shuffle();
                var players = Game.players.length;
                for (var i = 0; i < players; i++) {
                    Game.players[i].handcards = [];

                    Game.players[i].bet = 0;
                    //collect buy ins if layers have money
                    if (Game.players[i].pot > Game.ante) {
                        Game.pot = Game.pot + Game.ante;
                        Game.players[i].pot = Game.players[i].pot - Game.ante;
                        //make all players active if they have money
                        this.activeplayers.push(i);
                    }

                }
                return;
            }

            if (this.count == 1) {
                this.description = "Place your bets";

                this.minbet = 0;
                var activeplayers=this.activeplayers.length;
                for (var i = 0; i < this.activeplayers.length; i++) {

                    // deal hidden cards for all players
                    Game.players[this.activeplayers[i]].cardhidden = true;
                    Game.players[this.activeplayers[i]].handcards = Game.players[this.activeplayers[i]].dealhand(Deck.deck);
                    sorting(Game.players[this.activeplayers[i]].handcards);


                }
                //reveal cards of first player
                Game.players[this.activeplayers[0]].cardhidden = false;

                Game.players[this.turn].canbet = true;
                this.increase();
                this.bet = true;
                return;
            }
            if (this.count == 3) {
                this.turn = 0;
                this.bet = false;
                this.playershaveplayed = 0;
                this.description = "Select 1-5 cards to discard";
                Game.players[this.activeplayers[0]].cardhidden = false;
                return;
            }
            if (this.count == 4) {
                this.minbet = 0
                for (i = 0; i < this.activeplayers.length; i++) {
                    Game.players[this.activeplayers[i]].dealhand(Deck.deck);

                }
                this.bet = true;
                this.playershaveplayed = 0;
                this.pot = 0;
                this.description = "place your bets again";
                Game.players[this.activeplayers[0]].canbet = true;
                return;
            }

            if (this.count == 5) {

                this.bet = false;
                var ranks = [];
                activeplayers = this.activeplayers.length;

                // get players and their id and sort them
                for (i = 0; i < activeplayers; i++) {
                    Game.players[this.activeplayers[i]].cardhidden = false;
                    Game.players[[this.activeplayers[i]]].handrankmsg = Game.rankhand(Game.players[this.activeplayers[i]].handcards).msg;
                    Game.players[[this.activeplayers[i]]].handrankvalue = Game.rankhand(Game.players[this.activeplayers[i]].handcards).value;
                    ranks[i] = {id: this.activeplayers[i], value: Game.players[[this.activeplayers[i]]].handrankvalue};
                }
                ranks.sort(function (a, b) {
                    return (b.value > a.value) ? 1 : ((a.value > b.value) ? -1 : 0);
                });
                console.log(ranks);
                console.log(Game.players);

                var tie = 0; //number of players wih equal value

                for (i = 0; i < ranks.length - 1; i++) {
                    if (ranks[i].value == ranks[i].value + 1) {
                        tie++;
//                        this.description = "its a tie";
                    }
                }

                if (tie > 0) {
                    var tiepot = Game.pot / tie;
                    for (var i = 0; i <= tie; i++) { //deliver equal pieces of the pot
                        Game.players[ranks[i].id].pot = Game.players[ranks[i].id].pot + tiepot;
                    }

                }
                if (tie == 0) {
                    Game.players[ranks[0].id].pot = Game.pot + Game.players[ranks[0].id].pot;

                    this.description = Game.players[ranks[0].id].name + " is the winner with " + Game.players[ranks[0].id].handrankmsg;

                }
                Game.pot = 0;

            }


        },



        getcount:function(){return this.count},
        increase : function () {
            if(this.count+1>5){
                this.count=0;
                return this.count;
            }
            this.count = this.count + 1;
            return this.count;
        },

        //in the following functions if you want the bank to be an active player replace length-1 with length
        increaseturn : function () {

            if (this.turn+1 >= this.activeplayers.length-1) {
                this.turn = 0;
                return this.turn;
            }
            this.turn = this.turn + 1;
            return this.turn;
        },
        nextbet:function(player){
            player.canbet=false;
            player.cardhidden=true;
            this.turn=this.increaseturn();
            if(this.activeplayers[this.turn]!=Game.players.length-1){
                Game.players[this.activeplayers[this.turn]].cardhidden = false;
            }
            Game.players[this.activeplayers[this.turn]].canbet = true;

        },
        nextdraw:function(player){
            player.cardhidden=true;

            this.turn=this.increaseturn();
            if(this.activeplayers[this.turn]!=Game.players.length-1){
                Game.players[this.activeplayers[this.turn]].cardhidden = false;
            }},
        discard:function(player){
            this.playershaveplayed=this.playershaveplayed+1;
            this.nextdraw(player);

            if (this.playershaveplayed==this.activeplayers.length-1){
                this.increase();
                this.startnextround();
            }


        }


    }
}]);
poker.service('Deck',function() {
    return{
        init:function(){
            var deck=[];
            this.deck=deck;
        },
        deal: function () {
            if (this.deck && this.deck.length>0){this.deck=[];}
            var deck = [];
            var rank = ['14', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
            var suit = ['spades', 'hearts', 'clubs', 'diamonds'];

            var sl = suit.length;
            var rl = rank.length;
            var i = 0; //deck counter
            for (var j = 0; j < sl; j++) {
                for (var k = 0; k < rl; k++) {

                    deck[i] = {rank: rank[k], suit: suit[j]};
                    i++;
                }
            }
            this.deck = deck;
        },
        shuffle: function () {

            deck = this.deck;
            var k, i;
            var dl = this.deck.length - 1;
            for (i = 0; i <= dl; i++) {
                k = Math.floor(Math.random() * this.deck.length);
                temp = this.deck[i];
                this.deck[i] = this.deck[k];
                this.deck[k] = temp;
            }
        },
        getdeck:function(){return this.deck}
    }
});
poker.service('Game', ['Player',function(Player,Round) {



    return{



        init:function(){
            var players=[];
            this.players=players;
            this.ante = 80;
            this.pot=0;
        },
        addplayer:function(player){



            this.players.push(player);
        },
        removeplayer:function(player){
            this.players.splice(this.players.indexOf(player),1)
        },
        clearplayers:function(){

            var length=this.players.length;
            for(var i=0;i<length;i++){this.players.pop();}
        },
        getplayers:function(){return this.players},
        getante:function(){return this.ante},
        setante:function(ante){this.ante=ante;},
        createplayers:function(n){
            n=3;
            for(var i=0;i<n-1;i++){
                var player=new Player(800);
                player.name='player '+(i+1);
                player.id=i;
                this.addplayer(player);
            }
            var player=new Player(800);
            player.name="bank";
            player.id=n-1;
            player.ishuman=false;
            this.addplayer(player);
        },
        rankhand:function(hand){

            var result={};
            result.value=0;
            result.msg="";



            var resultdigits=Math.pow(10,10);
            var handlength=hand.length;
            var hasstr8=straight(hand);//str8 flag
            var hasflush=flush(hand);// flush flag
            if(hasstr8 && hasflush && ( hand[handlength-1].rank==14) ){
                result.value=10*resultdigits;
                result.msg="you have a  flush royal of "+hand[0].suit;

                return result;}
            if(hasstr8&&hasflush) {
                result.value=9*resultdigits+hand[handlength-1].rank*resultdigits/100;
                result.msg="you have a  flush straight of "+hand[0].suit+" with "+rankproperdisplay(hand[handlength-1].rank)+"  high";
                return result;
            }




            var kind4=kind(4,hand);//4 of a kind flag
            if(kind4){
                for(var i=0;i<handlength;i++){
                    if(hand[i].rank!=kind4){
                        kicker=hand[i].rank;
                        break;
                    }
                }
                result.value=8*resultdigits+kind4*resultdigits/100+kicker*resultdigits/10000;
                result.msg="you have 4 of "+rankproperdisplay(kind4)+" and "+rankproperdisplay(kicker);
                return result;
            }
            var kind3=kind(3,hand); //3 of a kind flag
            var kind2=kind(2,hand); //2 of a kind flag
            if(kind2 && kind3){
                result.msg="full house "+rankproperdisplay(kind3)+"s over "+rankproperdisplay(kind2)+"s";
                result.value=7*resultdigits+(resultdigits/100)*kind3+(resultdigits/10000)*kind2;
                return result;
            }

            if(hasflush){

                result.value=6*resultdigits;

                result.msg="flush of "+hand[0].suit;

                j=1;
                for(i=handlength-1;i>=0;i--){

                    result.value=result.value+hand[i].rank*(resultdigits/(Math.pow(10,2*j)));
                    j++;


                }
                result.value=parseInt(result.value);
                return result;
            }

            if(hasstr8){
                result.value=resultdigits*5+(resultdigits/100)*hand[4].rank;
                result.msg=rankproperdisplay(hand[4].rank)+" high straight";

                return result;
            }

            if(kind3){//check for three of a kind
                result.msg="Three of "+kind3;
                result.value=resultdigits*4+(resultdigits/100)*kind3;
                var j=2;
                for(i=handlength-1;i>=0;i--){
                    if(hand[i].rank!=kind3){
                        result.value=result.value+hand[i].rank*(resultdigits/(Math.pow(10,2*j)));
                        j++;
                    }
                }
                return result;
            }

            var pair2=twopair(hand);
            // check for two pair rank
            if(pair2){
                result.msg=rankproperdisplay(pair2[0])+"s"+"  and "+rankproperdisplay(pair2[1])+"s";
                var notpair=0;
                for(var i=0;i<handlength;i++){
                    if( (hand[i].rank!=pair2[0])&&(hand[i].rank!=pair2[1]) ){
                        notpair=hand[i].rank;
                        break;
                    }}
                result.value=resultdigits*3+pair2[0]*(resultdigits/100)+pair2[1]*(resultdigits/10000)+notpair*(resultdigits/1000000);
                return result;

            }
            //check for one pair
            if(kind2){
                result.msg="Pair of "+rankproperdisplay(kind2);
                result.value=resultdigits*2+(resultdigits/100)*kind2;
                var j=2;
                for(i=handlength-1;i>=0;i--){
                    if(hand[i].rank!=kind2){
                        result.value=result.value+hand[i].rank*(resultdigits/(Math.pow(10,2*j)));
                        j++;
                    }
                }
                return result;
            }

            result.msg="high card "+rankproperdisplay(hand[handlength-1].rank);
            result.value=resultdigits*1;

            var j=1;
            for(i=handlength-1;i>=0;i--){

                result.value=result.value+hand[i].rank*(resultdigits/(Math.pow(10,2*j)));
                j++;

            }
            return result;
        }


    }




}]);
poker.service('Betting', ['Player','Round','Game',function(Player,Round,Game) {


    return{

        fold:function(player){



        player.canbet=false;
        player.active = false;
        player.handcards =[];
        //  player.handrankmsg="";
        //  player.handrankvalue=0;

        Round.activeplayers.splice(Round.activeplayers.indexOf(player.id),1);

        if(Round.activeplayers.length==1){ //if there is only one left

            winner=Game.players[Round.activeplayers[0]];
            winner.handrankmsg=Game.rankhand(winner.handcards).msg;
            winner.cardhidden=false;
            winner.pot=Game.pot+winner.pot;
            Game.pot=0;
            Round.name="Everybody folded";
            Round.count=6;
            Round.bet=false;
            Round.description=winner.name+" is the winner "+ winner.handrankmsg;
        }

        if(Round.activeplayers.length==2){Round.increase();//the bank doesn't bet so when length=2 there is no human opponent
            Round.startnextround();}



        if (Round.turn+1 >= Round.activeplayers.length-1){
            Game.pot=Round.pot+Game.pot;

        }


        else{
            Game.players[Round.activeplayers[Round.turn]].cardhidden = false;
            Game.players[Round.activeplayers[Round.turn]].canbet = true;}

    },

        checkcall: function (player) {





            //check
            Round.playershaveplayed = Round.playershaveplayed + 1
            if (player.bet == Round.minbet) {
                player.canbet = false;
                player.cardhidden = true;
                Round.turn = Round.increaseturn();

                if (Round.activeplayers.length > 2) {
                    Game.players[Round.activeplayers[Round.turn]].canbet = true;
                    Game.players[Round.activeplayers[Round.turn]].cardhidden = false;
                    ;
                }
            }
            //call
            if (player.bet < Round.minbet) {
                var mustpay = Round.minbet - player.bet;
                Round.pot = Round.pot + mustpay;
                player.pot = player.pot - mustpay;
                player.bet = mustpay;
                Round.nextbet(player);

            }

            if (Round.playershaveplayed >= Round.activeplayers.length - 1) {

                Game.pot = Game.pot + Round.pot;
                Round.pot = 0;
                for (i = 0; i < Game.players.length; i++) {
                    Game.players[i].bet = 0;
                    Game.players[i].canbet = false;
                    Game.players[i].cardhidden = true;

                }

                Round.increase();
                Round.startnextround();
            }


        }




    }
}

]);