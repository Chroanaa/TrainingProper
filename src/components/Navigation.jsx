import React from "react";
import Logo from "../assets/images/logo.png";


const Navigation = () => {
    return(
        <div className="flex flex-col justify-start items-start bg-[#4B5320] h-screen w-[20%] p-2">
            <div className=" mb-5">
                <img src={Logo} alt="" />
                <p className="text-center text-[#FFD700] font-bold">QUEZON CITY UNIVERSITY</p>
                <p className="text-center text-white text-[0.7rem]">Reserve Officer’s Training Corps</p>
            </div>

            <div className="mt-5 flex flex-col gap-1">
                <a className="text-[0.7rem] text-white" href="#">COURSE MATERIAL PREPARATION</a>
                <a className="text-[0.7rem] text-white" href="#">EVENT DEPLOYMENT REVIEW</a>
                <a className="text-[0.7rem] text-white" href="#">TRAINING PROGRAM</a>
                <a className="text-[0.7rem] text-white" href="#">TRAINING REPORT</a>
                <a className="text-[0.7rem] text-white" href="#">REPORT CREATION</a>
                <a className="text-[0.7rem] text-white" href="#">INCIDENT REPORT    </a>
                <a className="text-[0.7rem] text-white" href="#">ATTENDANCE REPORT</a>


            </div>
            

         
          
        </div>
    )   

}

export default Navigation;