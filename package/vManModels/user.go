package vManModels

import (
	"VeeamManager/package/vManConstants"
	"VeeamManager/package/vManValidators"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

const UserCollection string = "Users"
const TokenSecret string = "cb85h878cg6e707ad5960cf374dd3b61e51fcf2fc4a1572g3cb587f8705b242d"

type User struct {
	Id        interface{} `json:"id" bson:"_id"`
	Email     string      `json:"email"`
	FirstName string      `json:"firstName"`
	LastName  string      `json:"lastName"`
	Password  string      `json:"password"`
	Token     string      `json:"token"`
	Roles     []Role      `json:"roles"`
}

// Valid - Validate User Registration
func (u *User) Valid() (vManValidators.ValidationResult, bool) {

	vs := vManValidators.ValidationResult{
		Errors: nil,
		Count:  0,
	}

	var ve vManValidators.ValidationError

	if !vManValidators.Empty(u.Email) || !vManValidators.Email(u.Email) {
		//return "Username is invalid. It must be an email address!", false
		ve.Message = strings.Replace(vManConstants.MsgMustBeEmail, "%FIELD%", vManConstants.FldEmailAddress, -1)
		ve.Code = vManConstants.ErrCodeInvalidEmail
		ve.Field = vManConstants.FldEmailAddress
		vs.Count = vs.Count + 1
		vs.Errors = append(vs.Errors, ve)
	} else {
		if !vManValidators.IsUnique(UserCollection, "email", u.Email) {
			ve.Field = vManConstants.FldEmailAddress
			ve.Code = vManConstants.ErrCodeUnique
			ve.Message = strings.Replace(vManConstants.MsgMustBeUnique, "%FIELD%", vManConstants.FldEmailAddress, -1)
			vs.Count = vs.Count + 1
			vs.Errors = append(vs.Errors, ve)
		}
	}

	if !vManValidators.Empty(u.FirstName) {
		ve.Message = strings.Replace(vManConstants.MsgIsRequired, "%FIELD%", vManConstants.FldFirstName, -1)
		ve.Code = vManConstants.ErrCodeIsRequired
		ve.Field = vManConstants.FldFirstName
		vs.Count = vs.Count + 1
		vs.Errors = append(vs.Errors, ve)
	} else {
		if !vManValidators.Length(u.FirstName, 3, 20) {
			ve.Message = strings.Replace(vManConstants.MsgMustBeBetween, "%FIELD%", vManConstants.FldFirstName, -1)
			ve.Message = strings.Replace(ve.Message, "%FROM%", "3", -1)
			ve.Message = strings.Replace(ve.Message, "%TO%", "20", -1)
			ve.Code = vManConstants.ErrCodeLength
			ve.Field = vManConstants.FldFirstName
			vs.Count = vs.Count + 1
			vs.Errors = append(vs.Errors, ve)
		}
	}

	if !vManValidators.Empty(u.LastName) {
		ve.Message = strings.Replace(vManConstants.MsgIsRequired, "%FIELD%", vManConstants.FldLastName, -1)
		ve.Code = vManConstants.ErrCodeIsRequired
		ve.Field = vManConstants.FldLastName
		vs.Count = vs.Count + 1
		vs.Errors = append(vs.Errors, ve)
	} else {
		if !vManValidators.Length(u.LastName, 3, 20) {
			ve.Message = strings.Replace(vManConstants.MsgMustBeBetween, "%FIELD%", vManConstants.FldLastName, -1)
			ve.Message = strings.Replace(ve.Message, "%FROM%", "3", -1)
			ve.Message = strings.Replace(ve.Message, "%TO%", "20", -1)
			ve.Code = vManConstants.ErrCodeLength
			ve.Field = vManConstants.FldLastName
			vs.Count = vs.Count + 1
			vs.Errors = append(vs.Errors, ve)
		}
	}

	if !vManValidators.Empty(u.Password) {
		ve.Message = strings.Replace(vManConstants.MsgIsRequired, "%FIELD%", vManConstants.FldPassword, -1)
		ve.Code = vManConstants.ErrCodeIsRequired
		ve.Field = vManConstants.FldPassword
		vs.Count = vs.Count + 1
		vs.Errors = append(vs.Errors, ve)
	} else {
		if !vManValidators.Length(u.Password, 6, 20) {
			ve.Message = strings.Replace(vManConstants.MsgMustBeBetween, "%FIELD%", vManConstants.FldPassword, -1)
			ve.Message = strings.Replace(ve.Message, "%FROM%", "3", -1)
			ve.Message = strings.Replace(ve.Message, "%TO%", "20", -1)
			ve.Code = vManConstants.ErrCodeLength
			ve.Field = vManConstants.FldPassword
			vs.Count = vs.Count + 1
			vs.Errors = append(vs.Errors, ve)
		}
	}

	var ch bool = true
	if vs.Count > 0 {
		ch = false
	}

	return vs, ch
}

func (u *User) GetLoggedIn(jwtClaim interface{}) bool {
	if claims, ok := jwtClaim.(jwt.MapClaims); ok {
		u.Id = claims["id"].(string)
		u.Email = claims["email"].(string)
		u.FirstName = claims["firstName"].(string)
		u.LastName = claims["lastName"].(string)
		u.Password = ""
		u.Token = ""
		return true
	}
	return false
}
