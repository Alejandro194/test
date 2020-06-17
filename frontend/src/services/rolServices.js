import axios from 'axios';


class RolServices {

    static getRols(){
        return new Promise(async(resolve, reject) => {
            try {
                const res = await axios.get("http://localhost:5000/api/roles/getAll")
                const rols = res.data
                resolve(
                    rols
                )
            } catch (err) {
                reject(err)
            }
        })
    }

    static createRol(rol){
        return axios.post("http://localhost:5000/api/roles/create",rol)
    }
}

export default RolServices