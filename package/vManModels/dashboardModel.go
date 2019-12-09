package vManModels

import (
	"VeeamManager/package/vManConstants"
	"VeeamManager/package/vManValidators"
	"strings"
	"time"
)

const DashboardCollection string = "Dashboards"

type Dashboard struct {
	Id        interface{} `json:"Id" bson:"_id"`
	Name      string      `json:"Name" bson:"name"`
	Desc      string      `json:"Description" bson:"desc"`
	Kind      string      `json:"Type" bson:"kind"`
	Rows      []Row       `json:"Rows" bson:"rows"`
	OwnerId   interface{} `json:"OwnerId" bson:"ownerId"`
	UpdatedAt time.Time   `json:"UpdatedAt" bson:"updateAt"`
	CreatedAt time.Time   `json:"CreatedAt" bson:"createdAt"`
}

func (d *Dashboard) GetNewEmpty() interface{} {
	return Dashboard{}
}

func (d *Dashboard) Valid() (vManValidators.ValidationResult, bool) {
	vs := vManValidators.ValidationResult{
		Errors: nil,
		Count:  0,
	}

	var ve vManValidators.ValidationError

	if !vManValidators.Empty(d.Name) {
		ve.Message = strings.Replace(vManConstants.MsgIsRequired, "%FIELD%", vManConstants.FldName, -1)
		ve.Code = vManConstants.ErrCodeIsRequired
		ve.Field = vManConstants.FldName
		vs.Count = vs.Count + 1
		vs.Errors = append(vs.Errors, ve)
	} else {
		if !vManValidators.Length(d.Name, 5, 50) {
			ve.Message = strings.Replace(vManConstants.MsgMustBeBetween, "%FIELD%", vManConstants.FldName, -1)
			ve.Message = strings.Replace(ve.Message, "%FROM%", "5", -1)
			ve.Message = strings.Replace(ve.Message, "%TO%", "50", -1)
			ve.Code = vManConstants.ErrCodeLength
			ve.Field = vManConstants.FldName
			vs.Count = vs.Count + 1
			vs.Errors = append(vs.Errors, ve)
		}
	}

	// if !vManValidators.Empty(d.Desc) {
	// 	ve.Message = strings.Replace(vManConstants.MsgIsRequired, "%FIELD%", vManConstants.FldDesc, -1)
	// 	ve.Code = vManConstants.ErrCodeIsRequired
	// 	ve.Field = vManConstants.FldDesc
	// 	vs.Count = vs.Count + 1
	// 	vs.Errors = append(vs.Errors, ve)
	// } else {
	// 	if !vManValidators.Length(d.Desc, 10, 100) {
	// 		ve.Message = strings.Replace(vManConstants.MsgMustBeBetween, "%FIELD%", vManConstants.FldDesc, -1)
	// 		ve.Message = strings.Replace(ve.Message, "%FROM%", "10", -1)
	// 		ve.Message = strings.Replace(ve.Message, "%TO%", "100", -1)
	// 		ve.Code = vManConstants.ErrCodeLength
	// 		ve.Field = vManConstants.FldDesc
	// 		vs.Count = vs.Count + 1
	// 		vs.Errors = append(vs.Errors, ve)
	// 	}
	// }

	var ch bool = true
	if vs.Count > 0 {
		ch = false
	}

	return vs, ch
}
