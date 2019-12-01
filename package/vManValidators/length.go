package vManValidators

func Length(s string, min int, max int) bool {
	if len(s) < min || len(s) > max {
		return false
	}
	return true
}


func InRangeInt(i int, min int, max int) bool {
	if i < min || i > max {
		return false
	}
	return true
}


func InRangeInt8(i int8, min int8, max int8) bool {
	if i < min || i > max {
		return false
	}
	return true
}


func InRangeInt16(i int16, min int16, max int16) bool {
	if i < min || i > max {
		return false
	}
	return true
}


func InRangeInt32(i int32, min int32, max int32) bool {
	if i < min || i > max {
		return false
	}
	return true
}


func InRangeInt64(i int64, min int64, max int64) bool {
	if i < min || i > max {
		return false
	}
	return true
}


func InRangeFloat32(f float32, min float32, max float32) bool {
	if f < min || f > max {
		return false
	}
	return true
}

func InRangeFloat64(f float64, min float64, max float64) bool {
	if f < min || f > max {
		return false
	}
	return true
}


