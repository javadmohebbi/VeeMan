package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
)

// HTTPSummaryOverviewPath - summary overview path
const HTTPSummaryOverviewPath string = "/reports/summary/overview"

// HTTPVMsSummaryOverviewPath - VMs summary overview path
const HTTPVMsSummaryOverviewPath string = "/reports/summary/vms_overview"

// HTTPJobsStatisticsPath - Jobs Statistics Path
const HTTPJobsStatisticsPath string = "/reports/summary/job_statistics"

// HTTPProcessedVMsoverviewPath - Processed VMs Path
const HTTPProcessedVMsoverviewPath string = "/reports/summary/processed_vms"

// HTTPRepsitoryoverviewPath - Repository Path
const HTTPRepsitoryoverviewPath string = "/reports/summary/repository"

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

// VMsSummaryOverview - get VMs summary overview from veeam ent. Manager
func VMsSummaryOverview(sessionID string) (vbemAPI.VMsSummaryOverview, error) {
	q := vbemQuery.New(HTTPVMsSummaryOverviewPath, "GET", sessionID)
	jsonResp, err := q.Run()

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return vbemAPI.VMsSummaryOverview{}, err
	}

	var vorf vbemAPI.VMsOverviewReportFrame

	err = json.Unmarshal(jsonResp.Bytes(), &vorf)
	if err != nil {
		log.Println("Can unmarshal JSON to struct", err)
		return vbemAPI.VMsSummaryOverview{}, err
	}

	return vorf.Summary, nil
}

// SummaryJobStatistics - get summary statistics from veeam ent. Manager
func SummaryJobStatistics(sessionID string) (vbemAPI.JobStatisticsReport, error) {
	q := vbemQuery.New(HTTPJobsStatisticsPath, "GET", sessionID)
	jsonResp, err := q.Run()

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return vbemAPI.JobStatisticsReport{}, err
	}

	var orf vbemAPI.JobStatisticsReportFrame

	err = json.Unmarshal(jsonResp.Bytes(), &orf)
	if err != nil {
		log.Println("Can unmarshal JSON to struct", err)
		return vbemAPI.JobStatisticsReport{}, err
	}

	return orf.Summary, nil
}

// ProcessedVMsSummaryOverview - get Processed VMs summary overview from veeam ent. Manager
func ProcessedVMsSummaryOverview(sessionID string) (vbemAPI.ProcessedVMsOverview, error) {
	q := vbemQuery.New(HTTPProcessedVMsoverviewPath, "GET", sessionID)
	jsonResp, err := q.Run()

	var result vbemAPI.ProcessedVMsOverview

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return result, err
	}

	var pvrf vbemAPI.ProcessedVMsReportFrame

	err = json.Unmarshal(jsonResp.Bytes(), &pvrf)
	if err != nil {
		log.Println("Can unmarshal JSON to struct", err)
		return result, err
	}

	return pvrf.Summary, nil
}

// RepositorySummaryOverview - get Repository summary overview from veeam ent. Manager
func RepositorySummaryOverview(sessionID string) (vbemAPI.RepositoryOverview, error) {
	q := vbemQuery.New(HTTPRepsitoryoverviewPath, "GET", sessionID)
	jsonResp, err := q.Run()

	var result vbemAPI.RepositoryOverview

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return result, err
	}

	var rrf vbemAPI.RepositoryReportFrame

	// log.Println(jsonResp.String())

	err = json.Unmarshal(jsonResp.Bytes(), &rrf)
	if err != nil {
		log.Println("Can unmarshal JSON to struct", err)
		return result, err
	}

	var rpos []vbemAPI.RepositoryPeriodOverview

	for _, v := range rrf.Summary.Period {
		// var rpo vbemAPI.RepositoryPeriodOverview
		rpo := v
		free, err := strconv.ParseFloat(v.FreeSpace, 64)
		if err != nil {
			v.FreePercent = "-1"
		}
		cap, err := strconv.ParseFloat(v.Capacity, 64)
		if err != nil {
			v.FreePercent = "-1"
		}
		perc := 100 * free / cap
		rpo.FreePercent = fmt.Sprintf("%0.2f", perc)

		rpos = append(rpos, rpo)
	}
	rrf.Summary.Period = rpos

	return rrf.Summary, nil
}
