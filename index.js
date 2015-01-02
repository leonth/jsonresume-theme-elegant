var fs = require('fs');
var gravatar = require('gravatar');
var Mustache = require('mustache');
var _ = require('underscore');
var moment = require('moment');

function hasPersonalEmail(resumeObject) {
	return (resumeObject.bio && resumeObject.bio.email && resumeObject.bio.email.personal);
}

function render (resumeObject) {
	if (hasPersonalEmail(resumeObject)) {
		resumeObject.bio.gravatar = gravatar.url(resumeObject.bio.email.personal, {
			s: '100',
			r: 'pg',
			d: 'mm'
		});
	}

	var humanizeDate = function (datestr) {
		return moment(datestr).format("MMM YYYY");
	}

	var processDates = function (node) {
		if (!node.endDate) {
			node.endDate = "present";
		}
		else {
			node.endDate = humanizeDate(node.endDate);
		}
		node.startDate = humanizeDate(node.startDate);
	};

	_.each(resumeObject.work, processDates);
	_.each(resumeObject.education, processDates);
	_.each(resumeObject.volunteer, processDates);

	var locs = [];
	if (resumeObject.basics.location) {
		_.each(['address', 'city', 'region', 'postalCode', 'countryCode'], function(s) {
			if (resumeObject.basics.location[s]) {
				locs.push(resumeObject.basics.location[s]);
			}
		});
	}
	resumeObject.basics._humanized_location = locs.join(', ');

	var theme = fs.readFileSync(__dirname + '/resume.template', 'utf8');
	var resumeHTML = Mustache.render(theme, resumeObject);
	return resumeHTML;
}

module.exports = { render: render };
