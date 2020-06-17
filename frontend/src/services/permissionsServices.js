import axios from 'axios';


class PermissionsServices {

    static getPermissions(){
        axios.get("http://localhost:5000/api/entity/getAll").then( res => res).catch(err => (err))
    }

    static addPermission(perm,id){
        return axios.post("http://localhost:5000/api/entity/addPermission/"+id,{perm})
    }
    static createEntity(entity){
        return axios.post("http://localhost:5000/api/entity/create",entity)
    }
}

export default PermissionsServices

/*
{
    "name":"ENTITY_SECONDARY",
    "permissions":["ENTITY_SECONDARY:READ"]
    /addPermission/:id'
}
*/