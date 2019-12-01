package vbemAPI


type BackupServers struct {
	Name				string				`json:"Name"`
	Type				string				`json:"Type"`
	UID					string				`json:"UID"`
	Href				string				`json:"Href"`
	Jobs				[]Jobs				`json:"Jobs"`
	Repos				[]Repositories		`json:"Repositories"`
	Creds				[]Credentials		`json:"Credentials"`
	//Passwds				[]Passwords			`json:"Passwords"`
}
