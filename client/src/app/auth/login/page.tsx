'use client'

import Image from "next/image";
import banner from "../../../../public/images/banner2.jpg";
import logo from "../../../../public/images/logo1.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/userAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { protectSignInAction } from "@/actions/auth";



function LoginPage() {
  const [formData, setFormData] = useState({
          email:'',
          password:''
      })
         const {login,isLoading} = useAuthStore()
          const router = useRouter()


          const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              setFormData((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
              }));
            };
          
            const handleSubmit = async(event: React.FormEvent)=> {
                 event.preventDefault()
                 const checkFirstLevelOfValidation = await protectSignInAction(formData.email)
                 console.log(checkFirstLevelOfValidation)
                 if(!checkFirstLevelOfValidation.success) {
                   toast(checkFirstLevelOfValidation.error)
                   return
                 }
          
                 const success = await login(formData.email,formData.password)
                 if(success) {
                   toast("Login Successfull")
                  const user = useAuthStore.getState().user
                  if(user?.role === "SUPER_ADMIN") router.push('/super-admin')
                    else router.push('/home')
                 
                  
                 }
            }

    return (
        <div className="min-h-screen bg-[#fff6f4] flex">
            <div className="hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden">
            <Image
          src={banner}
          alt="Register"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
            <div className="max-w-md w-full mx-auto">
              <div className="flex justify-center">
                  <Image
          src={logo}
          alt="logo"
          width={200}
          height={50}
        />
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
            
                <div className="space-y-1">
                   <Label htmlFor="email">Email</Label>
                   <Input
                   id="email"
                   name="email"
                   type="email"
                   placeholder="Enter Your email"
                   className="bg-[#ffede1]"
                    value={formData.email}
                    onChange={handleOnChange}
                   required
                   />
                </div>
                <div className="space-y-1">
                   <Label htmlFor="password">Password</Label>
                   <Input
                   id="password"
                   name="password"
                   type="password"
                   placeholder="Enter Your Password "
                   className="bg-[#ffede1]"
                    value={formData.password}
                    onChange={handleOnChange}
                   required
                   />
                </div>
                <Button type="submit" className="cursor-pointer w-full bg-black text-white hover:bg-black transition-colors">Login</Button>
                <p className="text-center text-[#3f3d56] text-sm">
                    Don't Have An Account <Link href={'/auth/register'} className="text-[#000] hover:underline font-bold">Sign up</Link></p>
              </form>
            </div>
            </div>
        </div>
    )
}

export default LoginPage