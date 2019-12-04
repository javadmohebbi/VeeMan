package vManRoutes

import (
	AuthController "VeeamManager/package/vManControllers/vManAuthController"
	"VeeamManager/package/vManControllers/vManDashboardsController"
	"VeeamManager/package/vManControllers/vManEntMgrController"
	"VeeamManager/package/vManControllers/vManRowsController"
	UsersController "VeeamManager/package/vManControllers/vManUsersController"
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

// API Calls
func VbEntMgr(r *mux.Router) {

	// CallAPIs
	r.Use(middleware.ValidateTokenMiddlewareUse)
	r.Use(middleware.VbEntMgrLogonSessionMidWare)

	r.HandleFunc("/test", vManEntMgrController.CallAPI).Methods("POST")

	r.HandleFunc("/backupServers", vManEntMgrController.BackupServers).Methods("POST")

}

// UI
func UI(r *mux.Router) {

	r.Use(middleware.ValidateTokenMiddlewareUse)
	//r.Use(middleware.VbEntMgrLogonSessionMidWare)

	r.HandleFunc("/dashboards", vManDashboardsController.GetUserDashboards).Methods("GET")
	r.HandleFunc("/dashboards/get/{objectId}", vManDashboardsController.GetADashboards).Methods("GET")

	r.HandleFunc("/dashboards/create", vManDashboardsController.Create).Methods("POST")
	r.HandleFunc("/dashboards/create/layout", vManDashboardsController.UpdateDashboardLayout).Methods("POST")

	r.HandleFunc("/rows", middleware.VbEntMgrLogonSession(vManRowsController.GetAll)).Methods("GET")

}
