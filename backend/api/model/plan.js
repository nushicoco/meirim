'use strict';
const Checkit = require('checkit');
const Bluebird = require('bluebird');
const Model = require('./base_model');
const Bookshelf = require('../service/database').Bookshelf;
const Knex = require('../service/database').Knex;
const Log = require('../service/log');
const Exception = require('./exception');

class Plan extends Model {
  get rules() {
    return {
      sent: 'integer',
      mavat_object_id: [
        'required', 'integer',
      ],
      mavat_county_name: 'string',
      mavat_pl_number: 'string',
      mavat_pl_name: 'string',
      // PLAN_CHARACTOR_NAME: 'string',
      data: ['required'],
      geom: ['required', 'object'],

    };
  }

  defaults() {
    return { sent: 0 };
  }

  format(attributes) {
    if (attributes.data) {
      attributes.data = JSON.stringify(attributes.data);
    }
    return super.format(attributes);
  }

  //
  parse(attributes) {
    try {
      if (attributes.data) {
        attributes.data = JSON.parse(attributes.data);
      }

    } catch (e) {
      Log.error('Json parse error', attributes.data);
    }

    return super.parse(attributes);
  }

  get geometry() {
    return ['geom'];
  }

  get tableName() {
    return 'plan';
  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }

  _saving(model, attrs, options) {
    // return new Checkit(model.rules).run(model.attributes);
  }

  canRead(session) {
    return Bluebird.resolve(this);
  }

  static canCreate(session) {
    throw new Exception.notAllowed('This option is disabled');
  }

  static maekPlansAsSent(plan_ids) {
    return new Plan().query(qb => {
      qb.whereIn('id', plan_ids);
    }).save({
      sent: '2',
    }, { method: 'update' });
  }

  static fetchByObjectID(objectID) {
    return Plan.forge({ 'mavat_object_id': objectID }).fetch();
  }

  static buildFromIPlan(iPlan) {
    return Plan.forge({
      'mavat_object_id': iPlan.properties.OBJECTID,
      'mavat_county_name': iPlan.properties.PLAN_COUNTY_NAME || '',
      'mavat_pl_number': iPlan.properties.PL_NUMBER || '',
      'mavat_pl_name': iPlan.properties.PL_NAME || '',
      // 'PLAN_CHARACTOR_NAME': iPlan.properties.PLAN_CHARACTOR_NAME || '',
      'data': iPlan.properties,
      'geom': iPlan.geometry,
      'PLAN_CHARACTOR_NAME': '',
      'plan_url': iPlan.properties.PL_URL
    });
  }

  static setMavatData(plan, mavanData) {
    return plan.set({
      goals_from_mavat: mavanData.goals,
      main_details_from_mavat: mavanData.mainPlanDetails
    })
  }

  static getUnsentPlans(userOptions) {
    let options = userOptions
      ? userOptions
      : {};
    if (!options.limit) {
      options.limit = 1;
    }
    options.limit = 1;
    return Plan.query((qb) => {
      qb.where('sent', '=', '0');
      if (options.OBJECTID) {
        qb.where('OBJECTID', '=', options.OBJECTID);
      }
    }).fetchPage({
      pageSize: options.limit,
      columns: ['id', 'data', 'goals_from_mavat', ' 	main_details_from_mavat', Knex.raw('X(st_centroid(geom)) as lon'), Knex.raw('Y(st_centroid(geom)) as lat')],
    });
  }
};
module.exports = Bookshelf.model('plan', Plan);
