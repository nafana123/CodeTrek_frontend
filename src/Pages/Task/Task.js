import React, {useEffect, useState} from "react";
import Sidebars from "../../components/Sidebars/Sidebars";
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const Task = () => {
    const { id } = useParams();
    const { language } = useParams()
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const task = async ()  => {
        try {
            const response = await axiosInstance.get(`/task/${id}/${language}`);
            console.log(response.data)
        }catch (err){
            console.log('Задача не найдена')
        }
    }

    useEffect(() => {
        task();
    }, []);

    return(
        <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)}/>
    )
}
export default Task;