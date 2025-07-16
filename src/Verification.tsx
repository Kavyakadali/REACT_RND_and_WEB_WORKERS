
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
function Verification() {
    const navigate= useNavigate();

  return (
    <div className="bg-[background: #FCF7ED]">
       

    <div className=" flex items-center justify-center mt-9 pt-[29px]">
    <Card>
  <CardHeader className="pb-0">
    <CardTitle className="text-2xl font-[ReadexPro] self-stretch"><center>Verification</center></CardTitle>
    <CardDescription>
    <p className="pb-3 text-center">Enter Verification Code sent to<br/><span className=" flex flex-row justify-center text-xs text-u">user@gmail.com <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 21 20" fill="none">
  <path d="M18.2594 5.73196L14.768 2.24134C14.6519 2.12524 14.5141 2.03314 14.3624 1.9703C14.2107 1.90746 14.0482 1.87512 13.884 1.87512C13.7198 1.87512 13.5572 1.90746 13.4056 1.9703C13.2539 2.03314 13.1161 2.12524 13 2.24134L3.36641 11.8749C3.24983 11.9906 3.15741 12.1283 3.09451 12.2799C3.0316 12.4316 2.99948 12.5943 3.00001 12.7585V16.2499C3.00001 16.5815 3.1317 16.8994 3.36612 17.1338C3.60054 17.3682 3.91849 17.4999 4.25001 17.4999H17.375C17.5408 17.4999 17.6997 17.4341 17.8169 17.3169C17.9342 17.1997 18 17.0407 18 16.8749C18 16.7092 17.9342 16.5502 17.8169 16.433C17.6997 16.3158 17.5408 16.2499 17.375 16.2499H9.50938L18.2594 7.49993C18.3755 7.38386 18.4676 7.24604 18.5304 7.09437C18.5933 6.94269 18.6256 6.78013 18.6256 6.61595C18.6256 6.45177 18.5933 6.2892 18.5304 6.13753C18.4676 5.98585 18.3755 5.84804 18.2594 5.73196ZM7.74141 16.2499H4.25001V12.7585L11.125 5.88353L14.6164 9.37493L7.74141 16.2499ZM15.5 8.49134L12.0094 4.99993L13.8844 3.12493L17.375 6.61634L15.5 8.49134Z" fill="black"/>
</svg> </span></p>
  
    </CardDescription>  <div className="grid w-full max-w-sm items-center gap-1.5">

      <Label htmlFor="email" className="mt-3">Verification Code</Label>
      <Input type="email" id="email" placeholder="Ex:Johnwesly@abc.com" />

    </div>
    
  </CardHeader>
  <CardContent className="pb-4 pt-2">
  <Button  className="bg-[#27AE60] text-black w-[300px]">Send Password Reset Email</Button>

  </CardContent>
  
  <CardFooter className="flex items-center justify-center">
  <p className="pb-3 text-center text-sm"> <a href="#" className="text-[#2F80ED]" onClick={()=>navigate("/login")}>Back to Login</a></p>
   
 
  
  </CardFooter>
  
</Card>


    
    </div>
 

    
    </div>
    
  )
}

export default Verification