// ==============================================
// BeforeHooks
////////////////
// ==============================================
var IR_BeforeHooks = {
	/*
    isLoggedIn: function(pause) {
        if (!(Meteor.loggingIn() || Meteor.user())) {
          Notify.setError(__('Please login.'));
          this.render('login');
          pause();
        }
    },
    somethingForAnyRoute: function() { ... },
    ...
    // add more before hooks here
	*/
}

/*
// (Global) Before hooks for any route
Router.onBeforeAction(IR_BeforeHooks.somethingForAnyRoute);
...

// Before hooks for specific routes
// Must be equal to the route names of the Iron Router route map
Router.before(IR_BeforeHooks.isLoggedIn, {only: ['userAreaA', 'userAreaB']});
...
*/

// ==============================================
// After Hooks
// ==============================================

// Hooks definitions
var ironRouterAfterHooks = {
	// Scroll-up on new routes ------------------
    "scrollUp": function() {
		// En dehors des menus ajouter et modifier, on force l'affichage du début de page
		if ((Router.current().lookupTemplate().indexOf("Ajouter") == -1) && (Router.current().lookupTemplate().indexOf("Modifier") == -1))   $('body,html').scrollTop(0);
    },
}

// After hooks for any routes
Router.onAfterAction(ironRouterAfterHooks.scrollUp);
