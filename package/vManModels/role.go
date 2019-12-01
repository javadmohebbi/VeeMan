package vManModels

const RoleCollection string = "Roles"

type Role struct {
	Name				string		`json:"name"`
	Default				bool		`json:"default"`
}

