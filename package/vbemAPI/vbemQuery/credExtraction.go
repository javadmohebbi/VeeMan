package vbemQuery

import (
	"VeeamManager/package/vbemAPI"
	"encoding/json"
)

func ExtractCredResponse(buffer []byte) []vbemAPI.CredentialsInfo {
	var grw vbemAPI.GeneralCredResponseWrapper
	_ = json.Unmarshal(buffer, &grw)

	var r vbemAPI.CredList
	var marshalled []byte

	marshalled, _ = json.Marshal(grw.CredentialsInfoList)

	_ = json.Unmarshal(marshalled, &r)

	var msi map[string]interface{}
	marshalled, _ = json.Marshal(r)
	_ = json.Unmarshal(marshalled, &msi)

	var returnRefs []vbemAPI.CredentialsInfo

	for index, element := range msi {
		if index == "Result" {
			var refs map[string]interface{}
			marshalled, _ = json.Marshal(element)

			_ = json.Unmarshal(marshalled, &refs)

			for in, el := range refs {

				if in == "CredentialsInfo" {

					switch el.(type) {
					// Ref []
					case []interface {}:
						var arrRef map[string]interface{}
						marshalled, _ = json.Marshal(element)
						_ = json.Unmarshal(marshalled, &arrRef)
						for ind, ele := range arrRef {

							if ind == "CredentialsInfo" {
								e := ele.([]interface{})
								for _, eee := range e {
									returnRefs = append(returnRefs, elementToCred(eee))
								}
							}
						}
						break

					// Ref {}
					default:
						returnRefs = append(returnRefs, elementToCred(el))
					}
				}

			}

		}

	}
	return returnRefs
}

func elementToCred(el interface{}) vbemAPI.CredentialsInfo {
	var ref map[string]string
	marshalled, _ := json.Marshal(el)
	_ = json.Unmarshal(marshalled, &ref)

	var tmpRef vbemAPI.CredentialsInfo
	for i, e := range ref {
		switch i {
		case "Id": tmpRef.Id = e; break
		case "Username": tmpRef.Username = e; break
		case "Description": tmpRef.Description = e; break
		case "Password": tmpRef.Password = e; break
		case "Type": tmpRef.Type = e; break
		case "Href": tmpRef.Href = e; break
		}
	}
	return tmpRef
}
