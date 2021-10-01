import { listTrafficAreas, getMessages } from '../src/lib/srAPI.js';
import * as api from '../src/lib/api.js';

import assert from 'assert';

describe('SR API', function() {
  describe('List traffic areas', function() {
    it('should return a list of valid traffic areas', async function() {
        let response = await listTrafficAreas()
        let areas = response.areas
        assert.equal(Array.isArray(areas), true, 'Areas not present')
        areas.forEach(area => {
            assert.equal('name' in area, true, 'name not present')
            assert.equal('zoom' in area, true, 'zoom not present')
            assert.equal('radius' in area, true, 'radius not present')
            assert.equal('trafficdepartmentunitid' in area, true, 'trafficdepartmentunitid not present')
        })
    });
  });
  describe('Get messages from area', function() {
    it('should return a list of messages from the area, either empty or with valid objects', async function() {
        let response = await getMessages('kristianstad')
        let messages = response.messages
        assert.equal(Array.isArray(messages), true)
        messages.forEach(message => {
            assert.equal(typeof message.id, 'number')
            assert.equal((message.priority>0) && (message.priority <= 5), true)
            assert.equal('createddate' in message, true)
            assert.equal('exactlocation' in message, true)
            assert.equal('description' in message, true)
            assert.equal('latitude' in message, true)
            assert.equal('longitude' in message, true)
            assert.equal('category' in message, true)
            assert.equal('subcategory' in message, true)
            assert.equal('title' in message, true)
        })
    });
  });
});

describe('API', function() {
    describe('Subscribe user', function() {
        it('should successfully subscribe email', function() {
            api.addSubscriber('demo@demo.com', 'Kristianstad').then(res => {
                assert.equal(res.data.success, true)
            }).catch(err => {
                assert.doesNotMatch(err.data.success, true)
            })
            
        });
        it('should reject invalid email', function() {
            api.addSubscriber('invalid@com').then(res => {
                assert.doesNotMatch(res.data.success, true)
            }).catch(err => {
                assert.equal(err.data.success, false)
            })
        });
        it('should delete subscriber', function() {
            api.deleteSubscriber('demo@demo.com').then(res => {
                console.log(res.data)
                assert.equal(res.data.success, true)
            })
        });
        it('should skip delete if email does not exist', function() {
            api.deleteSubscriber('demo.not.existing@demo.com').then(res => {
                assert.equal(res.data.success, false)
            })
        });
    });
});