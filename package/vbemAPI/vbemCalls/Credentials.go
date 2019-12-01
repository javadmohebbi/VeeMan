package vbemCalls

import "VeeamManager/package/vbemAPI"

func convertToCredentials(refs []vbemAPI.CredentialsInfo) []vbemAPI.Credentials {
	var tmp []vbemAPI.Credentials
	for _, e := range refs {
		tmpEl := vbemAPI.Credentials{
			Id:          e.Id,
			Username:    e.Username,
			Description: e.Description,
			Password:    e.Password,
			Type:        e.Type,
			Href:        e.Href,
		}
		tmp = append(tmp, tmpEl)
	}
	return tmp
}
