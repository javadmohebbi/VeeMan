package vbemAPI

// Repositories - struct
type Repositories struct {
	Name string `json:"Name"`
	Type string `json:"Type"`
	UID  string `json:"UID"`
	Href string `json:"Href"`
}

// RepositiryEntity - struct
type RepositiryEntity struct {
	Repository struct {
		FreeSpace string      `json:"FreeSpace"`
		Type      string      `json:"Type"`
		Name      string      `json:"Name"`
		UID       string      `json:"UID"`
		Links     interface{} `json:"Links"`
		Capacity  string      `json:"Capacity"`
		Kind      string      `json:"Kind"`
	} `json:"Repository"`
}
