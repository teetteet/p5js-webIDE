/**
 *  tabs
 */
var _ = require('underscore');
var Vue = require('vue');

var PTab = Vue.extend({

	// two way binding
	props: ['tab'],

	template: require('./tab.html'),
			computed: {
				hidden: function() {
					return this.tab.name[0] === '.'
				},
				className: function() {
					var c = '';
					if (this.$root.currentFile == this.tab.file) {
						c += 'selected';
					}

					// themes:
					c += ' ' + this.$root.theme;

					return c;
				}
			}
		});


module.exports = Vue.extend({
	template: require('./template.html'),

	// two-way binding
	props: ['tabs'],

	components: {
		ptab: PTab
	},

	methods: {

		// closeFile
		closeTab: function(fileName, tabs) {
			// find if there is a matching tab
			var target_tabs = tabs.filter( function(tab) {
				return tab.name === fileName;
			});

			if (target_tabs[0]) {
				var newTarget;
				var index = _.indexOf(tabs, target_tabs[0]);
				switch(index) {
					case 0:
						newTarget = 0;
						break;
					case tabs.length -1:
						newTarget = tabs.length -2;
						break;
					default:
						newTarget = index -1;
						break;
				}

				tabs.splice(index, 1);
				try {
					this.$root.openFile( tabs[newTarget].name );
				} catch(e) {
					console.log('no file to open');
					this.$root.clearEditor();
				}
			}
		},


		addTab: function(fileObject, tabs) {
			// make sure tab is not already open
			var tabExists = _.findWhere(tabs, {name: fileObject.name});
			if (tabExists) {
				// console.log('tab exists');
				return;
			}

			if (fileObject.open) {
				var tabObject = {
					name: fileObject.name,
					path: fileObject.path,
					id: fileObject.path,
					type: 'file',
					open: true,
					file: fileObject
				};

				tabs.push(tabObject);
			}
		}
	},

	ready: function() {
		this.$on('add-tab', this.addTab);
		this.$on('close-tab', this.closeTab);
	}
});