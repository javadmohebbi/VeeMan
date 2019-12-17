package vManWebServer

import (
	WebConf "Ticketing/packages/config"
	"Ticketing/packages/midwares"
	"VeeamManager/package/vManRoutes"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Server - Web server struct
type Server struct {
	//ch 				chan bool
	//waitGroup 		*sync.WaitGroup
	port int
	addr string
	// config vManConfig.Configurations
}

// New - Create new server
func New(addr string, port int) *Server {
	s := &Server{
		//ch:				make(chan bool),
		//waitGroup:		&sync.WaitGroup{},
		addr: addr,
		port: port,
		// config: config,
	}
	return s
}

// Serve - Listen for web request
func (s *Server) Serve() {

	r := mux.NewRouter()

	r.Use(midwares.HandleHttpLogs)

	/**
	Parent Routes
	*/
	apiRoutes := r.PathPrefix("/v1/api").Subrouter()

	/**
	Auth related Routes
	*/
	authRoutes := apiRoutes.PathPrefix("/auth").Subrouter()
	vManRoutes.Auth(authRoutes)

	/**
	VEEAM API CALLs
	*/
	vbemRoutes := apiRoutes.PathPrefix("/vbEntMgr").Subrouter()
	vManRoutes.VbEntMgr(vbemRoutes)

	/**
	UI
	*/
	uiRoutes := apiRoutes.PathPrefix("/ui").Subrouter()
	vManRoutes.UI(uiRoutes)

	/**
	Serve React Web UI
	*/
	conf, err := WebConf.ReadConfig()
	if err == nil {
		//r.PathPrefix("/").Handler(http.StripPrefix("/",http.FileServer(http.Dir(conf.Server.StaticPath))))
		//r.PathPrefix("/home").Handler(http.StripPrefix("/",http.FileServer(http.Dir(conf.Server.StaticPath))))
		//http.Handle("/", r)
		// Serve static files
		r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(conf.Server.StaticPath+"/static/"))))
		r.PathPrefix("/locales/").Handler(http.StripPrefix("/locales/", http.FileServer(http.Dir(conf.Server.StaticPath+"/locales/"))))
		r.PathPrefix("/images/").Handler(http.StripPrefix("/images/", http.FileServer(http.Dir(conf.Server.StaticPath+"/images/"))))

		// Serve index page on all unhandled routes
		r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, conf.Server.StaticPath+"index.html")
		})
	}

	c := cors.New(cors.Options{
		AllowedHeaders:     []string{"*"},
		AllowedOrigins:     []string{"*"},                      // All origins
		AllowedMethods:     []string{"GET", "POST", "OPTIONS"}, // Allowing only get, just an example
		Debug:              true,
		OptionsPassthrough: true,
	})

	c = cors.AllowAll()

	// Where ORIGIN_ALLOWED is like `scheme://dns[:port]`, or `*` (insecure)
	//headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	//originsOk := handlers.AllowedOrigins([]string{"*"})
	//methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	log.Printf("Web server will listen on %s:%d", s.addr, s.port)
	err = http.ListenAndServe(":"+strconv.Itoa(s.port), c.Handler(r))

	if err != nil {
		log.Fatal(err)
	}

}
