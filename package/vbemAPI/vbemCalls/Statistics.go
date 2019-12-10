package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"encoding/json"
	"log"
)

// HTTPSummaryOverviewPath - summary overview path
const HTTPSummaryOverviewPath string = "/reports/summary/overview"

// SummaryOverview - get summary overview from veeam ent. Manager
func SummaryOverview(sessionID string) (vbemAPI.SummaryOverview, error) {
	q := vbemQuery.New(HTTPSummaryOverviewPath, "GET", sessionID)
	jsonResp, err := q.Run()

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return vbemAPI.SummaryOverview{}, err
	}

	var orf vbemAPI.OverviewReportFrame

	err = json.Unmarshal(jsonResp.Bytes(), &orf)
	if err != nil {
		log.Println("Can unmarshal JSON to struct", err)
		return vbemAPI.SummaryOverview{}, err
	}

	return orf.Summary, nil
}
