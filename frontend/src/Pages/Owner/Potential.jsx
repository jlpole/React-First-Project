
import OwnerSidebar from '../../Components/OwnerSidebar';
import { useState, useEffect } from 'react';
import OwnerTopbar from '../../Components/Ownertopbar';
import PotentialBuyersTable from '../../Components/PotentialTable';








export default function OwnerPotentialBuyer(){
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setLoggedInUser(JSON.parse(storedUser));
  }, []);



  return (
      <div className="flex">
        <OwnerSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <OwnerTopbar user={loggedInUser} />
          <PotentialBuyersTable/>
        </div>
  
        
      </div>
    );
  }