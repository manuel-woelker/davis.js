module("Davis.router")

test("looking up a route", function () {
  var router = factory('router')

  var getRoute = router.get('/foo'),
      postRoute = router.post('/foo')

  equal(router.lookupRoute('get', '/foo'), getRoute, 'should match routes based on method and path')
  equal(router.lookupRoute('post', '/foo'), postRoute, 'should match routes based on method and path')
})

test("shortcuts for verbs", function () {
  var router = factory('router')

  same(router.get('/foo').method, /^get$/i)
  same(router.post('/foo').method, /^post$/i)
  same(router.put('/foo').method, /^put$/i)
  same(router.del('/foo').method, /^delete$/i)
})

test("keeping a collection of before filters", function () {
  var router = factory('router')

  var beforeFilter = router.before($.noop)
  equal(router.lookupBeforeFilter().length, 1, "should keep a collection of every before filter")
})

test("keeping a collection of after filters", function () {
  var router = factory('router')

  var afterFilter = router.after($.noop)
  equal(router.lookupAfterFilter().length, 1, "should keep a collection of every before filter")
})

test("looking up a before filter with no path condition", function () {
  var router = factory('router')
  var filters = router.lookupBeforeFilter('get', '/foo')
  var callbackCalled = false;

  empty(filters, "should return an empty array if there are no filters")

  var beforeFilter = router.before(function () {
    callbackCalled = true;
  });

  var filters = router.lookupBeforeFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(beforeFilter, filters[0], "should return the filter that was added")

  beforeFilter.run({path: ""})

  ok(callbackCalled, "calling the route shoul invoke its callback")
})

test("looking up a before filter with a path condition", function () {
  var router = factory('router')
  var filters = router.lookupBeforeFilter('get', '/foo')
  var callbackCalled = false;

  empty(filters, "should return an empty array if there are no filters")

  var beforeFilter = router.before('/foo', function () {
    callbackCalled = true;
  });

  filters = router.lookupBeforeFilter('get', '/bar')
  empty(filters, "should return an empty array if the filter doesn't match")

  filters = router.lookupBeforeFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(beforeFilter, filters[0], "should return the filter that was added")

  beforeFilter.run({path: ""})

  ok(callbackCalled, "calling the route should invoke its callback")
})

test("looking up a after filter with no path condition", function () {
  var router = factory('router')
  var filters = router.lookupAfterFilter('get', '/foo')
  var callbackCalled = false;

  equal(filters.length, 0, "should return an empty array if there are no filters")

  var afterFilter = router.after(function () {
    callbackCalled = true;
  });

  var filters = router.lookupAfterFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(afterFilter, filters[0], "should return the filter that was added")

  afterFilter.run({path: ""})

  ok(callbackCalled, "calling the route shoul invoke its callback")
})

test("looking up a before filter with a path condition", function () {
  var router = factory('router')
  var filters = router.lookupAfterFilter('get', '/foo')
  var callbackCalled = false;

  empty(filters, "should return an empty array if there are no filters")

  var afterFilter = router.after('/foo', function () {
    callbackCalled = true;
  });

  filters = router.lookupAfterFilter('get', '/bar')
  empty(filters, "should return an empty array if the filter doesn't match")

  filters = router.lookupAfterFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(afterFilter, filters[0], "should return the filter that was added")

  afterFilter.run({path: ""})

  ok(callbackCalled, "calling the route should invoke its callback")
})

test("registering a state", function () {
  var router = factory('router')
  var state = router.state('/foo/:id', $.noop)

  same(state, router.lookupRoute('state', '/foo/1'), "should store states as routes")
})

test("transitioning to a state", function () {
  var router = factory('router'),
      req

  Davis.history.onChange(function (r) {
    req = r
    start()
  })

  stop()
  router.trans('/blah/2')
  equal("/blah/2", req.path)
})

test("methods should be case insensitive", function () {
  var router = factory('router')

  var route = router.get('/foo', $.noop)

  same(route, router.lookupRoute('GET', '/foo'), "should match regardless of the case of the route method")
})

test("path should be case insensitive", function () {
  var router = factory('router')

  var route = router.get('/foo', $.noop)

  same(route, router.lookupRoute('get', '/FOO'), "should match regardless of the case of the route path")
})