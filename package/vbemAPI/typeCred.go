package vbemAPI

import "encoding/json"

type GeneralCredResponseWrapper struct {
	CredentialsInfoList interface{}
}

type CredList struct {
	RawWrapper struct {
		Raw			json.RawMessage			`json:"CredentialsInfo"`
	} `json:"Result"`

	Obj				CredentialsInfo			`json:"CredentialsInfo"`
	Arr				[]CredentialsInfo		`json:"CredentialsInfo"`
}
type CredentialsInfo struct {
	Id				string			`json:"Id"`
	Username		string			`json:"Username"`
	Description		string			`json:"Description"`
	Password		string			`json:"Password"`
	Type			string			`json:"Type"`
	Href			string			`json:"Href"`
}
func (g *CredList) UnmarshalJSON(data []byte) error {
	if err := json.Unmarshal(data, &g.RawWrapper); err != nil {
		return err
	}
	if len(g.RawWrapper.Raw) > 0 {
		if g.RawWrapper.Raw[0] == '[' {
			return json.Unmarshal(g.RawWrapper.Raw, &g.Arr)
		}
	}

	return json.Unmarshal(g.RawWrapper.Raw, &g.Obj)
}





type Credentials struct {
	Id				string			`json:"Id"`
	Username		string			`json:"Username"`
	Description		string			`json:"Description"`
	Password		string			`json:"Password"`
	Type			string			`json:"Type"`
	Href			string			`json:"Href"`
}

