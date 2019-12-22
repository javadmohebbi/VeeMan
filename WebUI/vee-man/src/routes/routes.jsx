import React from 'react'
import { BrowserRouter as Router, Route, Switch as SwitchRoute, Redirect} from 'react-router-dom'
import Home from '../components/Home/home'
import MainNav from '../components/Navigations/main'
import NotFound from '../components/DefaultPages/notFound'

import { isAuthenticated } from '../services/auth'
import LoginPage from '../components/Login/Login'
import Logout from '../components/Logout/logout'
import CreateDashboard from '../components/Dashboards/create'
import EditDashboard from '../components/Dashboards/edit'
import DeleteDashboard from '../components/Dashboards/delete'
import EditWidget from '../components/Dashboards/Widget/editWidgets'
import JobsList from '../components/Jobs/job'
import ReposList from '../components/Repositories/repos'
import JobBackupSession from '../components/Jobs/jobBackupSession'
import BackupServerList from '../components/BackupServers/list'
import QueryBuilder from '../components/QueryBuilder/queryBuilder'



const MainRouter = () => {

    return (
        <>

            <Router>
                { isAuthenticated() ?  <MainNav /> : <></>}

                    {
                        isAuthenticated()
                        ?
                            <SwitchRoute key="MainSwitchRoute" style={{minHeight: '300px'}}>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/home" component={Home} />
                                <Route exact path="/dashboards" component={Home} />

                                <Route exact path="/logout" component={Logout} />
                                <Route exact path="/login" component={LoginPage} />

                                <Route exact path="/dashboard/create" component={CreateDashboard} />
                                <Route exact path="/dashboard/edit/:id" component={EditDashboard} />
                                <Route exact path="/dashboard/view/:id"
                                  render={ (props) => <EditDashboard {...props} editMode={false} /> }
                                />
                                <Route exact path="/dashboard/delete/:id" component={DeleteDashboard} />
                                <Route exact path="/widget/edit/:id" component={EditWidget} />

                                {/* Management */}
                                <Route exact path="/mgmt/backupservers" component={BackupServerList} />
                                <Route exact path="/mgmt/backupservers/:id/jobs" component={JobsList} />
                                <Route exact path="/mgmt/backupservers/:id/repositories" component={ReposList} />

                                <Route exact path="/mgmt/jobs/:id/info" component={JobBackupSession} />

                                <Route exact path="/mgmt/query" component={QueryBuilder} />


                                <Route exact path="*" component={NotFound} key="notfound"/>
                            </SwitchRoute>
                        :
                            <SwitchRoute key="MainSwitchRoute" style={{minHeight: '300px'}}>
                                <Route exact path="/login" component={LoginPage} />
                                <Redirect exact to="/login"></Redirect>
                            </SwitchRoute>
                    }
                {/* { isAuthenticated() ?  <Footer /> : <></> } */}
            </Router>
        </>
    )

}



export default MainRouter
