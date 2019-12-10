package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
)

// convertToJobs - Refs to jobs
func convertToJobs(refs []vbemAPI.Ref) []vbemAPI.Jobs {
	var tmp []vbemAPI.Jobs
	for _, e := range refs {
		tmpEl := vbemAPI.Jobs{
			Name: e.Name,
			Type: e.Type,
			UID:  e.UID,
			Href: e.Href,
		}
		tmp = append(tmp, tmpEl)
	}
	return tmp
}
