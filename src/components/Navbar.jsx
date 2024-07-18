import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
const Navbar = () => {
  const {currentUser}=useSelector((state)=>state.user);
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to={'/'} className="cursor-pointer">
        <h2 className='font-extrabold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>Zee</span>
          <span className='text-slate-700'>Estate</span>
        </h2>
         </Link>
         <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
      <input type="text" placeholder='Search....' className='bg-transparent focus:outline-none w-24 sm:w-64' />
      <FaSearch className='text-slate-600'/>
    </form>
    <ul className='flex gap-4'>
      <Link to={'/'}>
      <li className='hidden sm:inline text-slate-700 hover:underline font-bold'>Home</li>
      </Link>
      <Link to={'/about'}>
      <li className='hidden sm:inline text-slate-700 hover:underline font-bold'>About</li>
      {/* <li>Profile</li> */}
      </Link>
      <Link to={'/profile'}>
      {
        currentUser ? (
          <img src={currentUser.avatar} alt="avatar" className="border rounded-full size-10"/>
        ):(
          <li className='text-slate-700 hover:underline font-bold'>SignIn</li>
        )
        }
      </Link>
        {/* <Link to={'/sign-in'}>
      <li className='text-slate-700 hover:underline font-bold'>SignIn</li>
      </Link> */}
      {/* <li>SignOut</li> */}
    </ul>
    </div>
    </header>
  )
}

export default Navbar
