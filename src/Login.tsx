
import { Link } from "react-router-dom"

import { Button } from "./components/ui/button"


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
function Login() {
 

  return (
    <div className="bg-[background: #FCF7ED]">
       

    <div className=" flex items-center justify-center mt-9 pt-[29px]">
    <Card>
  <CardHeader className="pb-0">
    <CardTitle className="text-2xl font-[ReadexPro] self-stretch"><center>Login</center></CardTitle>
    <p className="pb-3 text-center">Greetings, Kindly Enter Your Credentials.</p>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    
 
      <Label htmlFor="password">Password :   </Label>
      <Input type="password" id="password" placeholder='password'  />
    </div>
    <div className="flex items-center justify-end">
      <p className="font-bold text-sm"> 
        <Link to="/Forgot">Forget Password </Link>
        
        {/* <a href="/Forgot"  >Forget Password </a> */}
        </p>
    </div>
      
  </CardHeader>
  <CardContent className="pb-4 pt-2">
  <Button  className="bg-[#FFC900] text-black w-[300px]" >Login</Button>

  </CardContent>
  
  <CardFooter className="flex items-center justify-center">
    
    
      <hr className="w-[93.5px] h-[1px] bg-[#A1A1A1]"/><CardDescription><p className="p-2 pt-1"> or Login With  </p></CardDescription>  <hr className="w-[93.5px] h-[1px] bg-[#A1A1A1]"/>
    
  </CardFooter>
  <CardFooter><Button variant={"outline"} className=" text-black w-[300px] pt-0 pb-1">Signin With Numble SSO</Button>
  </CardFooter><p className="pb-3 text-center text-sm">New to eSigns?  <a href="/Signin" className="text-[#2F80ED]">Signup Here</a></p>
   
 
</Card>


    
    </div>
 

    
    </div>
    
  )
}

export default Login