<template>
    <div>
        <div>
            <table>
                <tr>
                    <th>Rol</th>
                    <div class="float-left" v-for="entity in entitys" :key="entity.id">
                        <th :colspan="entity.perms.length">{{entity.name}}</th>
                        <div>
                            <th v-for="perm in entity.perms" :key="perm">{{perm}}</th>
                        </div>
                    </div>
                    <th><button>+</button></th>
                </tr>
                <tr v-for="rol in input.rols" :key="rol.id">
                    <td><input type="checkbox" name="" id="" :checked="hasAllpermissions(rol.perms)" @click="alternateAllPermitions(rol.id,hasAllpermissions(rol.perms))"><label for="">{{rol.id}}</label></td>
                    <div class="float-left" v-for="entity in entitys" :key="entity.id">
                        <td v-for="perm in entity.perms" :key="perm" @click="alternatePermitions(rol.id,createEntityPermitionString(entity.name,perm))">
                            <input type="text" name="" id="" disabled :value="hasPermition(rol.perms,createEntityPermitionString(entity.name,perm))" >
                        </td>
                    </div>
                </tr>
                <tr>
                    <td><button>+</button></td>
                </tr>
            </table>
            <dir>{{test}}</dir>
            <div>
                <div>
                    <label for="">Entity name:</label>
                    <input type="text" name="" id="" v-model="temp.tempEntity.name">
                </div>
                <div>
                    <label for="">Entity permissions:</label>
                    <div v-for="perm in perms" :key="perm">
                        <input type="checkbox" :value="perm" v-model="temp.tempEntity.perms"><label for="">{{perm}}</label>
                    </div>
                </div>
                <div>
                    <button @click="addNewEntity(temp.tempEntity)">Add new Entity</button>
                </div>
                <div>
                    {{temp.tempEntity}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
           input:{
                rols:[
                    {id:"1", name:"rol 1", perms:["entity1:permission1","entity1:permission2","entity2:permission1","entity4:permission4"]},
                    {id:"2", name:"rol 2", perms:["entity1:permission2","entity2:permission1","entity5:permission5"]},
                    {id:"3", name:"rol 3", perms:["entity2:permission1"]},
                    {id:"4", name:"rol 4", perms:["entity2:permission3"]},
                    {id:"5", name:"rol 5", perms:["entity3:permission4"]},
                    {id:"6", name:"rol 6", perms:["entity1:permission2"]},
                    {id:"7", name:"rol 7", perms:["entity3:permission3"]},
                    {id:"8", name:"rol 8", perms:["entity4:permission4"]},
                    {id:"9", name:"rol 9", perms:["entity5:permission3"]}
                ],
                permissions:[
                    "entity1:permission1",
                    "entity1:permission2",
                    "entity2:permission1",
                    "entity2:permission3",
                    "entity4:permission4",
                    "entity3:permission3",
                    "entity3:permission4",
                    "entity5:permission3",
                    "entity5:permission5"
                ],
           },
           temp:{
               tempEntity:{
                   name:'new Entity',
                   perms:[]
               },
               tempPerm:{
                   name:''
               }
           },
           entitys: [],
           perms:[],
           test:0
        }
    },
    created(){
        this.entitys = this.getEntityObjects(this.mapToEntityPermsArrays(this.input.permissions))
        this.perms = this.getPermissionStrings(this.mapToEntityPermsArrays(this.input.permissions))
    },
    methods:{
        alternateAllPermitions(rol_id,hasAllpermissions){
            if(hasAllpermissions == true){
                let i = 0
                while (i < this.input.rols.length) {
                    if(this.input.rols[i].id == rol_id){
                        this.input.rols[i].perms = []
                    }
                    i+=1
                }
            }else{
                this.setAllPermitions(rol_id)
            }
        },
        setAllPermitions(rol_id){
            let i = 0
            while (i < this.input.rols.length) {
                if(this.input.rols[i].id == rol_id){
                    this.input.rols[i].perms = []
                    let j = 0
                    while(j < this.entitys.length){
                        let k = 0
                        while (k < this.entitys[j].perms.length) {
                            this.input.rols[i].perms = [...this.input.rols[i].perms,this.createEntityPermitionString(this.entitys[j].name,this.entitys[j].perms[k]) ]
                            k+=1
                        }
                       j+=1 
                    }
                    
                }
                i+=1
            }
        },
        alternatePermitions(rol_id,perm){
            let i = 0
            while (i < this.input.rols.length) {
                if(this.input.rols[i].id == rol_id){
                    if(this.hasPermition(this.input.rols[i].perms,perm)){
                        this.input.rols[i].perms = this.input.rols[i].perms.filter(e => e != perm)
                    }else{
                        this.input.rols[i].perms = [...this.input.rols[i].perms,perm]
                    }
                }
                i+=1
            }
        },
        createEntityPermitionString(entityName, permissionName){
            return entityName + ':' + permissionName
        },
        hasAllpermissions(rolPerms){
            let has = false
            if(rolPerms.length == this.input.permissions.length){
                has = true
            }
            return has
        },
        hasPermition(rolPerms,perm){
            let has = false
            if(rolPerms.includes(perm)){
                has = true
            }
            return has
        },
        mapToEntityPermsArrays(perms){
            let entityPerms = []
            let i = 0
            while (i < perms.length) {
                entityPerms = [...entityPerms,perms[i].split(':')]
                i+=1
            }
            return entityPerms
        },
        getPermissionStrings(entityPermsArray){
            let perms = []
            while (entityPermsArray.length > 0) {
                let currentperm = entityPermsArray[0][1]
                entityPermsArray = entityPermsArray.filter(e => e[1] != currentperm)
                perms = [...perms,currentperm]
            }
            return perms
        },
        addNewPerm(newPerm){
            this.perms = [...this.perms,newPerm]
        },
        getEntityObjects(entityPermsArray){
            let entityObjects = []
            let id = 0
            while (entityPermsArray.length > 0) {
                let currentEntity = entityPermsArray[0][0]
                let currentEntityPerms = entityPermsArray.filter(e => e[0] == currentEntity).map(e => e[1])
                entityObjects = [...entityObjects,this.createEntity(id,currentEntity,currentEntityPerms)]
                entityPermsArray = entityPermsArray.filter(e => e[0] != currentEntity)
                id+=1
            }
            return entityObjects
        },
        createEntity(id,name,perms){
            return {
                id,
                name,
                perms
            }
        },
        addNewEntity(entity){
            let i = 0
            while (i < entity.perms.length) {
                this.input.permissions = [...this.input.permissions,entity.perms[i]]
                i+=1
            }
            this.entitys = [...this.entitys,entity]
        }
    }
}
</script>

<style scoped>

</style>

