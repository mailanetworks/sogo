!function(){"use strict";function a(a,h){a.state("app",{url:"/addressbooks","abstract":!0,views:{addressbooks:{templateUrl:"UIxContactFoldersView",controller:"AddressBooksController",controllerAs:"app"}},resolve:{stateAddressbooks:b}}).state("app.addressbook",{url:"/:addressbookId",views:{addressbook:{templateUrl:"addressbook",controller:"AddressBookController",controllerAs:"addressbook"}},resolve:{stateAddressbook:c}}).state("app.addressbook.new",{url:"/{contactType:(?:card|list)}/new",views:{card:{templateUrl:"UIxContactEditorTemplate",controller:"CardController",controllerAs:"editor"}},resolve:{stateCard:d}}).state("app.addressbook.card",{url:"/:cardId","abstract":!0,views:{card:{template:"<ui-view/>"}},resolve:{stateCard:e},onEnter:f,onExit:g}).state("app.addressbook.card.view",{url:"/view",views:{"card@app.addressbook":{templateUrl:"UIxContactViewTemplate",controller:"CardController",controllerAs:"editor"}}}).state("app.addressbook.card.editor",{url:"/edit",views:{"card@app.addressbook":{templateUrl:"UIxContactEditorTemplate",controller:"CardController",controllerAs:"editor"}}}),h.otherwise("/addressbooks/personal")}function b(a){return a.$findAll(window.contactFolders)}function c(a,b,c,d){var e=_.find(d.$findAll(),function(a){return a.id==c.addressbookId});return e?(delete e.selectedCard,e.$reload(),e):a.reject("Addressbook "+c.addressbookId+" not found")}function d(a,b,c){var d="v"+a.contactType,e=new c({pid:a.addressbookId,c_component:d});return b.selectedCard=!0,e}function e(a,b,c){var d;return(d=_.find(c.$cards,function(a){return a.id==b.cardId}))?d.$reload():void a.go("app.addressbook")}function f(a,b){b.selectedCard=a.cardId}function g(a){delete c.selectedCard}function h(a,b,c){a.$on("$stateChangeError",function(a,d,e,f,g,h){b.error(h),c.go("app.addressbook",{addressbookId:"personal"})}),a.$on("$routeChangeError",function(a,c,d,e){b.error(a,c,d,e)})}angular.module("SOGo.ContactsUI",["ngCookies","ui.router","angularFileUpload","ck","SOGo.Common","SOGo.PreferencesUI","SOGo.MailerUI"]).config(a).run(h),a.$inject=["$stateProvider","$urlRouterProvider"],b.$inject=["AddressBook"],c.$inject=["$q","$state","$stateParams","AddressBook"],d.$inject=["$stateParams","stateAddressbook","Card"],e.$inject=["$state","$stateParams","stateAddressbook"],f.$inject=["$stateParams","stateAddressbook"],g.$inject=["stateAddressbook"],h.$inject=["$rootScope","$log","$state"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k,m,n,o,p,q){function r(a){a.push(o.createHotkey({key:l("hotkey_search"),description:l("Search"),callback:H})),a.push(o.createHotkey({key:l("key_create_card"),description:l("Create a new address book card"),callback:angular.bind(M,u,"card")})),a.push(o.createHotkey({key:l("key_create_list"),description:l("Create a new list"),callback:angular.bind(M,u,"list")})),a.push(o.createHotkey({key:"space",description:l("Toggle item"),callback:t})),a.push(o.createHotkey({key:"shift+space",description:l("Toggle range of items"),callback:t})),a.push(o.createHotkey({key:"up",description:l("View next item"),callback:w})),a.push(o.createHotkey({key:"down",description:l("View previous item"),callback:x})),a.push(o.createHotkey({key:"shift+up",description:l("Add next item to selection"),callback:y})),a.push(o.createHotkey({key:"shift+down",description:l("Add previous item to selection"),callback:z})),a.push(o.createHotkey({key:"backspace",description:l("Delete selected card or address book"),callback:A})),_.forEach(a,function(a){o.registerHotkey(a)})}function s(a){d.go("app.addressbook.card.view",{cardId:a.id})}function t(a,b){var c,d,e,f=M.selectedFolder;if(b||(b=f.$selectedCard()),b.selected=!b.selected,M.mode.multiple+=b.selected?1:-1,a.shiftKey&&f.$selectedCount()>1){for(c=f.idsMap[b.id],d=c-2;d>=0&&!f.$cards[d].selected;)d--;if(0>d)for(d=c+2;d<f.getLength()&&!f.$cards[d].selected;)d++;if(d>=0&&d<f.getLength())for(e=Math.min(c,d);e<=Math.max(c,d);e++)f.$cards[e].selected=!0}a.preventDefault(),a.stopPropagation()}function u(a){d.go("app.addressbook.new",{contactType:a})}function v(){_.forEach(M.selectedFolder.$cards,function(a){a.selected=!1}),M.mode.multiple=0}function w(a){var b=M.selectedFolder.$selectedCardIndex();return angular.isDefined(b)?(b--,M.selectedFolder.$topIndex>0&&M.selectedFolder.$topIndex--):(b=M.selectedFolder.$cards.length()-1,M.selectedFolder.$topIndex=M.selectedFolder.getLength()),b>-1&&s(M.selectedFolder.$cards[b]),a.preventDefault(),b}function x(a){var b=M.selectedFolder.$selectedCardIndex();return angular.isDefined(b)?(b++,M.selectedFolder.$topIndex<M.selectedFolder.$cards.length&&M.selectedFolder.$topIndex++):b=0,b<M.selectedFolder.$cards.length?s(M.selectedFolder.$cards[b]):b=-1,a.preventDefault(),b}function y(a){var b;M.selectedFolder.hasSelectedCard()&&(b=w(a),b>=0&&t(a,M.selectedFolder.$cards[b]))}function z(a){var b;M.selectedFolder.hasSelectedCard()&&(b=x(a),b>=0&&t(a,M.selectedFolder.$cards[b]))}function A(a){var b=M.selectedFolder.$selectedCards();_.size(b)>0&&m.confirm(l("Warning"),l("Are you sure you want to delete the selected contacts?"),{ok:l("Delete")}).then(function(){M.selectedFolder.$deleteCards(b).then(function(){M.mode.multiple=0,M.selectedFolder.selectedCard||d.go("app.addressbook")})}),a.preventDefault()}function B(a,b){var c,e,f,h,i,j,k;c=M.selectedFolder,i=!1,e=c.$selectedCards(),f=_.filter(e,function(a){return a.$isCard()}),f.length!=e.length&&g.show(g.simple().content(l("Lists can't be moved or copied.")).position("top right").hideDelay(2e3)),f.length&&("copy"==a?(j=c.$copyCards(f,b),k=l("%{0} card(s) copied",f.length)):(j=c.$moveCards(f,b),k=l("%{0} card(s) moved",f.length),h=_.map(f,"id"),i=c.selectedCard&&h.indexOf(c.selectedCard)>=0),j.then(function(){i&&d.go("app.addressbook"),g.show(g.simple().content(k).position("top right").hideDelay(2e3))}))}function C(a){B("copy",a)}function D(a){B("move",a)}function E(){_.forEach(M.selectedFolder.$cards,function(a){a.selected=!0}),M.mode.multiple=M.selectedFolder.$cards.length}function F(a){M.selectedFolder.$filter("",{sort:a})}function G(a){return j.$query.sort==a}function H(){M.mode.search=!0,k("search")}function I(){M.mode.search=!1,M.selectedFolder.$filter("")}function J(a,b,c){h.$findAll().then(function(d){var e=_.find(d,function(a){return 0===a.id?a:void 0});e.$getMailboxes().then(function(d){e.$newMessage().then(function(d){d.editable[c]=b,f.show({parent:angular.element(document.body),targetEvent:a,clickOutsideToClose:!1,escapeToClose:!1,templateUrl:"../Mail/UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor",locals:{stateAccount:e,stateMessage:d}})})})})}function K(a,b,c){var d=[c+" <"+b+">"];M.newMessage(a,d,"to"),a.stopPropagation(),a.preventDefault()}function L(a,c){var d=_.filter(M.selectedFolder.$cards,function(a){return a.selected}),e=[],f=[];_.forEach(d,function(a){a.$isList({expandable:!0})?angular.isDefined(a.refs)&&a.refs.length?_.forEach(a.refs,function(a){a.email.length&&f.push(a.$shortFormat())}):e.push(a.$reload().then(function(a){_.forEach(a.refs,function(a){a.email.length&&f.push(a.$shortFormat())})})):a.c_mail.length&&f.push(a.$shortFormat())}),b.all(e).then(function(){f=_.uniq(f),f.length&&M.newMessage(a,f,c)})}var M=this,N=[];j.selectedFolder=q,M.service=j,M.selectedFolder=q,M.selectCard=s,M.toggleCardSelection=t,M.newComponent=u,M.unselectCards=v,M.confirmDeleteSelectedCards=A,M.copySelectedCards=C,M.moveSelectedCards=D,M.selectAll=E,M.sort=F,M.sortedBy=G,M.searchMode=H,M.cancelSearch=I,M.newMessage=J,M.newMessageWithSelectedCards=L,M.newMessageWithRecipient=K,M.mode={search:!1,multiple:0},r(N),a.$on("$destroy",function(){_.forEach(N,function(a){o.deregisterHotkey(a)})})}a.$inject=["$scope","$q","$window","$state","$timeout","$mdDialog","$mdToast","Account","Card","AddressBook","sgFocus","Dialog","sgSettings","sgHotkeys","stateAddressbooks","stateAddressbook"],angular.module("SOGo.ContactsUI").controller("AddressBookController",a)}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k,m,n,o,p,q,r,s,t,u,v){function w(a){a.push(o.createHotkey({key:"backspace",description:l("Delete selected card or address book"),callback:function(){r.selectedFolder&&!r.selectedFolder.hasSelectedCard()&&C()}})),_.forEach(a,function(a){o.registerHotkey(a)})}function x(a,c){b.params.addressbookId!=c.id&&K.editMode!=c.id?(K.editMode=!1,r.$query.value="",j(n["gt-md"])||k("left").close(),b.go("app.addressbook",{addressbookId:c.id})):(a.preventDefault(),a.stopPropagation())}function y(){s.prompt(l("New Addressbook..."),l("Name of the Address Book")).then(function(a){var b=new r({name:a,isEditable:!0,isRemote:!1,owner:UserLogin});r.$add(b)})}function z(a){a.isRemote||(K.editMode=a.id,K.originalAddressbook=angular.extend({},a.$omit()),p("addressBookName_"+a.id))}function A(a){a.name=K.originalAddressbook.name,K.editMode=!1}function B(a){var b=a.name;b&&b.length>0&&b!=K.originalAddressbook.name&&a.$rename(b).then(function(a){K.editMode=!1},function(a,b){s.alert(l("Warning"),a)})}function C(){K.service.selectedFolder.isSubscription?K.service.selectedFolder.$delete().then(function(){K.service.selectedFolder=null,b.go("app.addressbook",{addressbookId:"personal"})},function(a,b){s.alert(l('An error occured while deleting the addressbook "%{0}".',K.service.selectedFolder.name),l(a.error))}):s.confirm(l("Warning"),l('Are you sure you want to delete the addressbook "%{0}"?',K.service.selectedFolder.name),{ok:l("Delete")}).then(function(){return K.service.selectedFolder.$delete()}).then(function(){return K.service.selectedFolder=null,b.go("app.addressbook",{addressbookId:"personal"}),!0})["catch"](function(a){if(a){var b=a.data.message||a.statusText;s.alert(l('An error occured while deleting the addressbook "%{0}".',K.service.selectedFolder.name),b)}})}function D(a,b){function c(a,b,c){function d(a){var b=0===a.type.indexOf("text")||/\.(ldif|vcf|vcard)$/.test(a.name);return b||i.show({template:["<md-toast>",'  <div class="md-toast-content">','    <md-icon class="md-warn md-hue-1">error_outline</md-icon>',"    <span>"+l("Select a vCard or LDIF file.")+"</span>","  </div>","</md-toast>"].join(""),position:"top right",hideDelay:3e3}),b}var e=this;e.uploader=new m({url:ApplicationBaseURL+[c.id,"import"].join("/"),autoUpload:!0,queueLimit:1,filters:[{name:d,fn:d}],onSuccessItem:function(a,c,d,e){var f;b.hide(),0===c.imported?f=l("No card was imported."):(f=l("A total of %{0} cards were imported in the addressbook.",c.imported),r.selectedFolder.$reload()),i.show(i.simple().content(f).position("top right").hideDelay(3e3))},onErrorItem:function(a,b,c,d){i.show({template:["<md-toast>",'  <div class="md-toast-content">','    <md-icon class="md-warn md-hue-1">error_outline</md-icon>',"    <span>"+l("An error occured while importing contacts.")+"</span>","  </div>","</md-toast>"].join(""),position:"top right",hideDelay:3e3})}}),e.close=function(){b.hide()}}h.show({parent:angular.element(document.body),targetEvent:a,clickOutsideToClose:!0,escapeToClose:!0,templateUrl:"UIxContactsImportDialog",controller:c,controllerAs:"$CardsImportDialogController",locals:{folder:b}}),c.$inject=["scope","$mdDialog","folder"]}function E(b){function c(a,b){function c(){a.hide()}this.addressbook=b,this.close=c}var d;d=b.urls?a.when():r.$reloadAll(),d.then(function(){h.show({parent:angular.element(document.body),clickOutsideToClose:!0,escapeToClose:!0,templateUrl:b.id+"/links",controller:c,controllerAs:"links",locals:{addressbook:b}})}),c.$inject=["$mdDialog","addressbook"]}function F(a){function b(a,b,c){function d(){f.addressbook.$save().then(function(){c.init(f.addressbook.$omit()),b.hide()})}function e(){b.cancel()}var f=this;f.addressbook=new r(c.$omit()),f.saveProperties=d,f.close=e}h.show({templateUrl:a.id+"/properties",controller:b,controllerAs:"properties",clickOutsideToClose:!0,escapeToClose:!0,locals:{srcAddressBook:a}})["catch"](function(){}),b.$inject=["$scope","$mdDialog","srcAddressBook"]}function G(a){a.$acl.$users().then(function(){h.show({templateUrl:a.id+"/UIxAclEditor",controller:"AclController",controllerAs:"acl",clickOutsideToClose:!0,escapeToClose:!0,locals:{usersWithACL:a.$acl.users,User:u,folder:a}})})}function H(a){console.debug("subscribeToFolder "+a.owner+a.name),r.$subscribe(a.owner,a.name).then(function(a){i.show(i.simple().content(l("Successfully subscribed to address book")).position("top right").hideDelay(3e3))})}function I(a,b){return b.id!=a.id&&(b.isOwned||b.acls.objectCreator)}function J(a,c,d){var e,f,g,h,j,k,m;e=c.id,j=!1,f=a.$selectedCards(),0===f.length&&(f=[a.$selectedCard()]),g=_.filter(f,function(a){return a.$isCard()}),g.length!=f.length&&i.show(i.simple().content(l("Lists can't be moved or copied.")).position("top right").hideDelay(2e3)),g.length&&("copy"==d?(k=a.$copyCards(g,e),m=l("%{0} card(s) copied",g.length)):(k=a.$moveCards(g,e),m=l("%{0} card(s) moved",g.length),h=_.map(g,"id"),j=a.selectedCard&&h.indexOf(a.selectedCard)>=0),k.then(function(){j&&b.go("app.addressbook"),i.show(i.simple().content(m).position("top right").hideDelay(2e3))}))}var K=this,L=[];K.activeUser=t.activeUser,K.service=r,K.select=x,K.newAddressbook=y,K.edit=z,K.revertEditing=A,K.save=B,K.confirmDelete=C,K.importCards=D,K.showLinks=E,K.showProperties=F,K.share=G,K.subscribeToFolder=H,K.isDroppableFolder=I,K.dragSelectedCards=J,w(L),c.$on("$destroy",function(){_.forEach(L,function(a){o.deregisterHotkey(a)})})}a.$inject=["$q","$state","$scope","$rootScope","$stateParams","$timeout","$window","$mdDialog","$mdToast","$mdMedia","$mdSidenav","FileUploader","sgConstant","sgHotkeys","sgFocus","Card","AddressBook","Dialog","sgSettings","User","stateAddressbooks"],angular.module("SOGo.ContactsUI").controller("AddressBooksController",a)}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k,m,n){function o(a){a.push(i.createHotkey({key:"backspace",description:l("Delete"),callback:function(a){0===E.currentFolder.$selectedCount()&&C(),a.preventDefault()}})),_.forEach(a,function(a){i.registerHotkey(a)})}function p(a){return angular.isString(a)?{value:a}:a}function q(){var a=E.card.$addOrgUnit("");j("orgUnit_"+a)}function r(){E.card.birthday=new Date}function s(){E.card.$addScreenName("")}function t(){var a=E.card.$addEmail("");j("email_"+a)}function u(){var a=E.card.$addPhone("");j("phone_"+a)}function v(){var a=E.card.$addUrl("","");j("url_"+a)}function w(){var a=E.card.$addAddress("","","","","","","","");j("address_"+a)}function x(a,b){return a.length<e.minimumSearchLength()?[]:f.selectedFolder.$filter(a,{dry:!0,excludeLists:!0},b).then(function(a){return a})}function y(a){a.$valid&&E.card.$save().then(function(a){var b=_.indexOf(_.map(f.selectedFolder.$cards,"id"),E.card.id);0>b?f.selectedFolder.$reload():f.selectedFolder.$cards[b]=angular.copy(E.card),k.go("app.addressbook.card.view",{cardId:E.card.id})})}function z(){k.go("app.addressbook").then(function(){E.card=null,delete f.selectedFolder.selectedCard})}function A(a){E.card.$reset(),a.$setPristine()}function B(){E.card.$reset(),E.card.isNew?(E.card=null,delete f.selectedFolder.selectedCard,k.go("app.addressbook",{addressbookId:f.selectedFolder.id})):k.go("app.addressbook.card.view",{cardId:E.card.id})}function C(){var a=n;h.confirm(l("Warning"),l("Are you sure you want to delete the card of %{0}?","<b>"+a.$fullname()+"</b>"),{ok:l("Delete")}).then(function(){f.selectedFolder.$deleteCards([a]).then(function(){z()},function(b,c){h.alert(l("Warning"),l('An error occured while deleting the card "%{0}".',a.$fullname()))})})}function D(a){E.showRawSource||E.rawSource?E.showRawSource=!E.showRawSource:g.$$resource.post(E.currentFolder.id+"/"+E.card.id,"raw").then(function(a){E.rawSource=a,E.showRawSource=!0})}var E=this,F=[];E.card=n,E.currentFolder=f.selectedFolder,E.allEmailTypes=g.$EMAIL_TYPES,E.allTelTypes=g.$TEL_TYPES,E.allUrlTypes=g.$URL_TYPES,E.allAddressTypes=g.$ADDRESS_TYPES,E.categories={},E.userFilterResults=[],E.transformCategory=p,E.addOrgUnit=q,E.addBirthday=r,E.addScreenName=s,E.addEmail=t,E.addPhone=u,E.addUrl=v,E.addAddress=w,E.userFilter=x,E.save=y,E.close=z,E.reset=A,E.cancel=B,E.confirmDelete=C,E.toggleRawSource=D,E.showRawSource=!1,o(F),a.$on("$destroy",function(){_.forEach(F,function(a){i.deregisterHotkey(a)})})}a.$inject=["$scope","$timeout","$window","$mdDialog","sgSettings","AddressBook","Card","Dialog","sgHotkeys","sgFocus","$state","$stateParams","stateCard"],angular.module("SOGo.ContactsUI").controller("CardController",a)}(),function(){"use strict";function a(){return{restrict:"A",scope:{data:"=sgAddress"},controller:["$scope",function(a){a.addressLines=function(a){var b=[],c=[];return a.street&&b.push(a.street),a.street2&&b.push(a.street2),a.locality&&c.push(a.locality),a.region&&c.push(a.region),c.length>0&&b.push(c.join(", ")),a.country&&b.push(a.country),a.postalcode&&b.push(a.postalcode),b.join("<br>")}}],template:'<address ng-bind-html="addressLines(data)"></address>'}}angular.module("SOGo.Common").directive("sgAddress",a)}();
//# sourceMappingURL=Contacts.js.map