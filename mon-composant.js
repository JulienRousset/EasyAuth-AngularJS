'use strict';

angular.module('components').component("monComposant", {   /// je déclare mon component

  templateUrl: './mon-composant.html', // 

  bindings: {

    user: '<',
    error: '@',
    cookieUser: '<',
    cookieToken: '<',
    msgVerifToken: '<'

  },

  controller: ['NomService', '$cookies','$location', function (NomService, $cookies, $location) {

    var self = this;

    this.$onInit = () => { //On utlise OnInit pour que ce script charge une fois que tout le document est charger
      this.cookieUser = $cookies.get('id'); //On récupére le cookie si il existe
      this.cookieToken = $cookies.get('tokenSecure'); //On récupére le cookie si il existe
      console.log(this.cookieUser, this.cookieToken);
      VerificationConnection(this.cookieUser, this.cookieToken);
    }

    this.connection = (email, mdp) => { // on envoye les information qu'on a écrit dans les champs (ng-model)
      NomService.userConnect(email, mdp).then((response) => { // j'envoye mon email et mon mot de passe à mon service qui utilise la fonction UserConnecy
        self.user = response.data; // je récupère cest donné si les information son bonne
        SendCookie(response.data["0"].id); // j'envoye le cookie avec l'userId
      }).catch((response) => {
        self.error = response.statusText || "une erreur s'est produite pendant l'identification"; //en cas d'échec je marque un message d'erreur
      });
    }

    function SendCookie(id) { // on envoye le cookie avec l'id de connexion
      $cookies.put('id', '' + id + ''); // je crée mon cookie avec l'userId
      generatToken(id)
      self.cookieUser = $cookies.get('id'); //je déclare mon cookie dans une variable pour pouvoir faire des conditions trql
    };

    function DeleteCookie() { // on envoye le cookie avec l'id de connexion
      $cookies.remove('id');
      $cookies.remove('tokenSecure');
      $location.path("/index");
    };

    function generatToken(id) { // on va générer un token qui va servir de sécurité aux autre utilisateur
      self.tokenid = RandomTocken(); // on récupére le random générer
      var add = { // je crée une variable object pour l'ajouter dans ma db
        tokenSecure: self.tokenid //je crée ma colonne et son contenue
      };
      // ma promesse
      NomService.userTokenAdd(id, add).then((response) => { // j'envoye 
        $cookies.put('tokenSecure', '' + self.tokenid + ''); // je crée 
        self.cookieToken = $cookies.get(self.tokenid); //je déclare mon cookiel
      }).catch((response) => {
        self.error = response.statusText || "une erreur s'est produite pendant l'identification"; //en cas d'échec je marque un message d'erreur
      });
      // fin de la promesse

    };

    function RandomTocken() { // on génére notre random 
      return (Math.random() * 6000); // on génére un chiffre aléatoire
    };

    function VerificationConnection(userid, token) { 
      if (!userid) {
         $location.path("/index");
        DeleteCookie();
      }
      if (!token) {
         $location.path("/index");
        DeleteCookie();
      }
      console.log(token);
      NomService.verifToken(userid, token).then((response) => {
        if (response.data['0'].tokenSecure != token && response.data['0'].id != userid) {
          DeleteCookie();
           $location.path("/index");
        }

      }).catch((response) => {
         $location.path("/index");
        DeleteCookie();
      });


    };
  }]

});