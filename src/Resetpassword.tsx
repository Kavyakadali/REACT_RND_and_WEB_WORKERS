
import { Button } from "./components/ui/button"

import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "@radix-ui/react-label"
function Resetpassword() {
    const navigate= useNavigate();

  return (
    <div className="bg-[background: #FCF7ED]">
       

    <div className=" flex items-center justify-center mt-9 pt-[29px]">
    <Card>
  <CardHeader className="pb-0">
    <CardTitle className="text-2xl font-[ReadexPro] self-stretch"><center>Reset Password</center></CardTitle>
    <CardDescription>
    <p className="pb-3 text-center">Password</p>
  
    </CardDescription>  <div className="grid w-full max-w-sm items-center gap-1.5">

      <Label htmlFor="email" className="mt-3">New Password</Label>
      <Input type="email" id="email" placeholder="New Password" />
      <Label htmlFor="email" className="mt-3">Confirm New Password</Label>
      <Input type="email" id="email" placeholder="Confirm Password" />

    </div>
    
  </CardHeader>
  <CardContent className="pb-4 pt-2">
  <Button  className="bg-[#FFC900] text-black w-[300px]">Reset Password </Button>

  </CardContent>
  
  <CardFooter className="flex items-center justify-center">
  <p className="pb-3 text-center text-sm"> <a href="#" className="text-[#2F80ED]" onClick={()=>navigate("/login")}>Back to Login</a></p>
   
 
  
  </CardFooter>
  
</Card>


    
    </div>
 

    
    </div>
    
  )
}

export default Resetpassword