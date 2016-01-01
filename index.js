var fs = require('fs');
var Mustache = require('mustache');
var _ = require('underscore');
var moment = require('moment');


moment.locale("fr");

function render (resumeObject) {
	// email munging to avoid spammers
	if (resumeObject.basics && resumeObject.basics.email) {
		resumeObject.basics._munged_email = '<span>' + resumeObject.basics.email.split('').join('</span><span>') + '</span>';
	}

	// social network icons
	_.each(resumeObject.basics.profiles, function (i) {
		i._icon = i.network.toLowerCase();
	});

	var humanizeDate = function (datestr) {
		return moment(datestr).format("MMM YYYY").replace(' ', '&nbsp;');
	};

	var processDates = function (node) {
		if (!node.endDate) {
            node.date = "Depuis " + moment(node.startDate).format("MMMM YYYY");
            return;
		}

		var mStartDate = moment(node.startDate);
		var mEndDate = moment(node.endDate);
		if (mStartDate.month() == 0 && mEndDate.month() == 0) {
			if (node.startDate == node.endDate) {
				node.date = moment(node.startDate).format("YYYY");
			} else {
				node.startDate = moment(node.startDate).format("YYYY");
				node.endDate = moment(node.endDate).format("YYYY");
			}
			return;
		}

        node.endDate = humanizeDate(node.endDate);

		if (node.startDate) {
            node.startDate = humanizeDate(node.startDate);
        }
	};

	_.each(resumeObject.work, processDates);
	_.each(resumeObject.education, function(node) {
		//only years for education
        if (node.endDate == node.startDate) {
            node.date = moment(node.startDate).format("YYYY");
        } else {
            node.startDate = moment(node.startDate).format("YYYY");
            node.endDate = moment(node.endDate).format("YYYY");
        }
    });
	_.each(resumeObject.volunteer, processDates);
	_.each(resumeObject.awards, processDates);

	var locs = [];
	if (resumeObject.basics.location) {
		_.each(['address', 'postalCode', 'city'], function(s) {
			if (resumeObject.basics.location[s]) {
				locs.push(resumeObject.basics.location[s]);
			}
		});
	}
	resumeObject.basics._humanized_location = locs.join(', ');

	var theme = fs.readFileSync(__dirname + '/resume.html', 'utf8');
	return Mustache.render(theme, resumeObject);
}

module.exports = { render: render };
