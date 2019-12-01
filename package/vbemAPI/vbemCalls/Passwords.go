package vbemCalls

import "VeeamManager/package/vbemAPI"

func convertToPasswords(refs []vbemAPI.Ref) []vbemAPI.Passwords {
	var tmp []vbemAPI.Passwords
	for _, e := range refs {
		tmpEl := vbemAPI.Passwords{
			Name: e.Name,
			Type: e.Type,
			UID:  e.UID,
			Href: e.Href,
		}
		tmp = append(tmp, tmpEl)
	}
	return tmp
}
