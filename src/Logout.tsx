



import {
  Card,

  CardHeader,
  CardTitle,
} from "./components/ui/card"

function Logout() {
 

  return (
    <div className="bg-[background: #FCF7ED]">
       

    <div className=" flex items-center justify-center mt-9 pt-[29px]">
    <Card>
  <CardHeader className="pb-0 h-[250px] w-[280px]">
    <CardTitle className="text-2xl font-[ReadexPro] self-stretch"><center>Log Out</center></CardTitle>
    <p className="pb-3 pt-9 mt-9 text-xl text-center text-green-600 font-medium">Succesfully Logout</p>
    <p className="pb-3 text-center text-sm pt-12 mt-4">  <a href="/login" className="text-[#2F80ED]">Login Again</a></p>
   
 
   
      
  </CardHeader>
  
  
  
 
</Card>


    
    </div>
 

    
    </div>
    
  )
}

export default Logout