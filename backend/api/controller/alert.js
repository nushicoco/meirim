'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Alert = require("../model/alert");
const Email = require("../service/email");
const Exception = require("../model/exception");
const _ = require('lodash');
class AlertController extends Controller {
  create(req, res, next) {
    return super.create(req, res, next).then(savedModel=>{
        return Email.newAlert(req.session.person ,savedModel);
    });
  }
  delete(req, res, next) {
      if (!req.body.token) {
          throw new Exception.badRequest("No token provided");
      }
      return Alert.removeAlertbyToken(req.body.token);
  }
}

const controller = new AlertController(Alert);
Router.get('/', (req, res, next) => {
  controller.wrap(_.bind(controller.browse, controller))(req, res, next);
});
Router.post('/', (req, res, next) => {
  controller.wrap(_.bind(controller.create, controller))(req, res, next);
});
// Router.delete('/:alert_id', (req, res, next) => {
//   controller.wrap(_.bind(controller.delete, controller))(req, res, next);
// });
Router.delete('/', (req, res, next) => {
  controller.wrap(_.bind(controller.delete, controller))(req, res, next);
});
module.exports = Router;
