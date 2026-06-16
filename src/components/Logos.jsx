import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logo({ text, Icon }) {
	return (
		<div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer'>
			<Icon className='w-[35px] h-[35px] fill-[#03394b]' />
			<span className='text-[#03394b]'>
				{text}
			</span>
		</div>
	)
}

function Logos() {
	return (
		<div className='w-[100vw] min-h-[90px]  flex items-center justify-center flex-wrap gap-4 md:mb-[50px]'>

			<Logo text={"10 Upcoming Online Courses"} Icon={MdCastForEducation} />
			<Logo text={"Community Support"} Icon={FaUsers} />
			<Logo text={"Value for money"} Icon={FaSackDollar} />
			<Logo text={"Lifetime Access"} Icon={SiOpenaccess} />
			<Logo text={"Lifetime Support"} Icon={BiSupport} />

		</div>
	)
}

export default Logos