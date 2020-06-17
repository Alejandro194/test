<template>
    <div class="main">
            {{entitys}}
            
            <!-- Button to open the modal login form -->
            <div class="flex-container">
                <div>
                    <button @click="openModal('id01')">Add Entity</button>
                </div>
                <div>
                    <button @click="openModal('m2')">Add Permissions to Entity</button>
                </div>
                <div>
                    <button @click="listDuplicatedRols()">List duplicated Roles</button>
                </div>
            </div>
            
            <!-- The Modal -->
            <div id="m2" class="modal" ref="permModal">
            <!-- Modal Content -->
                <form class="modal-content animate">
                    <div class="modal-header">
                        <span class="close" title="Close Modal" @click="closeModal('m2')">&times;</span>
                        <h2>Add new permission to entity</h2>
                    </div>
                    <div class="container">
                        <label for="uname"><b>Entity Name</b></label>
                        <select name="" id="" v-model="sEntityName">
                            <option v-for="entity in entitys" :key="entity._id" ><label for="">{{entity.name}}</label></option>
                        </select>
                        <div v-if="(!isStringBlank(sEntityName))">
                            <label for="psw"><b>Permission</b></label>
                            <div class="flex-container">
                                <input class="invalid" type="text" placeholder="Enter permission" name="psw" required v-model="sPermName">
                            </div>
                        </div>
                    </div>

                    <div v-if="(!isStringBlank(sPermName))" class="container text-aling-center" style="background-color:#f1f1f1">
                        <button type="button" @click="addPermitionToEntity()">Add new Permission</button>
                    </div>
                </form>
            </div>
            <!-- The Modal -->
            <div id="id01" class="modal" ref="entityModal">
                <!-- Modal Content -->
                <form class="modal-content animate">
                    <div class="modal-header">
                        <span class="close" title="Close Modal" @click="closeModal('id01')">&times;</span>
                        <h2>Add new entity</h2>
                    </div>
                    <span class="close" title="Close Modal" @click="closeModal('id01')">&times;</span>
                    <div class="container">
                        <label for="uname"><b>Entity Name</b></label>
                        <input type="text" placeholder="Enter Entity Name" name="uname" required v-model="tEntityName">

                        <div v-if="(!isStringBlank(tEntityName))">
                            <label for="psw"><b>Permissions</b></label>
                            <div class="flex-container">
                                <input type="text" placeholder="Enter permission" name="psw" required v-model="tPermName">
                                <button class="addBtn" @click.prevent="tEntityPerms = addTempPerm(tEntityPerms,tPermName)">+</button>
                            </div>
                            <ul v-if="tEntityPerms.length > 0" class="col-5 gap-5 margin-top-2">
                                <li v-for="(perm,index) in tEntityPerms" :key="index"><label for="">{{perm}}</label></li>
                            </ul>
                        </div>
                    </div>
                    <div v-if="(!isStringBlank(tEntityName) && tEntityPerms.length > 0)" class="container text-aling-center" style="background-color:#f1f1f1">
                        <button type="button" class="addBtn" @click="this.entitys = createEntity(tEntityName,tEntityPerms)">Add new Entity</button>
                    </div>
                </form>
            </div>

        <div>
            <div class="table-wrapper">
                <table>
                    <col>
                        <tr>
                            <th rowspan="2">Rols</th>
                            <th v-for="(entity,index) in entitys" :key="entity._id" :colspan="entity.permissions.length"
                                @mouseenter="makeCheckboxVisible(entity._id+index)" @mouseleave="makeCheckboxInvisible(entity._id+index)">
                                <input @click="alternateAllEntityPermissions(entity)" :checked="isAllEntityPermissionsAdded(entity)" class="tableCheckbox" type="checkbox" name="" :id="entity._id+index">
                                {{entity.name}}
                            </th>
                        </tr>
                        <tr>
                            <th v-for="(perm,index) in permissions" :key="index"
                                @mouseenter="makeCheckboxVisible(perm + index)" @mouseleave="makeCheckboxInvisible(perm + index)">
                                <input type="checkbox" class="tableCheckbox" :checked="isPermissionInAllRols(perm)" name="" :id="perm + index" @click="alternatePermissionInAllRols(perm)">
                                {{parseToDisplayFormat(perm.split(":")[1])}}
                                
                            </th>
                        </tr>
                        <tr v-for="(rol,index) in rols" :key="index">
                            <td @mouseenter="makeCheckboxVisible(rol.name+index)" @mouseleave="makeCheckboxInvisible(rol.name+index)" @dblclick="removeRol(rol)">
                                <input @click="alternateAllPermission(rol,permissions)" class="tableCheckbox" :checked="hasAllpermissions(rol.permissions,permissions)" type="checkbox" name="" :id="rol.name+index">
                                
                                <span title="Double click to remove rol" ><label for="">{{rol.name}}</label></span>
                            </td>
                            <td v-for="(perm,index) in permissions" :key="index" @click="rol.permissions = alternatePermission(rol,perm)">
                                <label for="" v-if="rol.permissions.includes(parseToDBFormat(perm)) == true">X</label>
                            </td>

                        </tr>
                        <tr class="display-none" ref="inputTr">
                        </tr>
                        <tr ref="addNewRol">
                            <td v-if="flag == true" :colspan="permissions.length + 1" @click="flag = false">
                                Add new rol
                            </td>
                        </tr>
                        <tr v-if="flag == false">
                            <td :colspan="permissions.length + 1">
                                <div class="flex-container">
                                    <input type="text" name="" id="" v-model="tRolName" placeholder="New rol name">
                                    <button v-show="!isStringBlank(tRolName)" class="addBtn" @click="rols = addNewRol(tRolName)">+</button>
                                </div>
                            </td>
                        </tr>
                </table>
            </div>
            <div class="margin-top-2">
                
            </div>
            <div>
                <ul id="myUl" v-for="(rol,index) in duplicated" :key="index">
                    <ul>
                        li
                    </ul>
                </ul>
            </div>
        </div>
        <div class="text-aling-center">
            <button @click="save()">Save</button>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import RolServices from '../services/rolServices'
