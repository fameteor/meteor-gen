Template.OutilsVersion.created = function (){
    var self = this;
    self.version = new ReactiveVar("En attente des informations de version...");
    Meteor.call('getVersion', function (err, asyncValue) {
        if (err) {
            self.version.set(err.reason);
        }
        else {
            self.version.set(asyncValue);
        }
    });
}

Template.OutilsVersion.helpers({
    version() {
        return JSON.stringify(Template.instance().version.get(), null, 4);
    }
});
