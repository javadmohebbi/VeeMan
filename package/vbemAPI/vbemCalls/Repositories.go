package vbemCalls

import "VeeamManager/package/vbemAPI"

func convertToRepos(refs []vbemAPI.Ref) []vbemAPI.Repositories {
	var tmp []vbemAPI.Repositories
	for _, e := range refs {
		tmpEl := vbemAPI.Repositories{
			Name: e.Name,
			Type: e.Type,
			UID:  e.UID,
			Href: e.Href,
		}
		tmp = append(tmp, tmpEl)
	}
	return tmp
}