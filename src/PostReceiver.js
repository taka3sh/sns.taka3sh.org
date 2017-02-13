export var PostReceiver = {
  init: function (ref) {
    PostReceiver.ref = ref
  },

  loadAll: function () {
    return PostReceiver.ref.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        PostReceiver.lastKey = childSnapshot.key
        PostReceiver.onChildAdded(childSnapshot.key, childSnapshot.val())
      })
    })
  },

  listen: function () {
    PostReceiver.ref.startAt(PostReceiver.lastKey).on('child_added', function (snapshot) {
      PostReceiver.onChildAdded(childSnapshot.key, childSnapshot.val())
    })
  }
}
