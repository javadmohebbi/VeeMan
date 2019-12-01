package vManValidators


type ValidationResult struct {
	Errors			[]ValidationError
	Count			int
}

type ValidationError struct {
	Code			int
	Field			string
	Message			string
}
