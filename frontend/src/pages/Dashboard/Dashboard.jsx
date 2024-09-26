/* eslint-disable react/prop-types */
import Calandar from '../../Components/Calandar/Calandar'
import './Dashboard.css'
const Dashboard = ({ user }) => {
  return (
    <div className='container'>
        <Calandar user={user}/>
      
    </div>
  )
}

export default Dashboard
