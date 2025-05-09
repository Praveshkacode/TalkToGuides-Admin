import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddExpert = () => {

    const [expImg,setExpImg] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [experience,setExperience] = useState('1 Year')
    const [about,setAbout] = useState('')
    const [specialities, setSpecialities] = useState([]);
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')

    const {backendUrl,aToken} = useContext(AdminContext)


    const onSubmitHandler = async(event)=>{
        event.preventDefault()

        try {
            if(!expImg){
                return toast.error('Image Not Selected')
            }
            const formData = new FormData()
            formData.append('image',expImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('password',password)
            formData.append('experience',experience)
            formData.append('about',about)
            formData.append('specialities',JSON.stringify(specialities))
            formData.append('address',JSON.stringify({line1:address1,line2:address2}))

            // console log form data
            formData.forEach((value,key)=>{
                console.log(`${key}:${value}`);
            })

            const {data} = await axios.post(backendUrl+'/api/admin/add-expert',formData,{headers:{aToken}})

            if(data.success){
                toast.success(data.message)
                setExpImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setAddress1('')
                setAddress2('')
                setAbout('')
                setSpecialities([])
            }else{
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const specialityOptions = [
        "Psychic Expert",
        "Love & Relationship",
        "Tarot Reading",
        "Fortune Telling",
        "Astrology",
        "Palm Reading"
      ];
      
      
      const handleSpecialityChange = (type, price) => {
        setSpecialities((prev) => {
          const exists = prev.find((s) => s.type === type);
          if (exists) {
            return prev.map((s) => s.type === type ? { type, price } : s);
          } else {
            return [...prev, { type, price }];
          }
        });
      };
      
      const removeSpeciality = (type) => {
        setSpecialities((prev) => prev.filter((s) => s.type !== type));
      };
      

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Expert</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
            <label htmlFor="exp-img">
                <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={expImg ? URL.createObjectURL(expImg): assets.upload_area} alt="" />
            </label>
            <input onChange={(e)=>setExpImg(e.target.files[0])} type="file" id="exp-img" hidden/>
            <p>Upload Expert <br />picture</p>
        </div>
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
            <div className='w-full lg:flex-1 flex flex-col gap-4'>
                <div className='flex-1 flex flex-col gap-1'>
                    <p>Expert Name</p>
                    <input onChange={(e)=>setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                </div>
                <div className='flex-1 flex flex-col gap-1'>
                    <p>Expert Email</p>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border rounded px-3 py-2'  type="text" placeholder='Email' required />
                </div>
                <div className='flex-1 flex flex-col gap-1'>
                    <p>Expert Password</p>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border rounded px-3 py-2'  type="password" placeholder='Password' required />
                </div>
                <div className='flex-1 flex flex-col gap-1'>
                    <p>Experience</p>
                    <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2'  name="" id="">
                        <option value="1 Year">1 Year</option>
                        <option value="2 Year">2 Year</option>
                        <option value="3 Year">3 Year</option>
                        <option value="4 Year">4 Year</option>
                        <option value="5 Year">5 Year</option>
                        <option value="6 Year">6 Year</option>
                        <option value="7 Year">7 Year</option>
                        <option value="8 Year">8 Year</option>
                        <option value="9 Year">9 Year</option>
                        <option value="10 Year">10 Year</option>
                    </select>
                </div>
                

            </div>
            <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
                <p>Specialities (with price)</p>
                {specialityOptions.map((type) => {
                    const selected = specialities.find((s) => s.type === type);
                    return (
                    <div key={type} className="flex items-center gap-1 mb-1">
                        <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={(e) => {
                            if (e.target.checked) {
                            handleSpecialityChange(type, 0); // default price 0
                            } else {
                            removeSpeciality(type);
                            }
                        }}
                        />
                        <label>{type}</label>
                        {selected && (
                        <input
                            type="number"
                            placeholder="Price"
                            value={selected.price}
                            className="border rounded px-2 py-1 w-24"
                            onChange={(e) =>
                            handleSpecialityChange(type, parseInt(e.target.value) || 0)
                            }
                        />
                        )}
                    </div>
                    );
                })}
                </div>
            <div className='flex-1 flex flex-col gap-0.5'>
                <p>Address</p>
                <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-1'  type="text" placeholder='address 1' required/>
                <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-1'  type="text" placeholder='address 2' required/>
            </div>

        </div>
      </div>
            <div>
                <p className='mt-4 mb-2'>About Expert</p>
                <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='write about expert' rows={5} required/>
            </div>
            <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>add expert</button>
      
      </div>

    </form>
  )
}

export default AddExpert
