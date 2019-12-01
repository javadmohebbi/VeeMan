package vbemAPI

import (
	"encoding/json"
)

const VbEntMgrContextKey string = "vemLogonSession"

type Session struct {
	LogonSession		LogonSession
}
type LogonSession struct {
	SessionId			string
	Username			string
	ValidTo				int64
}






type GeneralResponseWrapper struct {
	//EntityReferences			Response		`json:"EntityReferences"`
	EntityReferences interface{}
}

type Reference struct {
	RawWrapper struct {
		Raw			json.RawMessage			`json:"Ref"`
	} `json:"Result"`

	Obj				Ref						`json:"Ref"`
	Arr				[]Ref					`json:"Ref"`
}
type Ref struct {
	Name			string			`json:"Name"`
	Type			string			`json:"Type"`
	UID				string			`json:"UID"`
	Href			string			`json:"Href"`
}
func (g *Reference) UnmarshalJSON(data []byte) error {
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













