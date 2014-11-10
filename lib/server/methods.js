// Generated by CoffeeScript 1.7.1
(function() {
  var adminEmails, email;

  Meteor.methods({
    adminInsertDoc: function(doc, collection) {
      var Future, fut;
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        Future = Npm.require('fibers/future');
        fut = new Future();
        global[collection].insert(doc, function(e, _id) {
          return fut['return']({
            e: e,
            _id: _id
          });
        });
        return fut.wait();
      }
    },
    adminUpdateDoc: function(modifier, collection, _id) {
      var Future, fut;
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        Future = Npm.require('fibers/future');
        fut = new Future();
        global[collection].update({
          _id: _id
        }, modifier, function(e, r) {
          return fut['return']({
            e: e,
            r: r
          });
        });
        return fut.wait();
      }
    },
    adminRemoveDoc: function(collection, _id) {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        if (collection === 'Users') {
          return Meteor.users.remove({
            _id: _id
          });
        } else {
          return global[collection].remove({
            _id: _id
          });
        }
      }
    },
    adminNewUser: function(doc) {
      var emails;
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        emails = doc.email.split(',');
        return _.each(emails, function(email) {
          var user, _id;
          user = {};
          user.email = email;
          if (!doc.chooseOwnPassword) {
            user.password = doc.password;
          }
          _id = Accounts.createUser(user);
          if (doc.sendPassword && typeof AdminConfig.fromEmail !== 'undefined') {
            return Email.send({
              to: user.email,
              from: AdminConfig.fromEmail,
              subject: 'Your accout has been created',
              html: 'You\'ve just had an account created for ' + Meteor.absoluteUrl() + ' with password ' + doc.password
            });
          }
        });
      }
    },
    adminUpdateUser: function(modifier, _id) {
      var Future, fut;
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        Future = Npm.require('fibers/future');
        fut = new Future();
        Meteor.users.update({
          _id: _id
        }, modifier, function(e, r) {
          return fut['return']({
            e: e,
            r: r
          });
        });
        return fut.wait();
      }
    },
    adminSendResetPasswordEmail: function(doc) {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        console.log('Changing password for user ' + doc._id);
        return Accounts.sendResetPasswordEmail(doc._id);
      }
    },
    adminChangePassword: function(doc) {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        console.log('Changing password for user ' + doc._id);
        Accounts.setPassword(doc._id, doc.password);
        return {
          label: 'Email user their new password'
        };
      }
    },
    adminCheckAdmin: function() {
      if (!this.userId) {
        console.error("check admin, no user");
      }
    }
  }, this.userId && !Roles.userIsInRole(this.userId, ['admin']) ? (email = Meteor.users.findOne({
    _id: this.userId
  }).emails[0].address, typeof AdminConfig !== 'undefined' && typeof AdminConfig.adminEmails === 'object' ? (adminEmails = AdminConfig.adminEmails, adminEmails.indexOf(email) > -1 ? (console.log('Adding admin user: ' + email), Roles.addUsersToRoles(this.userId, ['admin'])) : void 0) : this.userId === Meteor.users.findOne({}, {
    sort: {
      createdAt: 1
    }
  })._id ? (console.log('Making first user admin: ' + email), Roles.addUsersToRoles(this.userId, ['admin'])) : void 0) : void 0, {
    adminAddUserToRole: function(_id, role) {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        return Roles.addUsersToRoles(_id, role);
      }
    },
    adminRemoveUserToRole: function(_id, role) {
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        return Roles.removeUsersFromRoles(_id, role);
      }
    }
  });

}).call(this);

//# sourceMappingURL=methods.map