import PermissionsServices from "../services/permissionsServices"
export default {
    data(){
        return {
            tRolName:'',
            sEntityName:"",
            sPermName:"",
            tEntityName:"",
            tEntityPerms:"",
            tPermName:"",
            temp:"",
            rols:[],
            permissions:[],
            entitys: [],
            error:[],
            test1:[],
            duplicated:[],
            flag: true
            
        }
    },
    created(){
    },
    mounted(){
        
        this.getRols()
        axios.get("http://localhost:5000/api/entity/getAll").then( res => this.permissions = res.data).catch(err => (this.error = [...this.error,err]))
        axios.get("http://localhost:5000/api/entity/getAllEntitys").then( res => this.entitys = res.data).catch(err => (this.error = [...this.error,err]))
        
        this.entitys = this.permissions.length
    },
    
    methods:{   
        save(){
            axios.put("http://localhost:5000/api/roles/save",this.rols).then().catch(err => (this.error = [...this.error,err]))
        },
        listDuplicatedRols(){
            axios.get("http://localhost:5000/api/roles/duplicateRoles").then(res => this.duplicated = res.data).catch(err => (this.error = [...this.error,err]))
            //this.duplicated.uniqueIds.[]
        },
        removeRol(rol){
            this.rols = this.rols.filter(r => r._id != rol._id)
            axios.delete("http://localhost:5000/api/roles/remove/" + rol._id).then().catch(err => (this.error = [...this.error,err]))
        },
        addNewRol(name){
            let perms = this.permissions.map(p => this.parseToDBFormat(p)).filter(a => a.includes("READ"))
            this.test1 = perms
            let newRol = this.createNewRol(name,perms.map(p => this.parseToDBFormat(p)))
            axios.post("http://localhost:5000/api/roles/create",newRol).then(res =>this.rols.push({_id:res.data._id,name,permissions:perms})).catch(err => (this.error = [...this.error,err]))
            this.flag = true
            return this.rols
        },
        createNewRol(name,permissions){
            return {
                name,
                permissions
            }
        },
        getMatchesInPerms(){
            return this.permissions.filter(p => this.parseToDBFormat(p).includes('READ'))
            
        },
        addPermitionToEntity(){
            this.closeModal('m2')
            PermissionsServices.addPermission(this.sPermName,this.getSelectEntity(this.sEntityName)._id)
            this.permissions = [...this.permissions,this.sEntityName + ":" + this.sPermName]
            this.sEntityName = ""
            this.sPermName = ""
        },
        getSelectEntity(name){
            return this.entitys.filter(e => e.name == name).pop()
        },
        alternatePermissionInAllRols(perm){
            if(this.isPermissionInAllRols(perm)){
                this.removePermissionToAllRols(perm)
            }else{
                this.addPermissionToAllRols(perm)
            }
        },

        isPermissionInAllRols(perm){
            let parsePerm = this.parseToDBFormat(perm)
            let i = 0
            let is = true
            while (i < this.rols.length && true) {
                if(!this.hasPermition(this.rols[i].permissions,parsePerm)){
                    is = false
                }
                i+=1
            }
            return is
        },
        removePermissionToAllRols(perm){
            let i = 0
            let parsePerm = this.parseToDBFormat(perm)
            while (i < this.rols.length) {
                if(this.hasPermition(this.rols[i].permissions,parsePerm)){
                    this.rols[i].permissions = this.rols[i].permissions.filter(p => p != parsePerm)
                    this.deletePermissionToARol(this.rols[i],parsePerm)
                }
                i+=1
            }
        },
        addPermissionToAllRols(perm){
            let i = 0
            while (i < this.rols.length) {
                if(!this.hasPermition(this.rols[i].permissions,perm)){
                    this.addPermissionToARol(this.rols[i],perm)
                }
                i+=1
            }
        },
        isAllEntityPermissionsAdded(entity){
            let i = 0
            let all = true
            while (i < this.rols.length && all) {
                if(!this.hasAllpermissions(this.rols[i].permissions,entity.permissions.map(p => entity.name+':'+p).map(p => this.parseToDBFormat(p)))){
                    all = false
                }
                i+=1
            }
            return all
        },
        alternateAllEntityPermissions(entity){
            if(this.isAllEntityPermissionsAdded(entity)){
                this.deleteAllEntityPermsFromRols(entity)
            }else{
                this.addAllEntityPermissionToAllRol(entity)
            }
        },
        deleteAllEntityPermsFromRols(entity){
            let i = 0
            while (i < this.rols.length) {
                let rol = this.rols[i]
                let j = 0
                while (j < entity.permissions.length) {
                    let parsePerm = this.parseToDBFormat(entity.name + ":" + entity.permissions[j])
                    if(this.hasPermition(rol.permissions, parsePerm)){
                        this.deletePermissionToARol(rol,parsePerm)
                    }
                    j+=1
                }
                i+=1
            }
        },
        addAllEntityPermissionToAllRol(entity){
            let i = 0
            while (i < this.rols.length) {
                if(!this.hasAllpermissions(this.rols[i].permissions,entity.permissions.map(p => entity.name+':'+p).map(p => this.parseToDBFormat(p)))){
                    this.addAllPermissionToARol(this.rols[i], entity.permissions.map(p => entity.name+':'+p))
                }
                i+=1
            }
        },
        alternateAllPermission(rol,perms){
            if(this.hasAllpermissions(rol.permissions,perms.map(e => this.parseToDBFormat(e)))){
                this.removeAllPermission(rol)
            }else{
                this.addAllPermissionToARol(rol,perms)
            }
        },
        removeAllPermission(rol){
            rol.permissions = []
            axios.put("http://localhost:5000/api/roles/removeAllPermissions/"+rol._id).catch(err => (this.error = [...this.error,err]))
            
        },
        addAllArray(a1,a2){
            let i = 0
            while (i< a2.length) {
                a1 = [...a1,a2[i]]
                i+=1
            }
            return a1
        },
        addAllPermissionToARol(rol,perms){
            let parsePerm = perms.map(p => this.parseToDBFormat(p))
            rol.permissions = this.addAllArray(rol.permissions,parsePerm.filter(p => !rol.permissions.includes(p)))
            axios.put("http://localhost:5000/api/roles/addPermission/"+rol._id,{perm:parsePerm}).catch(err => (this.error = [...this.error,err]))
        },
        addPermissionToARol(rol,permString){
            let parsePerm = [this.parseToDBFormat(permString)]
            rol.permissions = [...rol.permissions,parsePerm[0]]
            axios.put("http://localhost:5000/api/roles/addPermission/"+rol._id,{perm:parsePerm}).catch(err => (this.error = [...this.error,err]))
            return rol.permissions
        },
        deletePermissionToARol(rol,permString){
            let parsePerm = this.parseToDBFormat(permString)
            rol.permissions = rol.permissions.filter(e => e!=parsePerm)
            axios.put("http://localhost:5000/api/roles/removePermission/"+rol._id,{perm:parsePerm}).catch(err => (this.error = [...this.error,err]))
            return rol.permissions
        },
        hasAllpermissions(rolPerms,allPerms){
            let hasAll = true
            let i = 0
            while(i < allPerms.length && hasAll){
                if (!rolPerms.includes(this.parseToDBFormat(allPerms[i]))) {
                    hasAll = false
                }
                i+=1
            }
            return hasAll
        },
        hasPermition(rolPerms,perm){
            let has = false
            if(rolPerms.includes(perm)){
                has = true
            }
            return has
        },
        alternatePermission(rol,perm){
            if(this.hasPermition(rol.permissions,this.parseToDBFormat(perm))){
                rol.permissions = this.deletePermissionToARol(rol,perm)
            }else{
                rol.permissions = this.addPermissionToARol(rol,perm)
            }
            return rol.permissions
        },
        parseToDBFormat(string){
            let stringArray = []
            stringArray = string.split(" ").map(s => s.toUpperCase())
            let parseString = ""
            let i = 0
            while(i < stringArray.length){
                parseString = parseString + stringArray[i]
                if(i+1 != stringArray.length && parseString.charAt(parseString.length-1)!="_"){
                    parseString = parseString + "_"
                }
                i+=1
            }
            return parseString
        },
        async getRols(){
            try {
                this.rols = await RolServices.getRols()
            } catch (err) {
                this.error = err
            }
        },
        async createRol(rol){
            try {
                this.test1 = await RolServices.createRol(rol)
            } catch (err) {
                this.error = err
            }
        },
        getPermissions(){
            this.permissions = PermissionsServices.getPermissions(this.permissions)
        },
        async addPermissions(perm,id){
            try {
                this.permissions = await PermissionsServices.addPermission(perm,id)
            } catch (err) {
                this.error = err
            }
        },
        async createEntity(entityName, entityPerms){
            this.closeModal('id01')
                axios.post("http://localhost:5000/api/entity/create",{name:entityName,permissions:entityPerms}).then(res => this.entitys.push({_id:res.data._id,name:entityName,permissions:entityPerms})).catch(err => (this.error = [...this.error,err]))
                if(entityPerms.length> 0){
                    this.permissions =this.addAllArray(this.permissions,entityPerms)
                }
                this.tEntityName = ""
                this.tPermName = ""
            return this.entitys
        },

        mapToEntityPermsArrays(permsArray){
            let entityPerms = []
            let i = 0
            while (i < permsArray.length) {
                entityPerms = [...entityPerms,permsArray[i].split(':')]
                i+=1
            }
            this.test1 = 0
            return entityPerms
        },
        getEntityObjects(entityPermsArray){
            let entityObjects = []
            let id = 0
            while (entityPermsArray.length > 0) {
                let currentEntity = entityPermsArray[0][0]
                let currentEntityPerms = entityPermsArray.filter(e => e[0] == currentEntity).map(e => e[1])
                entityObjects = [...entityObjects,this.createEntity('e'+id,currentEntity,currentEntityPerms)]
                entityPermsArray = entityPermsArray.filter(e => e[0] != currentEntity)
                id+=1
            }
            return entityObjects
        },
        isEntityWithSameName(entityName,permsArray){
            return permsArray.map(e => e).includes(entityName)
        },
        openModal(id){
             document.getElementById(id).style.display = "block";
        },
        closeModal(id){
            document.getElementById(id).style.display = "none";
        },
        addTempPerm(tempEntityPerms,tempPerm){
            if(!this.isStringBlank(tempPerm)){
                let parsePerm = this.parseToDisplayFormat(tempPerm)
                tempEntityPerms = [...tempEntityPerms,parsePerm]
                this.tPermName = ''
            }
            return tempEntityPerms
        },
        parseToDisplayFormat(string){
            let stringArray = []
            stringArray = string.split("_").map(s => this.firstUpperCaseRestLowerCase(s))
            let parseString = ""
            let i = 0
            while(i < stringArray.length){
                parseString = parseString + stringArray[i]
                if(i+1 != stringArray.length){
                    parseString = parseString + " "
                }
                i+=1
            }
            return parseString
        },
        firstUpperCaseRestLowerCase(string){
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
        },
        isStringBlank(string){
            let isBlank = true
            if(string.split("").filter(s => s!=" ").length > 0){
                isBlank = false
            }
            return isBlank
        },
        makeCheckboxVisible(checkId){
            document.getElementById(checkId).style.visibility = "visible"
        },
        makeCheckboxInvisible(checkId){
            document.getElementById(checkId).style.visibility = "hidden"
        },
        
    }
}
</script>

