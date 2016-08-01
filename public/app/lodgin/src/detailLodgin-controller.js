"use strict";
angular.module('lodgin').controller(
  'detailLodginController',
  [
    '$scope',
    'couchinnService',
    '$location',
    '$mdDialog',
    function ($scope, couchinnService, $location, $mdDialog) {

      console.log('se cargó el controller detailLodginController');
      $scope.lodgin = couchinnService.getLodgin();
      $scope.lodgin.fechaInicio = new Date($scope.lodgin.fechaInicio);
      $scope.lodgin.fechaFin = new Date($scope.lodgin.fechaFin);
      $scope.today = new Date();
      console.log(JSON.stringify($scope.lodgin));
      $scope.pregunta = {};
      $scope.respuestas = [
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ];

      couchinnService.getPreguntas($scope.lodgin)
        .then(function (preguntas) {
          $scope.preguntas = preguntas;
        });


      $scope.user = couchinnService.getUser();

      if (!$scope.user || $scope.user.username != $scope.lodgin.user.username) {
        $scope.notMyCouch = true;
      }
      else {
        $scope.notMyCouch = false;
      }


      $scope.calcularPromedio = function (lista) {
        var resultado = 0;
        if (lista.length == 0){
          return 'Sin calificacion'
        }
        else{
          for (var i in lista){
            resultado = resultado + lista[i];
          }
          return resultado/lista.length + '(votos: ' + lista.length + ')';
        };
      };

      $scope.calificarPublicacion = function (idx) {
        $scope.lodgin.solicitudCalificar = $scope.lodgin.applications[idx]._id;
        console.log('se va a calificar una publicacion:-----------');
        couchinnService.calificarPublicacion($scope.lodgin)
        .then(function (lodgin) {
          console.log('se califico la publicacion correctamente : ----------------');
          console.log(JSON.stringify(lodgin));
          $scope.lodgin = lodgin;
          $location.path('/detallar-publicacion');
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Calificar Publicacion')
            .textContent('La publicacion se califico correctamente')
            .ariaLabel('Alert Dialog Demo')
            .ok('Ok')
          );
        });
      };

      $scope.calificarHospedador = function (idx) {
        $scope.lodgin.solicitudCalificar = $scope.lodgin.applications[idx]._id;
        console.log('se va a calificar al hospedador:-----------');
        couchinnService.calificarHospedador($scope.lodgin)
         .then(function (lodgin) {
           console.log('se califico al hospedador correctamente : ----------------');
           console.log(JSON.stringify(lodgin));
           $scope.lodgin = lodgin;
           $location.path('/detallar-publicacion');
           $mdDialog.show(
             $mdDialog.alert()
               .parent(angular.element(document.querySelector('#popupContainer')))
               .clickOutsideToClose(true)
               .title('Calificar Hospedador')
               .textContent('El hospedador se califico correctamente')
               .ariaLabel('Alert Dialog Demo')
               .ok('Ok')
           );
         });
      };

      $scope.calificarHuesped = function (idx) {
        $scope.lodgin.solicitudCalificar = $scope.lodgin.applications[idx]._id;
        console.log('se va a calificar al huesped:-----------');
        couchinnService.calificarHuesped($scope.lodgin)
         .then(function (lodgin) {
           console.log('se califico al huesped correctamente : ----------------');
           console.log(JSON.stringify(lodgin));
           $scope.lodgin = lodgin;
           $location.path('/detallar-publicacion');
           $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Calificar Hospedador')
              .textContent('El huesped se califico correctamente')
              .ariaLabel('Alert Dialog Demo')
              .ok('Ok')
           );
         });
      };


      $scope.preguntar = function (idx) {
        console.log('se va a realizar una pregunta:-----------');
        $scope.pregunta.nombre = $scope.lodgin.nombre;
        $scope.pregunta.username = $scope.user.username;
        console.log(JSON.stringify($scope.pregunta));
        couchinnService.preguntar($scope.pregunta)
          .then(function (pregunta) {
            console.log('se pregunto correctamente : ----------------');
            console.log(JSON.stringify(pregunta));
            couchinnService.getPreguntas($scope.lodgin)
              .then(function (preguntas) {
                $scope.preguntas = preguntas;
              });
            $location.path('/detallar-publicacion');
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Preguntar sobre publicacion')
                .textContent('La pregunta se realizo correctamente')
                .ariaLabel('Alert Dialog Demo')
                .ok('Ok')
            );
          });
      };

      $scope.setPregunta = function (idx) {
        var preguntaContestar = $scope.preguntas[idx];
        console.log('se va a setear la publicacion a modificar:-----------');
        console.log(JSON.stringify(preguntaContestar));
        couchinnService.setPregunta(preguntaContestar)
          .then(function (pregunta) {
            console.log('se respondio correctamente : ----------------');
            console.log(JSON.stringify(pregunta));
            $location.path('/detallar-publicacion');
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Preguntar sobre publicacion')
                .textContent('La pregunta se realizo correctamenta')
                .ariaLabel('Alert Dialog Demo')
                .ok('Ok')
            );
          });
      };


      $scope.responder = function (respuesta) {
        console.log('se va a responder una pregunta:-----------');
        $scope.pregunta = $scope.getPregunta;
        $scope.pregunta.respuesta = respuesta;
        console.log(JSON.stringify($scope.pregunta1));
        couchinnService.responder($scope.pregunta1)
          .then(function (pregunta) {
            console.log('se respondio correctamente : ----------------');
            console.log(JSON.stringify(pregunta));
            $location.path('/detallar-publicacion');
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Preguntar sobre publicacion')
                .textContent('La pregunta se realizo correctamente')
                .ariaLabel('Alert Dialog Demo')
                .ok('Ok')
            );
          });
      };

      $scope.mandarRespuesta = function (pregunta, $index) {
        pregunta.respuesta = $scope.respuestas[$index];
        couchinnService.responder(pregunta)
          .then(function () {
            console.log('se respondio correctamente : ----------------');
            console.log(JSON.stringify(pregunta));
            $location.path('/detallar-publicacion');
            couchinnService.getPreguntas($scope.lodgin)
              .then(function (preguntas) {
                $scope.preguntas = preguntas;
              });
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Preguntar sobre publicacion')
                .textContent('La pregunta se realizo correctamente')
                .ariaLabel('Alert Dialog Demo')
                .ok('Ok')
            );
          }).catch(function () {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Error al mandar respuesta')
              .textContent('Error al mandar respuesta')
              .ariaLabel('Alert Dialog Demo')
              .ok('Reintentar')
          );
        })
      };


      $scope.damePreguntas = function () {
        console.log('se solicitan los tipos guardados:-----------');
        console.log(JSON.stringify($scope.preguntas));

        couchinnService.getPreguntas($scope.lodgin)
          .then(function (preguntas) {
            console.log('se obtuvieron los tipos: ----------------');
            console.log(JSON.stringify(preguntas));
            $scope.preguntas = preguntas;
            console.log($scope.preguntas);

          })
          .catch(function (error) {


            if (error.data.code == 11000) {
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title('Error al agregar tipo ')
                  .textContent('El nombre ya esta agregado: ')
                  .ariaLabel('Alert Dialog Demo')
                  .ok('Reintentar')
              );
            }
            console.log(error);
          });
      };


      $scope.application = {
        fechaFin: new Date($scope.lodgin.fechaFin),
        fechaInicio: new Date($scope.lodgin.fechaInicio)
      };

      $scope.solicitar = function (nombre) {

        if (!$scope.user) {
          $location.url('/#login');
          return;
        }

        if ($scope.lodgin.activa == "NO") {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Publicacion Anulada!! ')
              .textContent('Para poder realizar una Solicitud la Publicacion debe estar activa')
              .ariaLabel('Alert Dialog Demo')
              .ok('Continuar')
          );
          return;
        }

        if (!validateDates()) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Fecha No disponible ')
              .textContent('Revise las fechas que tiene disponible')
              .ariaLabel('Alert Dialog Demo')
              .ok('Continuar')
          );
          return;
        }

        $scope.application.nombre = nombre;
        $scope.application.username = $scope.user.username;

        couchinnService.solicitar($scope.application)
          .then(function(lodgin) {
          $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Felicitaciones, acabas de reservar este couch')
            .textContent('Un email será enviado a ' + $scope.user.username + ' detallando todos los datos de la reserva')
            .ariaLabel('Alert Dialog Demo')
            .ok('Seguir buscando otros couch')
        );
        $location.path('/user-logged/' + $scope.user.nombre);
      })
        .
        catch(function(err) {
          $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Hubo un error intentando solicitar este couch')
            .textContent('Un email será enviado a ' + $scope.user.username + ' detallando el error')
            .ariaLabel('Alert Dialog Demo')
            .ok('reintentar')
        );
      })
        ;

      };

      $scope.rechazar = function (application) {

        couchinnService.rechazarSolicitud(application)
          .then(function () {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Acabas de rechazar una solicitud')
                .textContent('Un email será enviado a ' + $scope.user.username + ' detallando el procedimiento')
                .ariaLabel('Alert Dialog Demo')
                .ok('Continuar')
            );
            $location.path('/user-logged/' + $scope.user.nombre);
          })
          .catch(function () {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Hubo un error intentando rechazar esta solicitud')
                .textContent('Un email será enviado a ' + $scope.user.username + ' detallando el error')
                .ariaLabel('Alert Dialog Demo')
                .ok('reintentar')
            );
          });

      };

      $scope.aceptar = function (application) {

        couchinnService.aceptarSolicitud(application)
          .then(function () {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Acabas de Aceptar una solicitud')
                .textContent('Un email será enviado a ' + $scope.user.username + ' detallando el procedimiento')
                .ariaLabel('Alert Dialog Demo')
                .ok('Continuar')
            );
            $location.path('/user-logged/' + $scope.user.nombre);
          })
          .catch(function (err) {
            var errorMsj = err.error || 'Un email será enviado a ' + $scope.user.username + ' detallando el error';
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Hubo un error intentando aceptar esta solicitud')
                .textContent(errorMsj)
                .ariaLabel('Alert Dialog Demo')
                .ok('reintentar')
            );
          });

      };


      var validateDates = function () {
        /*
         * @return Boolean
         */
        var result = true;

        var slectedRange = moment.range($scope.application.fechaInicio, $scope.application.fechaFin);

        $scope.lodgin.fechasReservadas
          .forEach(function (fechas) {
            var start = new Date(fechas.fechaInicio);
            var end = new Date(fechas.fechaFin);

            var unavailableRange = moment.range(start, end);

            if (slectedRange.overlaps(unavailableRange)) {
              result = false;
            }

          });

        return result;


      };


    }

  ]
);
