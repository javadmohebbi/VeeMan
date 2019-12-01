package vbemQuery

import (
	"VeeamManager/package/vbemAPI"
	"encoding/json"
)

func ExtractReferencesResponse(buffer []byte) []vbemAPI.Ref {
	var grw vbemAPI.GeneralResponseWrapper
	_ = json.Unmarshal(buffer, &grw)

	var r vbemAPI.Reference
	var marshalled []byte

	marshalled, _ = json.Marshal(grw.EntityReferences)


	_ = json.Unmarshal(marshalled, &r)

	var msi map[string]interface{}
	marshalled, _ = json.Marshal(r)
	_ = json.Unmarshal(marshalled, &msi)

	var returnRefs []vbemAPI.Ref

	for index, element := range msi {
		if index == "Result" {
			var refs map[string]interface{}
			marshalled, _ = json.Marshal(element)

			_ = json.Unmarshal(marshalled, &refs)

			for in, el := range refs {
				if in == "Ref" {
					switch el.(type) {
					// Ref []
					case []interface {}:
						var arrRef map[string]interface{}
						marshalled, _ = json.Marshal(element)
						_ = json.Unmarshal(marshalled, &arrRef)
						for ind, ele := range arrRef {

							if ind == "Ref" {
								e := ele.([]interface{})
								for _, eee := range e {
									returnRefs = append(returnRefs, elementToRef(eee))
								}
							}
						}
						break

					// Ref {}
					default:
						returnRefs = append(returnRefs, elementToRef(el))
					}
				}
				//log.Println("==========================> ", el)
			}

		}

	}
	return returnRefs
}

func elementToRef(el interface{}) vbemAPI.Ref {
	var ref map[string]string
	marshalled, _ := json.Marshal(el)
	_ = json.Unmarshal(marshalled, &ref)

	var tmpRef vbemAPI.Ref
	for i, e := range ref {
		switch i {
		case "Name": tmpRef.Name = e; break
		case "Type": tmpRef.Type = e; break
		case "UID": tmpRef.UID = e; break
		case "Href": tmpRef.Href = e; break
		}
	}
	return tmpRef
}