
var username="u5";
var email="u5@test.com";
var password="password1";
describe("User",function(){
	this.timeout(10000);
	it("Signing up",function(done){
		var user = new AV.User();
		user.set("username", username);
		user.set("password", password);
		user.set("email", email);
		user.set("gender", "female");
		// other fields can be set just like with Parse.Object
		user.set("phone", "415-392-0202");

		user.signUp(null, {
			success: function(user) {
		  		console.log(user)
		  		//expect(user.id).to.be.ok();
		  		done();
				// Hooray! Let them use the app now.
			},
			error: function(user, error) {
				// Show the error message somewhere and let the user try again.
		   		throw error;
			}
		});

	})


})

describe("UserSignin",function(){
	it("should login",function(done){
		AV.User.logIn(username, password, {
			success: function(user) {
		  		expect(user.get("username")).to.be(username);
		  		done();
				// Do stuff after successful login.
			},
			error: function(user, error) {
		  		throw eror;
				// The login failed. Check error to see why.
			}
		});

	})
})

describe("Current User",function(){
	it("return current",function(done){

		var currentUser = AV.User.current();

		expect(currentUser).to.be.ok();
		done();
	})
})

describe("User update",function(){
	it("update name",function(done){

		var user = AV.User.logIn(username, password, {
			success: function(user) {
				user.set("username", username);  // attempt to change username
				user.save(null, {
					success: function(user) {
		  				done();
						/*


						  var query = new AV.Query(AV.User);
						  query.get("516528fa30046abfb335f2da", {
						  success: function(userAgain) {
						  userAgain.set("username", "another_username");
						  userAgain.save(null, {
						  error: function(userAgain, error) {
		          		  done();
						  // This will error, since the Parse.User is not authenticated
						  }
						  });
						  },
						  error: function(err){
		      			  throw err;
						  }
						  });
						*/
					}
				});
			}
		});
	})
});

describe("User query",function(){
	it("return conditoinal users",function(done){
		var query = new AV.Query(AV.User);
		query.equalTo("gender", "female");  // find all the women
		query.find({
			success: function(women) {
				done()
			}
		});

	})
})


describe("Associations",function(){
	it("return post relation to user",function(done){
		var user = AV.User.current();

		// Make a new post
		var Post = AV.Object.extend("Post");
		var post = new Post();
		post.set("title", "My New Post");
		post.set("body", "This is some great content.");
		post.set("user", user);
		post.save(null, {
			success: function(post) {
				// Find all posts by the current user
				var query = new AV.Query(Post);
				query.equalTo("user", user);
				query.find({
					success: function(usersPosts) {
		      			expect(usersPosts.length).to.be.ok();
						done();
					},
					error:function(err){
		      			throw err;
					}
				});
			}
		});

	})
})


describe("Follow/unfollow users",function(){
	it("should follow/unfollow",function(done){
		var user = AV.User.current();
		user.follow('52f9be45e4b035debf88b6e2', {
			success: function(){
				var query = user.followeeQuery();
				query.find({
					success: function(results){
						expect(results.length).to.be(1);
						console.dir(results);
						expect(results[0].id).to.be('52f9be45e4b035debf88b6e2');
						var followerQuery = AV.User.followerQuery('52f9be45e4b035debf88b6e2');
						followerQuery.find().then(function(results){
							expect(results.length).to.be(1);
							console.dir(results);
							expect(results[0].id).to.be(user.id);
							//unfollow
							user.unfollow('52f9be45e4b035debf88b6e2').then(function(){
								//query should be emtpy
								var query = user.followeeQuery();
								query.find({
									success: function(results){
										expect(results.length).to.be(0);
										done();
									},
									error: function(err){
										throw err;
									}});
							}, function(err){
								throw err;
							});
						}, function(err){
							throw err;
						});
					},
					error: function(err){
						throw err;
					}
				});
			},
			error: function(err){
				throw err;
			}
		});
	});
})
