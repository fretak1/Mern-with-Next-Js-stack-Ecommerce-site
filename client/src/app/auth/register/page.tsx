'use client'


import Image from "next/image";
import banner from "../../../../public/images/banner2.jpg";
import logo from "../../../../public/images/logo1.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { protectSignUpAction } from "@/actions/auth";
import { toast } from "sonner"
import { useAuthStore } from "@/store/userAuthStore";
import { useRouter } from 'next/navigation'
import { ArrowRight } from "lucide-react";



function RegisterPage() {

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:''
    })
    const {register,isLoading} = useAuthStore()
    const router = useRouter()
    

      const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async(event: React.FormEvent)=> {
       event.preventDefault()
       const checkFirstLevelOfValidation = await protectSignUpAction(formData.email)
       console.log(checkFirstLevelOfValidation)
       if(!checkFirstLevelOfValidation.success) {
         toast(checkFirstLevelOfValidation.error)
         return
       }

       const userID = await register(formData.name,formData.email,formData.password)
       if(userID) {
        toast("Registration Successfull")
        router.push('/auth/login')
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
                   <Label htmlFor="name">Full Name</Label>
                   <Input
                   id="name"
                   name="name"
                   type="text"
                   placeholder="Enter Your Full Name"
                   className="bg-[#ffede1]"
                   required
                    value={formData.name}
                    onChange={handleOnChange}
                   />
                </div>
                <div className="space-y-1">
                   <Label htmlFor="email">Email</Label>
                   <Input
                   id="email"
                   name="email"
                   type="email"
                   placeholder="Enter Your email"
                   className="bg-[#ffede1]"
                   required
                    value={formData.email}
                    onChange={handleOnChange}
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
                   required
                    value={formData.password}
                    onChange={handleOnChange}
                   />
                </div>
                <Button disabled={isLoading} type="submit" className="cursor-pointer w-full bg-black text-white hover:bg-black transition-colors">
                 {
                  isLoading ? 'Creating Account...' : <>Create Account<ArrowRight className="w-4 h-4 ml-2"/></>
                 }
                  </Button>
                <p className="text-center text-[#3f3d56] text-sm">
                    Allready Have An Account <Link href={'/auth/login'} className="text-[#000] hover:underline font-bold">Sign In</Link></p>
              </form>
            </div>
            </div>
        </div>
    )
}

export default RegisterPage