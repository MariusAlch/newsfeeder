/**
 * delete undeleted posts
 */
existing = db
  .getCollection("posts")
  .find({})
  .toArray()
  .map(_ => _._id);
all = db
  .getCollection("companies")
  .find({})
  .toArray()
  .map(_ => _.posts)
  .reduce((a, b) => a.concat(b), []);

toDelete = all.filter(_ => !existing.find(exis => exis.toString() === _.toString()));

db.getCollection("companies").update({}, { $pull: { posts: { $in: toDelete } } }, { multi: true });
