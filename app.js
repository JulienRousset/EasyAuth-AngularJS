'use strict';

angular.module('components', []); /// Je crée ma boite composant 

angular.module('services', []); 

angular.module('app', ['components', 'services', 'ngCookies']);  // je déclare test dans mon dossier maboite qui ce trouve dans components
