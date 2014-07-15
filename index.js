var fs = require('fs');
var gravatar = require('gravatar');
var Mustache = require('mustache');
var _ = require('underscore');

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

	_.each(resumeObject.work, function (work_experience) {
		work_experience.startDate = work_experience.startDate.substr(0,4);
		if (work_experience.endDate && work_experience.startDate){
			if(work_experience.endDate.substr(0,4)==work_experience.startDate)
			{
				work_experience.endDate = "";
			}else{
				work_experience.endDate = work_experience.endDate.substr(0,4);
			}
		}else{
			work_experience.endDate = 'Present';
		}
	});

	_.each(resumeObject.education, function(education_experience){
		education_experience.startDate = education_experience.startDate.substr(0,4);
		if (education_experience.endDate && education_experience.startDate){
			if(education_experience.endDate.substr(0,4)==education_experience.startDate)
			{
				education_experience.endDate = "";
			}else{
				education_experience.endDate = education_experience.endDate.substr(0,4);
			}
		}else{
			education_experience.endDate = 'Present';
		}
	});

	var theme = fs.readFileSync(__dirname + '/resume.template', 'utf8');
	var resumeHTML = Mustache.render(theme, resumeObject);
	return resumeHTML;
}

module.exports = { render: render };