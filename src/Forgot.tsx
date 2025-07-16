
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
function Forgot() {
    const navigate= useNavigate();

  return (
    <div className="bg-[background: #FCF7ED]">
       

    <div className=" flex items-center justify-center mt-9 pt-[29px]">
    <Card>
  <CardHeader className="pb-0">
    <CardTitle className="text-2xl font-[ReadexPro] self-stretch"><center>Forgot Password</center></CardTitle>
    <CardDescription>
    <p className="pb-3 text-center">Don't worry if you have forgotten password.<br/> Simply provide email address used to sign up,<br/> and we will send you a link to reset it.</p>
  
    </CardDescription>  <div className="grid w-full max-w-sm items-center gap-1.5">

      <Label htmlFor="email" className="mt-3">Email</Label>
      <Input type="email" id="email" placeholder="Ex:Johnwesly@abc.com" />

    </div>
    
  </CardHeader>
  <CardContent className="pb-4 pt-2">
  <Button  className="bg-[#FFC900] text-black w-[300px]">Send Password Reset Email</Button>

  </CardContent>
  
  <CardFooter className="flex items-center justify-center">
  <p className="pb-3 text-center text-sm"> <a href="#" className="text-[#2F80ED]" onClick={()=>navigate("/login")}>Back to Login</a></p>
   
 
  
  </CardFooter>
  
</Card>


    
    </div>
 

    
    </div>
    
  )
}

export default Forgot