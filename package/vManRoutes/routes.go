package vManRoutes

import (
	AuthController "VeeamManager/package/vManControllers/vManAuthController"
	"VeeamManager/package/vManControllers/vManBackupServersController"
	"VeeamManager/package/vManControllers/vManChartsController"
	"VeeamManager/package/vManControllers/vManDashboardsController"
	"VeeamManager/package/vManControllers/vManEntMgrController"
	"VeeamManager/package/vManControllers/vManJobsController"
	"VeeamManager/package/vManControllers/vManRowsController"
	"VeeamManager/package/vManControllers/vManStatisticsController"
	UsersController "VeeamManager/package/vManControllers/vManUsersController"
	"VeeamManager/package/vManControllers/vManWidgetsController"
	middleware "VeeamManager/package/vManMiddlewares"

	"github.com/gorilla/mux"
)

// Auth - Routes
func Auth(r *mux.Router) {
	//r.HandleFunc("/register", UsersController.Register).Methods("POST")
	r.HandleFunc("/login", AuthController.Login).Methods("POST")

	// Protected
	r.HandleFunc("/profile", middleware.ValidateTokenMiddleware(UsersController.Profile)).Methods("GET")
}

// VbEntMgr - API Calls
func VbEntMgr(r *mux.Router) {

	// CallAPIs
	r.Use(middleware.ValidateTokenMiddlewareUse)
	r.Use(middleware.VbEntMgrLogonSessionMidWare)

	r.HandleFunc("/test", vManEntMgrController.CallAPI).Methods("POST")

	r.HandleFunc("/backupServers", vManEntMgrController.BackupServers).Methods("POST")

	// r.HandleFunc("/statistics/jobs", vManJobsController.GetJobStatistics).Methods("Get")

}

// UI - Routes related to UI
func UI(r *mux.Router) {

	r.Use(middleware.ValidateTokenMiddlewareUse)
	//r.Use(middleware.VbEntMgrLogonSessionMidWare)

	// Dashboards Routes
	r.HandleFunc("/dashboards", vManDashboardsController.GetUserDashboards).Methods("GET")
	r.HandleFunc("/dashboards/get/{objectId}", vManDashboardsController.GetADashboard).Methods("GET")
	r.HandleFunc("/dashboards/create", vManDashboardsController.Create).Methods("POST")
	r.HandleFunc("/dashboards/update/title/{objectId}", vManDashboardsController.UpdateTitle).Methods("PUT")
	r.HandleFunc("/dashboards/delete/{objectId}", vManDashboardsController.Delete).Methods("DELETE")
	r.HandleFunc("/dashboards/create/layout", vManDashboardsController.UpdateDashboardLayout).Methods("POST")

	r.HandleFunc("/rows", middleware.VbEntMgrLogonSession(vManRowsController.GetAll)).Methods("GET")

	// Statistics Routes
	r.HandleFunc("/statistics/summary/overview",
		middleware.VbEntMgrLogonSession(vManStatisticsController.GetSummaryOverview)).Methods("GET")
	r.HandleFunc("/statistics/summary/overview/vms",
		middleware.VbEntMgrLogonSession(vManStatisticsController.GetVMsSummaryOverview)).Methods("GET")
	r.HandleFunc("/statistics/job/statistics",
		middleware.VbEntMgrLogonSession(vManStatisticsController.GetStatistics)).Methods("GET")
	r.HandleFunc("/statistics/summary/processed_vms",
		middleware.VbEntMgrLogonSession(vManStatisticsController.GetProtectedVMsOverview)).Methods("GET")
	r.HandleFunc("/statistics/summary/repository",
		middleware.VbEntMgrLogonSession(vManStatisticsController.GetRepositorySummary)).Methods("GET")

	// Charts Routes
	r.HandleFunc("/dashboards/chart/data/get", middleware.VbEntMgrLogonSession(vManChartsController.GetChartData)).Methods("POST")
	r.HandleFunc("/dashboards/chart/data/set", middleware.VbEntMgrLogonSession(vManChartsController.SetChartData)).Methods("POST")
	r.HandleFunc("/dashboards/chart/widget/get/{objectId}",
		middleware.VbEntMgrLogonSession(vManWidgetsController.GetWidgetInfo)).Methods("GET")

	// BackupServers
	r.HandleFunc("/backupservers/list", middleware.VbEntMgrLogonSession(vManBackupServersController.List)).Methods("GET")
	r.HandleFunc("/backupserver/{objectId}/jobs",
		middleware.VbEntMgrLogonSession(vManJobsController.GetJobsRelatedToBackupServer)).Methods("GET")

	r.HandleFunc("/job/{objectId}/backupSession",
		middleware.VbEntMgrLogonSession(vManJobsController.GetJobsStatus)).Methods("GET")

}
