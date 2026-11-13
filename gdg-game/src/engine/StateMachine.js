/**
 * StateMachine — manages game states with enter/exit/update/render hooks.
 *
 * States: MENU, BRIEFING, ACTIVE_MISSION, AAR_SUMMARY, FAIL_SCREEN
 *
 * Each state is an object: { enter(), exit(), update(dt), render(ctx) }
 */
export class StateMachine {
  constructor() {
    /** @type {Object<string, {enter?: Function, exit?: Function, update?: Function, render?: Function}>} */
    this._states = {};
    /** @type {string|null} */
    this._currentKey = null;
  }

  /**
   * Register a named state with lifecycle hooks.
   * @param {string} key
   * @param {{enter?: Function, exit?: Function, update?: Function, render?: Function}} stateObj
   */
  add(key, stateObj) {
    this._states[key] = stateObj;
  }

  /**
   * Transition to a new state. Calls exit() on old, enter() on new.
   * @param {string} key
   * @param {*} [payload] - optional data passed to enter()
   */
  transitionTo(key, payload) {
    if (!this._states[key]) {
      console.error(`StateMachine: unknown state "${key}"`);
      return;
    }

    // Exit current state
    if (this._currentKey && this._states[this._currentKey]?.exit) {
      this._states[this._currentKey].exit();
    }

    const prev = this._currentKey;
    this._currentKey = key;

    // Enter new state
    if (this._states[key]?.enter) {
      this._states[key].enter(payload, prev);
    }
  }

  /** @returns {string|null} */
  get current() {
    return this._currentKey;
  }

  update(dt) {
    if (this._currentKey && this._states[this._currentKey]?.update) {
      this._states[this._currentKey].update(dt);
    }
  }

  render(ctx) {
    if (this._currentKey && this._states[this._currentKey]?.render) {
      this._states[this._currentKey].render(ctx);
    }
  }
}

