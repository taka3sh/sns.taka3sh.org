export default {
  init: function (ref) {
    this.ref = ref
  },

  loadAll: function () {
    var self = this

    return self.ref.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        self.lastKey = childSnapshot.key
        self.onChildAdded(childSnapshot.key, childSnapshot.val())
      })
    })
  },

  listen: function () {
    var self = this

    self.ref.endAt(self.lastKey).on('child_added', function (snapshot) {
      self.onChildAdded(snapshot.key, snapshot.val())
    })
  }
}
