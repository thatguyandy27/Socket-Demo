'use strict';

describe('Service: socketService', function () {

  // load the service's module
  beforeEach(module('blogApp'));

  // instantiate service
  var socketService;
  beforeEach(inject(function (_socketService_) {
    socketService = _socketService_;
  }));

  it('should do something', function () {
    expect(!!factoryTest).toBe(true);
  });

});
