'use strict';

var Actions  = require ('../actions/actionTypes').default;

var loginReducer = function(state, action) {

    switch (action.type){
        case Actions.LOGIN_SUCCESS:
            var stateCopy =Object.assign({}, state );
            console.log("action data", action);
            stateCopy.response = "success";
            stateCopy.user = "test";
            return stateCopy;

        case Actions.LOGIN_ERROR:
            var stateCopy =Object.assign({}, state );
            stateCopy.response = "ההתחברות נכשלה, אנא נסה/י שנית";
            return stateCopy;

        default:
            return state || {};
    }

};

module.exports = loginReducer;
