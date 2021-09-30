/* eslint-disable no-undef */
import * as db from './db.js';

describe('Initialize database'), () => {
  test("it should start cron job"), () => {
    expect(db.init()).toMatchSnapshot();
  }
}