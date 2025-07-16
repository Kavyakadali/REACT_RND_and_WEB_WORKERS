
import { Button } from "./components/ui/button"


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "@radix-ui/react-label"
function Signin() {
 

  return (
    <div className="bg-[background: #FCF7ED]">
       

    <div className=" flex items-center justify-center mt-9 pt-[29px]">
    <Card>
  <CardHeader className="pb-0">
    <CardTitle className="text-2xl font-[ReadexPro] self-stretch"><center>Signin</center></CardTitle>
    <p className="pb-3 text-center">Greetings, Kindly Enter Your Credentials.</p>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    
 
      <Label htmlFor="password">Enter your Password :   </Label>
      <Input type="password" id="password" placeholder='password'  />
    </div>
    
      
  </CardHeader>
  <CardContent className="pb-4 pt-2">
  <Button  className="bg-[#FFC900] text-black w-[300px]">Signin</Button>

  </CardContent>
  
</Card>


    
    </div>
 

    
    </div>
    
  )
}

export default Signin