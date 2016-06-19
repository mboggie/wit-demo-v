'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
// const Wit = require('node-wit').Wit;
const Wit = require('node-wit').Wit;

const token = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const type = firstEntityValue(entities, 'account_type');
    if (type) {
      context.type = type;
    }

    const query = firstEntityValue(entities, 'account_query');
    if (query) {
      context.query = query;
    }
    
    const check_number = firstEntityValue(entities, 'check_number');
    if (check_number) {
      context.check_number = check_number;
    }
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['bankquery'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    switch (context.query) {
      case "balance":
        if (context.type){
          context.preface = "Your " + context.type + " account balance is ";
        }
        else {
          context.preface = "Your account balance is";
        }
        context.amount = "$304.50";
      break;
      case "withdrawal":
        if (context.type){
          context.preface = "The last withdrawal from your " + context.type + " account was for ";
        }
        else {
          context.preface = "The last withdrawal from your account balance was for ";
        }
        context.amount = "$27.95";
      break;
      case "deposit":
        if (context.type){
          context.preface = "The last deposit received in your " + context.type + " account was for ";
        }
        else {
          context.preface = "The last deposit received in your account was for ";
        }
        context.amount = "$202.50";
      break;
      case "check":
        if (context.check_number){
          context.preface = "Check number " + context.check_number + " was paid on June 13 in the amount of ";
          context.amount = "$84.76";
        }
        else {
          context.preface = "You did not provide a valid check number. Please try again.";
          context.amount = "";
        }
      break;
      default:
        context.preface = "I didn't understand what you said. Please try again.";
        context.amount = "";
      }
    cb(context);
  },
};

const client = new Wit(token, actions);
client.interactive();
