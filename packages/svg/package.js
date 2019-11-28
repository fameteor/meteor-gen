Package.describe({
  name: 'fameteor:svg',
  version: '0.0.1',
  summary: 'Tools for interactive embedded SVG',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.0.2');
	api.use('templating','client');
	api.addFiles('lib/svg.js','client');
	api.export('Svg');
});

Package.onTest(function(api) {
	api.use('tinytest');
	api.use('fameteor:svg');
	api.addFiles('tests/svg-tests.js');
});