<style scoped>

.main{
    margin: 2%;
    border-style: ridge;
}

.modal-header {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

/* Full-width input fields */
input[type=text], input[type=password] , select{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.invalid{
    border: 1px solid rgb(253, 3, 3);
}

/* Set a style for all buttons */
button {
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
}
.addBtn{
  background-color: rgb(76, 122, 175);
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: auto;
}

button:hover {
  opacity: 0.8;
}

/* Extra styles for the cancel button */
.cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

/* Center the image and position the close button */
.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
  position: relative;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  padding: 16px;
}

span.psw {
  float: right;
  padding-top: 16px;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  padding-top: 60px;
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button (x) */
.close {
  position: absolute;
  right: 25px;
  top: 0;
  color: #000;
  font-size: 35px;
  font-weight: bold;
}

.delete-rol {
  float: right;
  right: 25px;
  top: 0;
  color: rgb(100, 99, 99);
  font-size: 20px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: red;
  cursor: pointer;
}

.delete-rol:hover,
.cdelete-rol:focus {
  color: red;
  cursor: pointer;
}

/* Add Zoom Animation */
.animate {
  -webkit-animation: animatezoom 0.6s;
  animation: animatezoom 0.6s
}

@-webkit-keyframes animatezoom {
  from {-webkit-transform: scale(0)} 
  to {-webkit-transform: scale(1)}
}
  
@keyframes animatezoom {
  from {transform: scale(0)} 
  to {transform: scale(1)}
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.psw {
     display: block;
     float: none;
  }
  .cancelbtn {
     width: 100%;
  }
}



table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.table-wrapper{
    overflow: auto
}
td, th {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f2f2f2
}

.visibility-hidden{
    visibility: hidden;
}
.display-none{
    display: none;
}

.display-table-row{
    display: table-row
}

.tableCheckbox{
    visibility: hidden;
    float: left;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

/* The Close Button */
.close {
  color: #000;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.modal-header {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

.modal-body {padding: 2px 16px;}

.modal-footer {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

#myUL {
  /* Remove default list styling */
  list-style-type: none;
  padding: 0;
  margin: 0;
}

#myUL li{
  border: 1px solid #ddd; /* Add a border to all links */
  margin-top: -1px; /* Prevent double borders */
  background-color: #f6f6f6; /* Grey background color */
  padding: 12px; /* Add some padding */
  text-decoration: none; /* Remove default text underline */
  font-size: 18px; /* Increase the font-size */
  color: black; /* Add a black text color */
  display: block; /* Make it into a block element to fill the whole list */
}
</style>