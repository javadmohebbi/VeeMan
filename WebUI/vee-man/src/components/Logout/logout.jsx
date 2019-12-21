import {useHistory} from 'react-router-dom'
import {ApiLogout} from '../../services/auth'

const Logout = props => {

    const h = useHistory()

    ApiLogout()


    setTimeout(() => {
        h.replace('?logoutOk') 
        h.go('/login')
        return ''
    }, 500);

    
    

}

export default Logout