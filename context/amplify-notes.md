// Default pattern
@auth(rules: [
  { allow: owner },            // user can manage their own content
  { allow: groups, groups: ["Admin"] } // optional admin override
])
# Most user-generated content
@auth(rules: [
  { allow: owner },
  { allow: groups, groups: ["Admin"] }
])
@model(subscriptions: null)
@auth(rules: [{ allow: groups, groups: ["Admin"] }])
@model
@auth(rules: [{ allow: owner }])
@softDelete
@index(name: "byUser", fields: ["userId"])
@index(name: "byRoom", fields: ["roomId"])
const storageKey = `media/${userId}/${uuid()}.jpg`
type Media @model {
  id: ID!
  ownerId: ID!
  storageKey: String! # S3 key
}
@function(name: "moderationHandler")
amplify/
  backend/
    api/
      schema.graphql
    function/
      moderationHandler/
      parentDigest/
  storage/
    media/