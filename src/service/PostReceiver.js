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

    self.ref.startAt(self.lastKey).on('child_added', function (snapshot) {
      var post = snapshot.val()
      post.key = snapshot.key
      self.onChildAdded(snapshot.key, post)
    })
  }
}
