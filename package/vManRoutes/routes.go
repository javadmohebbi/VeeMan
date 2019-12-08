package vManRoutes

import (
	AuthController "VeeamManager/package/vManControllers/vManAuthController"
	"VeeamManager/package/vManControllers/vManChartsController"
	"VeeamManager/package/vManControllers/vManDashboardsController"
	"VeeamManager/package/vManControllers/vManEntMgrController"
	"VeeamManager/package/vManControllers/vManRowsController"
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

}

// UI - Routes related to UI
func UI(r *mux.Router) {

	r.Use(middleware.ValidateTokenMiddlewareUse)
	//r.Use(middleware.VbEntMgrLogonSessionMidWare)

	r.HandleFunc("/dashboards", vManDashboardsController.GetUserDashboards).Methods("GET")
	r.HandleFunc("/dashboards/get/{objectId}", vManDashboardsController.GetADashboard).Methods("GET")

	r.HandleFunc("/dashboards/create", vManDashboardsController.Create).Methods("POST")
	r.HandleFunc("/dashboards/create/layout", vManDashboardsController.UpdateDashboardLayout).Methods("POST")

	r.HandleFunc("/rows", middleware.VbEntMgrLogonSession(vManRowsController.GetAll)).Methods("GET")

	r.HandleFunc("/dashboards/chart/data/get", middleware.VbEntMgrLogonSession(vManChartsController.GetChartData)).Methods("POST")
	r.HandleFunc("/dashboards/chart/data/set", middleware.VbEntMgrLogonSession(vManChartsController.SetChartData)).Methods("POST")

	r.HandleFunc("/dashboards/chart/widget/get/{objectId}", middleware.VbEntMgrLogonSession(vManWidgetsController.GetWidgetInfo)).Methods("GET")

}
