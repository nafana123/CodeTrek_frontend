import React, {useState} from "react";
import Sidebars from "../../components/Sidebars/Sidebars";

const AllTasks = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);

    return(
        <Sidebars visible={sidebarVisible} onHide={() => setSidebarVisible(false)}/>
)
}

export default AllTasks;