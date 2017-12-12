'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Model = require("./base_model");
const Person = require("./person");
const Crypt = require('../helpers/crypt');
const Bookshelf = require('../service/database').Bookshelf;
const Knex = require('../service/database').Knex;
const Geocoder = require("../service/geocoder").geocoder;
const DegreeToMeter = require("../service/geocoder").degreeToMeter;
const Exception = require('./exception');
class Alert extends Model {
  get rules() {
    return {
      person_id: [
        'required', 'integer'
      ],
      address: [
        'required', 'string'
      ],
      geom: [
        'required', 'object'
      ],
      radius: ['required', 'number']
    }
  }
  defaults() {
    return {radius: 5}
  }

  get geometry() {
    return ['geom'];
  }

  get tableName() {
    return 'alert';
  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }
  _saving(model, attrs, options) {
    return Geocoder.geocode(model.get("address")).then(res => {
      let box = [];
      let km = 1000;
      let radius = model.get("radius")* km;
      box.push(DegreeToMeter(res[0].longitude, res[0].latitude, radius, radius));
      box.push(DegreeToMeter(res[0].longitude, res[0].latitude, -radius, radius));
      box.push(DegreeToMeter(res[0].longitude, res[0].latitude, -radius, -radius));
      box.push(DegreeToMeter(res[0].longitude, res[0].latitude, radius, -radius));
      box.push(box[0]);

      model.set("geom", {
        "type": "Polygon",
        "coordinates": [box]
      });
      model.set("address", res[0].formattedAddress);
      return new Checkit(model.rules).run(model.attributes);
    })
  }

  canRead(session) {
    if (!session.person) {
      throw new Exception.notAllowed("Must be logged in");
    }
    return this.fetch().then((alertModel) => {
      if (alertModel.get("person_id") !== session.user) {
        throw new Exception.notAllowed("You cannot read this alert");
      }
      return alertModel;
    });
  }
  static canCreate(session) {
    if (!session.person) {
      throw new Exception.notAllowed("Must be logged in");
    }
    return Promise.resolve(this);
  }

  getCollection() {
    return this.collection().query('where', {person_id: this.get("person_id")}).fetch();
  }

  unsubscribeAlertToken(person_email) {
      let data = this.get('person_id')+"_"+this.get('id')+"_"+person_email;
      // this.getUserEmailById(this.get('person_id')).then(res => {
      // let data = this.get('person_id')+"_"+this.get('id')+"_"+res;
      let token = Crypt.encrypt(data);
      return new Buffer(token).toString('base64');
      // });

  }

    // getUserEmailById(person_id) {
    //
    //     return Person.collection().query((qb) => {
    //         qb.innerJoin('alert', 'alert.person_id', 'person.id')
    //             .where("person.id", "=", person_id)
    //             .groupBy("person.id")
    //     }).fetch().then(person=>{
    //         return person[0].get('email');
    //     });

        // return Alert.forge({
        //     "person_id":person_id
        // }).fetch().then(alert=>{
        //     if (!alert){
        //         Log.debug("resetPasswordByToken:Person",parts[0], "not found");
        //         throw new Exception.badRequest("Invalid token");
        //     }
        //     alert.set("address",'test');
        //     return alert.save();
        // }).then(alert=>{
        //     return alert.get('address');
        // });
    // }

    static removeAlertbyToken(token) {
        let details = Crypt.decrypt(new Buffer(token, 'base64').toString('ascii'));
        let parts = details.split("_");
        if (parts.length !== 3){
            throw new Exception.badRequest("Invalid token");
        }
        this.query(qb => { qb.whereIn('id', parts[1]) }).destroy().then(() => {
            return true;
        });
    }

  static getUsersByGeometry(plan_id) {
    return Person.collection().query((qb) => {
      qb.innerJoin('alert', 'alert.person_id', 'person.id')
        .innerJoin('plan', Knex.raw("ST_Intersects(plan.geom,alert.geom)"))
        .where("plan.id", "=", plan_id)
        .groupBy("person.id")
    }).fetch();
  }
};
module.exports = Bookshelf.model('alert', Alert);
