package vbemAuth

import (
	"VeeamManager/package/vManConfig"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

const LoginPATH string = "/sessionMngr/?v=latest"
const HttpMethod string = "POST"

/**
Login to REST API & save session to file
*/
func Login() (vbemAPI.LogonSession, error) {

	q := vbemQuery.New(LoginPATH, HttpMethod, "")
	jsonResp, err := q.Run()

	//jsonResp, err := xml2json.Convert(strings.NewReader(string(body)))
	if err != nil {
		log.Println("Cant read convert XML to JSON ", err)
		return vbemAPI.LogonSession{}, err
	}

	var ls vbemAPI.Session

	err = json.Unmarshal(jsonResp.Bytes(), &ls)
	if err != nil {
		log.Println("Cant unmarshal JSON response", err)
		return vbemAPI.LogonSession{}, err
	}

	if ls.LogonSession.SessionId == "" {
		return vbemAPI.LogonSession{}, fmt.Errorf("username or password is not valid to login to server")
	}

	ls.LogonSession.ValidTo = time.Now().UnixNano()

	writeToFile(ls.LogonSession)
	return ls.LogonSession, nil
}

/**
Validate Session Time
if > 15m will return false
*/
func Validate(session vbemAPI.LogonSession) bool {

	if session.SessionId == "" {
		return false
	}

	to := time.Now()

	from := time.Unix(0, session.ValidTo)

	diff := to.Sub(from)

	var checkDur time.Duration = 14 * time.Minute

	if diff > checkDur {
		return false
	}

	return true
}

/**
Write session to file
*/
func writeToFile(session vbemAPI.LogonSession) {
	conf, err := vManConfig.ReadConfig()
	if err != nil {
		log.Fatal("Cant read config", err)
	}

	// f, err := os.OpenFile(conf.VbEntMgr.SessionPath, os.O_CREATE|os.O_RDWR, os.ModePerm)
	f, err := os.Create(conf.VbEntMgr.SessionPath)
	if err != nil {
		closeFile(f)
		log.Fatal("Cant create session file", err)
	}

	// _, err = f.WriteString(fmt.Sprintf("%v\t%v\t%v", session.SessionId, session.Username, session.ValidTo))
	_, err = io.WriteString(f, fmt.Sprintf("%v\t%v\t%v", session.SessionId, session.Username, session.ValidTo))

	if err != nil {
		closeFile(f)
		log.Fatal("Cant write to session file", err)
	}

	defer closeFile(f)
}

/**
Read Session From File
*/
func ReadSession() vbemAPI.LogonSession {
	conf, err := vManConfig.ReadConfig()
	if err != nil {
		log.Fatal("Cant read config", err)
	}

	f, err := os.OpenFile(conf.VbEntMgr.SessionPath, os.O_RDONLY, os.ModePerm)
	if err != nil {
		log.Fatal("Cant read session", err)
	}

	// defer f.Close()
	defer closeFile(f)

	scanner := bufio.NewScanner(f)
	var ls vbemAPI.LogonSession
	for scanner.Scan() {
		s := strings.Split(scanner.Text(), "\t")

		ls.SessionId = s[0]
		ls.Username = s[1]
		d, err := strconv.ParseInt(s[2], 0, 64)

		if err == nil {
			ls.ValidTo = d
		} else {
			ls.ValidTo = -1
		}

		break
	}
	return ls
}

func closeFile(f *os.File) {
	err := f.Close()
	if err != nil {
		log.Println("can not close file", err)
	}
}
